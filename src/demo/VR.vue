<template>
    <div class="vr-page">
        <div id="vr-container">VR</div>
    </div>
</template>

<script>
import {Panorama} from "../VR";

import * as THREE from "three";

export default {
    data() {
        return {
            vr: null
        };
    },
    mounted() {
        this.createVR();
    },
    methods: {
        createVR() {
            const textureLoader = new THREE.TextureLoader();

            // const background = textureLoader.load(require("../assets/textures/house.jpg"));
            // background.mapping = THREE.EquirectangularReflectionMapping;
            // background.encoding = THREE.sRGBEncoding;

            const map = textureLoader.load(require("../assets/textures/earth2.jpg"));
            map.mapping = THREE.EquirectangularReflectionMapping;
            map.encoding = THREE.sRGBEncoding;

            this.vr = new Panorama({
                domContainer: "#vr-container",
                // background,
                background: new THREE.Color(0x001c38),
                lookAt: [0, 50, 0],
                cameraPos: [0, 100, 180],
                grids: true,
                globe: {
                    radius: 100,
                    materialProps: {
                        map
                        // emissive: new THREE.Color(0xff0000),
                        // emissiveIntensity: 0.2
                    }
                }
            });
        }
    }
};
</script>
<style lang="scss">
.vr-page {
    #vr-container {
        background-color: #ccc;
        height: 100vh;
    }
}
</style>
