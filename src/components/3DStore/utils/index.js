import _ from "lodash";
import * as THREE from "three";

/*
    平面贴图映射到立方体如下：
   0,1                  1,1
     -------------------
    |         |         |
    |    pz   |    nz   |
    |         |         |
     -------------------  0.666
    |         |         |
    |    py   |    ny   |
    |         |         |
     -------------------  0.333
    |         |         |
    |    px   |    nx   |
    |         |         |
     -------------------
   0,0       0.5         1,0

 */
const CUBE_MAP_X = [0, 0.5, 1];
const CUBE_MAP_Y = [0, 0.333, 0.666, 1];
const CUBE_MAP = _.times(6, function(i) {
    let col = i % 2,
        row = parseInt(i / 2);
    return [
        CUBE_MAP_X[col],
        CUBE_MAP_Y[row],
        CUBE_MAP_X[col + 1],
        CUBE_MAP_Y[row],
        CUBE_MAP_X[col + 1],
        CUBE_MAP_Y[row + 1],
        CUBE_MAP_X[col],
        CUBE_MAP_Y[row + 1]
    ];
});

/*
    立方体单面 UV 映射

    3              2
     -------------
    | \           |
    |   \         |
    |     \       |
    |       \     |
    |         \   |
    |           \ |
     -------------
    0              1
*/
const CUBE_FACE_VERTEX_UV = new THREE.BufferAttribute(new Float32Array(_.flatten(CUBE_MAP)), 2);
//  _.times(12, function(i) {
//     let face = parseInt(i / 2),
//         p = i % 2;
//     let map = CUBE_MAP[face],
//         pos = p == 0 ? [0, 1, 3] : [1, 2, 3];
//     return [map[pos[0]], map[pos[1]], map[pos[2]]];
// });

export function buildCudeFaceUv(geometry) {
    console.log(CUBE_FACE_VERTEX_UV);
    // geometry.faceVertexUvs[0] = CUBE_FACE_VERTEX_UV;
    geometry.setAttribute("uv", CUBE_FACE_VERTEX_UV);
    // var uvAttribute = geometry.attributes.uv;

    // for (var i = 0; i < uvAttribute.count; i++) {
    //     var u = uvAttribute.getX(i);
    //     var v = uvAttribute.getY(i);

    //     u = u ? 1 : 0.5;
    //     v = v ? 0.666 : 0.333;

    //     uvAttribute.setXY(i, u, v);
    // }
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
