import {_} from "core-js";
import * as THREE from "three";

import * as utils from "../utils";

const BOX_GEOMETRY = new THREE.BoxGeometry();

export default class Box {
    constructor({
        size = [120, 150, 100], //x, y, z
        position = [0, 0, 0], //位置
        posBaseGround = true, //position 以地面为基准, 将自动调整 position.y, 增加物体高度的 1/2
        geometry = BOX_GEOMETRY,
        faceUvType = utils.CUBE_FACE_UV_GRID_SPREAD, //贴图映射模式
        material,
        materialProps, //材质参数, 其中贴图会被特殊处理, map: "box_1" //string / Texture, 贴图, string 表示内置贴图
        castShadow = true, //产生阴影
        receiveShadow = false, //接收阴影
        instanceCount = 0 //批量创建相同的box（详见InstancedMesh）
    } = {}) {
        let [x, y, z] = position;
        if (posBaseGround) {
            y += size[1] / 2;
        }
        material =
            material ||
            new THREE.MeshLambertMaterial({
                // color: 0xcccccc,
                ...utils.wrapTexture(materialProps)
            });
        if (geometry && geometry instanceof THREE.BoxGeometry) {
            utils.buildCudeFaceUv(geometry, faceUvType);
        }
        let muti = instanceCount > 0;
        let Mesh = muti ? THREE.InstancedMesh : THREE.Mesh;
        let cube = new Mesh(geometry, material, instanceCount);
        cube.position.set(x, y, z);
        cube.scale.set(...size);
        cube.receiveShadow = !!receiveShadow;
        cube.castShadow = !!castShadow;

        this._object3d = cube;
    }
    //获取 Object3D 对象
    get3d() {
        return this._object3d;
    }
    clone() {}
}
