import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import $ from "jquery";
import _ from "lodash";

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
        grids = true, // bool/[GridHelper] 网格
        background = new THREE.Color(0xe0e0e0), //背景色
        cameraPos = [500, 300, 0],
        cameraView = [1, 5000], //摄像机视图距离区间
        lookAt = [0, 100, 0]
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
        this.scene.fog = new THREE.Fog("#ccc", ...cameraView);
        //网格
        this.setGrid(grids);
        //光源
        this.setLights(lights);
        //相机
        this.camera = camera || new THREE.PerspectiveCamera(75, width / height, ...cameraView);
        this.camera.position.set(...cameraPos);
        this.camera.lookAt(...lookAt);
        //渲染器
        this.renderer = renderer || new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(width, height);
        //控制器
        this.setCameraCtrl();
        //开始渲染
        this.el.empty();
        this.el.append(this.renderer.domElement);
        this._animate();
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
        this.renderer.render(this.scene, this.camera);
    };
    setGrid(grids) {
        //移除旧对象
        this._grids && this.scene.remove(this._grid);
        if (this._grids) {
            this._grids.forEach(grid => {
                grid.removeFromParent();
            });
            this._grids = null;
        }
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
        grids.forEach(grid => {
            this.scene.add(grid);
        });
        this._grids = grids;
    }
    setLights(lights) {
        if (!lights) {
            // let ambient = new THREE.AmbientLight(0x404040); //环境光
            let ambient = new THREE.AmbientLight(0xff0000); //环境光
            let dire = new THREE.DirectionalLight(0xffffff, 1); // 平行光
            dire.position.set(1, 1, 1);
            dire.target = new THREE.Object3D();
            lights = [ambient, dire];
        }
        this.lights = lights;
        this.lights.forEach(light => {
            this.scene.add(light);
            if (light.target) {
                this.scene.add(light.target);
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
    addAnimate(key, func) {
        this._animateFuncs[key] = func;
    }
    removeAnimate(key) {
        delete this._animateFuncs[key];
    }
    add(obj) {
        this.scene.add(obj);
    }
}
