import _ from "lodash";
import * as THREE from "three";

/*
    **** 本工具内置了2种平面贴图排列方式，如下所示 ****

    ====== 平面6方格 - 排列1 ======
    改排列节省空间
    贴图映射到立方体如下：
    其中 y 轴向上，py 朝向 z 负方向， ny 朝向 z 正方向
   0,1                  1,1
     -------------------
    |         |         |
    |    pz   |    nz   |
    |         |         |
    |-------------------| 0.666
    |         |         |
    |    py   |    ny   |
    |         |         |
    |-------------------| 0.333
    |         |         |
    |    px   |    nx   |
    |         |         |
     -------------------
   0,0       0.5         1,0


    ====== 平面6方格 - 排列2 ======
    该排列更符合物理结构，方便绘图
    |----------|
    |          |
    |     3    |
    |     py   |
    |----------|----------|----------|----------|
    |          |          |          |          |
    |     5    |     1    |     6    |     2    |
    |     pz   |     px   |     nz   |     nx   |
    |----------|----------|----------|----------|
    |          |
    |     4    |
    |     ny   |
    |----------|



    立方体单面 UV 映射如下：
   0               1
     -------------
    |           / |
    |         /   |
    |       /     |
    |     /       |
    |   /         |
    | /           |
     -------------
   2               3

 */
// 单面 UV 映射
const FAVE_UV_PATH = [0, 1, 1, 1, 0, 0, 1, 0];

// 排列 1
const CUBE_MAP_1_X = [0, 0.5, 1];
const CUBE_MAP_1_Y = [0, 0.333, 0.666, 1];
const CUBE_MAP_1 = _.times(6, function(i) {
    let x = i % 2,
        y = parseInt(i / 2);
    return _.map(FAVE_UV_PATH, (v, j) => {
        return j % 2 == 0 ? CUBE_MAP_1_X[x + v] : CUBE_MAP_1_Y[y + v];
    });
});
const CUBE_FACE_UV_1 = new THREE.BufferAttribute(new Float32Array(_.flatten(CUBE_MAP_1)), 2);

//排列 2
const CUBE_MAP_2_X = [0, 0.25, 0.5, 0.75, 1];
const CUBE_MAP_2_Y = [0, 0.333, 0.666, 1];
const CUBE_MAP_2_POS = [
    [1, 1],
    [3, 1],
    [0, 2],
    [0, 0],
    [0, 1],
    [2, 1]
];
const CUBE_MAP_2 = _.map(CUBE_MAP_2_POS, ([x, y]) => {
    return _.map(FAVE_UV_PATH, (v, i) => {
        return i % 2 == 0 ? CUBE_MAP_2_X[x + v] : CUBE_MAP_2_Y[y + v];
    });
});
const CUBE_FACE_UV_2 = new THREE.BufferAttribute(new Float32Array(_.flatten(CUBE_MAP_2)), 2);

const CUBE_FACE_UV = [CUBE_FACE_UV_1, CUBE_FACE_UV_2];

export let CUBE_FACE_UV_GRID_COMPACT = 0; //排列 1， 紧凑排列贴图
export let CUBE_FACE_UV_GRID_SPREAD = 1; //排列 2， 展开平面图

export function buildCudeFaceUv(geometry, cubeFaceType = CUBE_FACE_UV_GRID_SPREAD) {
    let uv = CUBE_FACE_UV[cubeFaceType];
    if (!uv) {
        console.error("Unknow cobe face type: " + cubeFaceType);
        return;
    }
    geometry.setAttribute("uv", uv);
}

//预设贴图
const TEXTURE_MAP = {};
export function preTexture(key, texture) {
    TEXTURE_MAP[key] = texture;
}
//加载贴图, 如果 img 是数组，则加载为 CubeTexture
export function loadTexture(img) {
    if (img instanceof Array) {
        return new THREE.CubeTextureLoader().load(img);
    } else {
        return new THREE.TextureLoader().load(img);
    }
}

export function wrapTexture(props = {}) {
    let wrap = {...props};
    _.forEach(props, function(v, k) {
        if ((k === "map" || _.endsWith(k, "Map")) && typeof v === "string") {
            if (TEXTURE_MAP[v]) {
                wrap[k] = TEXTURE_MAP[v];
            } else {
                delete wrap[k];
            }
        }
    });
    return wrap;
}
