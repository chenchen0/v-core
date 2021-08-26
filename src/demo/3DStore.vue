<template>
    <div class="store-page">
        <div id="store-container">3d store</div>
    </div>
</template>

<script>
import {Store, Box, Shelf, utils} from "../V3DStore";
import * as THREE from "three";

const loadTextures = function() {
    let texture = utils.loadTexture(require("../assets/textures/box-1.jpg"));
    utils.preTexture("box_1", texture);
};
loadTextures();
export default {
    data() {
        return {
            store: null
        };
    },
    mounted() {
        this.createStore();
    },
    methods: {
        createStore() {
            this.store = new Store({
                domContainer: "#store-container",
                shadow: true
            });
            //放一个物品
            this.store.add(
                new Box({
                    materialProps: {
                        // map: utils.loadTexture(require("../assets/textures/box-1.jpg"))
                        map: "box_1"
                    }
                }).get3d()
            );
            //放-片物品
            // this.addBoxs();
        },
        addBoxs() {
            /*
                放置 10 * 2 * 8 * 2 个物品
                口口口口口口口口口口    口口口口口口口口口口
                口口口口口口口口口口    口口口口口口口口口口
                
                口口口口口口口口口口    口口口口口口口口口口
                口口口口口口口口口口    口口口口口口口口口口
                
                .
                .
                .
                x8
            */
            let areas = 2,
                locs = 8,
                rows = 2,
                deep = 10;
            let boxGap = 10,
                locGap = 200,
                areaGap = 600;
            let x0 = -2000,
                z0 = -1500;
            let sizeX = 120,
                sizeZ = 100;
            let size = [sizeX, 140, sizeZ];
            _.times(areas, a => {
                _.times(locs, l => {
                    _.times(rows, r => {
                        _.times(deep, i => {
                            let x = x0 + (sizeX + boxGap) * i + (areaGap + sizeX * deep + boxGap + (deep - 1)) * a;
                            let z = z0 + (locGap + sizeZ * rows + boxGap * (rows - 1)) * l + (sizeZ + boxGap) * r;
                            let position = [x, 0, z];
                            this.store.add(new Box({position, size}).get3d());
                        });
                    });
                });
            });
            this.store.camera.position.set(1500, 1000, 800);
        }
    }
};
</script>
<style lang="scss">
.store-page {
    #store-container {
        background-color: #ccc;
        height: 100vh;
    }
}
</style>
