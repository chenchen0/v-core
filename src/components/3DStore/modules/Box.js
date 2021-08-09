import * as THREE from "three";

export default class Box {
    constructor({
        size = [80, 180, 120], //x, y, z
        position = [0, 0, 0], //位置
        posBaseGround = true, //position 以地面为基准, 将自动调整 position.y, 增加物体高度的 1/2
        color = "#ccc"
    } = {}) {
        let [x, y, z] = position;
        if (posBaseGround) {
            y += size[1] / 2;
        }
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({color});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.scale.set(...size);

        this.mesh = cube;
    }
}
