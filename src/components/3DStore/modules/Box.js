import * as THREE from "three";

export default class Box {
    constructor({
        size = [120, 150, 100], //x, y, z
        position = [0, 0, 0], //位置
        posBaseGround = true, //position 以地面为基准, 将自动调整 position.y, 增加物体高度的 1/2
        geometry = new THREE.BoxGeometry(),
        material = new THREE.MeshLambertMaterial({color: 0xcccccc}),
        color, // = 0xcccccc,
        castShadow = true, //产生阴影
        receiveShadow = false //接收阴影
    } = {}) {
        let [x, y, z] = position;
        if (posBaseGround) {
            y += size[1] / 2;
        }
        color && material.color.set(color);
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.scale.set(...size);
        cube.receiveShadow = !!receiveShadow;
        cube.castShadow = !!castShadow;

        this._object3d = cube;
    }

    getObject3d() {
        return this._object3d;
    }
}
