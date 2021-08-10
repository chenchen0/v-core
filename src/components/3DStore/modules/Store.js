import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import $ from "jquery";
import _ from "lodash";

import Box from "./Box";

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
        lookAt = [0, 100, 0],
        showCoords = false
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
        //地面
        this.setGround(...groundSize);
        //坐标系
        this.showCoords(showCoords);
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
    setGround(x, z) {
        this.remove(this._ground);
        this._ground = new Box({
            size: [x, 1, z],
            position: [0, -1, 0],
            receiveShadow: true,
            color: 0xeeeeee
        }).getObject3d();
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
            dire.position.set(1, 1, 1);
            dire.castShadow = true;
            // dire.bias = 0.05;
            // dire.shadow.camera.near = 1; // default
            // dire.shadow.camera.far = 100; // default
            // dire.target = new THREE.Object3D();

            let dire2 = new THREE.DirectionalLight(0xffffff, 0.9); // 平行光
            dire2.position.set(-1, -1, -1);
            // dire2.castShadow = true;

            lights = [ambient, dire];
        }
        this._lights = lights;
        this._lights.forEach(light => {
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
