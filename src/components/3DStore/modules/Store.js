import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import $ from "jquery";
import _ from "lodash";

import Box from "./Box";

const _dev = process.env.NODE_ENV == "development";

export default class Store {
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
        groundSize = [5000, 3500], //场地大小
        grids = true, // bool/[GridHelper] 网格
        background = new THREE.Color(0xe0e0e0), //背景色
        cameraPos = [-200, 300, 500],
        cameraView = [1, 5000], //摄像机视图距离区间
        lookAt = [0, 160, 0], //摄像机目标点
        fog, //雾
        shadow = false //阴影
    }) {
        this.el = $(domContainer);
        if (!domContainer || this.el.length == 0) {
            throw new Error("No dom container for 3d store");
        }
        let width = this.el.width(),
            height = this.el.height();
        //场景
        this.scene = new THREE.Scene();
        this.scene.background = background;
        this.scene.fog = fog || new THREE.FogExp2("#ccc", 1.2 / cameraView[1]); //new THREE.Fog("#ccc", ...cameraView);
        //网格
        this.setGrid(grids);
        //光源
        this.setLights(lights);
        //地面
        if (groundSize) {
            const ground = new THREE.Mesh(
                new THREE.PlaneGeometry(...groundSize),
                new THREE.MeshPhongMaterial({color: 0xeeeeee, depthWrite: false})
            );
            ground.rotation.x = -Math.PI / 2;
            ground.receiveShadow = true;
            this.setGround(ground);
        }
        //坐标系
        this.showCoords(_dev);
        //相机
        this.camera = camera || new THREE.PerspectiveCamera(75, width / height, ...cameraView);
        this.camera.position.set(...cameraPos);
        //渲染器
        this.renderer = renderer || new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = !!shadow;
        // this.renderer.shadowMap.type = THREE.BasicShadowMap;
        //控制器
        this.setCameraCtrl();
        this.lookAt(lookAt);
        //开始渲染
        this.el.empty();
        this.el.append(this.renderer.domElement);
        _dev && this._showStats();
        this._animate();
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
            let ambient = new THREE.AmbientLight(0xdddddd); //环境光
            let dire = new THREE.DirectionalLight(0xffffff, 0.3); // 平行光
            dire.position.set(10000, 10000, 10000);
            dire.castShadow = true;
            // dire.bias = -0.01;
            dire.shadow.camera.near = 1;
            dire.shadow.camera.far = 20000;
            dire.shadow.camera.top = -10000;
            dire.shadow.camera.right = 10000;
            dire.shadow.camera.left = -10000;
            dire.shadow.camera.bottom = 10000;
            dire.shadow.mapSize.set(8192, 8192);
            // dire.shadow.camera.updateProjectionMatrix();

            lights = [ambient, dire];
        }
        this._lights = lights;
        this._lights.forEach(light => {
            this.scene.add(light);
            if (light.target) {
                // this.scene.add(light.target);
            }
        });
    }
    setCameraCtrl(ctrl) {
        if (!ctrl) {
            ctrl = new OrbitControls(this.camera, this.renderer.domElement);
            ctrl.dampingFactor = 0.2;
            ctrl.enableDamping = true;
            ctrl.maxPolarAngle = Math.PI * 0.48;
            ctrl.screenSpacePanning = false;
            let fog = this.scene.fog;
            let maxDistance = fog.far * 0.8 || 1 / fog.density;
            ctrl.maxDistance = maxDistance;
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
