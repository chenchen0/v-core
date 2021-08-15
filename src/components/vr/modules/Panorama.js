import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import $ from "jquery";
import _ from "lodash";

const _dev = process.env.NODE_ENV == "development";

const atmosphereMaterial = {
    uniforms: {c: {type: "f", value: 0.5}, p: {type: "f", value: 3}},
    vertexShader: `
        varying vec3 vNormal;
        void main() 
        {
            vNormal = normalize( normalMatrix * normal );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `
        uniform float c;
        uniform float p;
        varying vec3 vNormal;
        void main() 
        {
            float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p ); 
            gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;
        }
    `
};

export default class Panorama {
    //动画列表
    _animateFuncs = {};
    //控制器
    _ctrls = {};
    /*
        domContainer: string/dom，视图容器
    */
    constructor({
        camera,
        lights,
        renderer,
        domContainer, // string/dom，视图容器
        grids = null, // bool/[GridHelper] 网格
        coords = false, //bool, 显示坐标系
        background = null, //new THREE.Color(0xe0e0e0), //背景色, color / texture
        transparent = false, //透明背景
        cameraPos = [0, 0, 200],
        cameraView = [1, 1000], //摄像机视图距离区间
        lookAt = [0, 0, 0], //摄像机目标点
        cameraCtrl, //相机控制器
        autoRotateSpeed = -1, //相机自动旋转速度
        globe = {
            //球体选项
            radius: 0, //球半径，0 表示不创建球体
            materialProps: {}, //球体材质参数，用于创建球体
            mesh: null, //直接指定mesh，优先级高于materialProps
            outGlow: false //外发光
        }
    }) {
        this.el = $(domContainer);
        if (!domContainer || this.el.length == 0) {
            throw new Error("No dom container for 3d store");
        }
        this._autoRotateSpeed = autoRotateSpeed;
        let width = this.el.width(),
            height = this.el.height();
        //场景
        this.scene = new THREE.Scene();
        if (background && !transparent) {
            this.scene.background = background;
        }
        //网格
        this.setGrid(grids);
        //光源
        this.setLights(lights);
        //坐标系
        this.showCoords(coords);
        //球体
        globe.radius && this.createGlobe(globe);
        //相机
        this.camera = camera || new THREE.PerspectiveCamera(75, width / height, ...cameraView);
        this.camera.position.set(...cameraPos);
        // this.camera.layers.enable(1);
        //渲染器
        this.renderer = renderer || new THREE.WebGLRenderer({antialias: true, alpha: transparent});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setSize(width, height);
        // this.renderer.setClearColor(new THREE.Color(0x000000), 0.0);
        // this.renderer.autoClear = false;
        // this.renderer.shadowMap.type = THREE.BasicShadowMap;
        //控制器
        this.setCameraCtrl(cameraCtrl);
        this.lookAt(lookAt);
        //开始渲染
        this.el.empty();
        this.el.append(this.renderer.domElement);
        //状态监视
        _dev && this._showStats();
        //动画
        this._animate();
        //容器尺寸变化
        this._resize();
    }
    _showStats() {
        this._stats = new Stats();
        this.el.append(this._stats.dom);
    }
    _resize() {
        this._resizeObserver && this._resizeObserver.disconnect();
        let timeout = null;
        this._resizeObserver = new ResizeObserver(entries => {
            timeout && clearTimeout(timeout);
            timeout = setTimeout(() => {
                let width = this.el.width(),
                    height = this.el.height();
                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
                this._ctrls.camera && this._ctrls.camera.update();
                this.renderer.setSize(width, height);
            }, 200);
        });
        this._resizeObserver.observe(this.el[0]);
    }

    _animate = time => {
        requestAnimationFrame(this._animate);
        _.forEach(this._animateFuncs, (func, key) => {
            try {
                func && func();
            } catch (err) {
                console.error("3d store animate err, key=" + key, err);
            }
        });
        _.forEach(this._ctrls, ctrl => {
            ctrl.update();
        });
        this._stats && this._stats.update();
        this.renderer.render(this.scene, this.camera);
    };
    createGlobe({radius, materialProps, mesh, outGlow}) {
        if (!mesh) {
            const geometry = new THREE.IcosahedronGeometry(radius, 15);
            const material = new THREE.MeshLambertMaterial({...materialProps});
            mesh = new THREE.Mesh(geometry, material);
        }
        this._globe = mesh;
        this.add(mesh);
        outGlow && this.createOutGlow(mesh);
    }
    createOutGlow(baseMesh) {
        let material = new THREE.ShaderMaterial({
            transparency: true,
            ...atmosphereMaterial
        });
        var mesh = new THREE.Mesh(baseMesh.geometry.clone(), material);
        mesh.scale.set(1.1, 1.1, 1.1);
        mesh.material.side = THREE.BackSide;
        this.add(mesh);
    }
    setGround(ground) {
        this.remove(this._ground);
        this._ground = ground;
        this.add(this._ground);
    }
    showCoords(show) {
        if (show) {
            this._coords =
                this._coords ||
                _.map([0xff7777, 0x77ff77, 0x7777ff], (color, i) => {
                    let to = [0, 0, 0];
                    to[i] = 10000;
                    const material = new THREE.LineBasicMaterial({color});
                    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(...to)]);
                    const line = new THREE.Line(geometry, material);
                    return line;
                });
            this.add(this._coords);
        } else {
            this.remove(this._coords);
        }
    }
    setGrid(grids) {
        //移除旧对象
        this.remove(this._grids);
        this._grids = null;
        if (grids === true) {
            grids = [];
            let grid1 = new THREE.GridHelper(5000, 5, 0x000000, 0x000000);
            grid1.material.opacity = 0.2;
            grid1.material.transparent = true;
            grids.push(grid1);

            let grid2 = new THREE.GridHelper(5000, 50, 0x000000, 0x000000);
            grid2.material.opacity = 0.1;
            grid2.material.transparent = true;
            grids.push(grid2);
        }
        this.add(grids);
        this._grids = grids;
    }
    setLights(lights) {
        this.remove(this._lights);
        if (!lights) {
            let ambient = new THREE.AmbientLight(0xffffff); //环境光
            // let dire = new THREE.DirectionalLight(0xffffff, 0.3); // 平行光
            // dire.position.set(1, 1, 1);
            // let hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
            lights = [ambient];
        }
        this._lights = lights;
        _.forEach(lights, light => {
            this.scene.add(light);
            if (light.target) {
                this.scene.add(light.target);
            }
        });
    }
    setCameraCtrl(ctrl) {
        if (!ctrl) {
            ctrl = new OrbitControls(this.camera, this.renderer.domElement);
            // ctrl.dampingFactor = 0.5;
            ctrl.enableDamping = true;
            ctrl.screenSpacePanning = false;
            ctrl.enablePan = false;
            ctrl.autoRotate = this._autoRotateSpeed !== 0;
            ctrl.autoRotateSpeed = this._autoRotateSpeed;
        }
        this._ctrls.camera = ctrl;
    }
    lookAt(lookAt) {
        if (this._ctrls.camera) {
            this._ctrls.camera.target.set(...lookAt);
        } else {
            this.camera.lookAt(...lookAt);
        }
    }
    addAnimate(key, func) {
        this._animateFuncs[key] = func;
    }
    removeAnimate(key) {
        delete this._animateFuncs[key];
    }
    add(objs) {
        if (objs && !(objs instanceof Array)) {
            objs = [objs];
        }
        _.forEach(objs, obj => {
            this.scene.add(obj);
        });
    }
    remove(objs) {
        if (objs && !(objs instanceof Array)) {
            objs = [objs];
        }
        _.forEach(objs, obj => {
            this.scene.remove(obj);
        });
    }
}
