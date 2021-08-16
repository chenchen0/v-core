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
            // const pointColor = 0x012f59;
            const pointColor = 0x0a2240;

            const textureLoader = new THREE.TextureLoader();

            //场景贴图
            const background = textureLoader.load(require("../assets/textures/house.jpg"));
            background.mapping = THREE.EquirectangularReflectionMapping;
            background.encoding = THREE.sRGBEncoding;

            //球体贴图
            const map = textureLoader.load(require("../assets/textures/points.png"));
            map.mapping = THREE.EquirectangularReflectionMapping;
            map.encoding = THREE.sRGBEncoding;

            //球面点
            const globe = new THREE.IcosahedronGeometry(100, 100);
            const positions = globe.getAttribute("position");
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", positions);
            // geometry.setAttribute("color", positions);
            geometry.computeBoundingSphere();
            const material = new THREE.PointsMaterial({
                size: 0.5,
                color: new THREE.Color(pointColor)
            });
            const points = new THREE.Points(geometry, material);

            this.vr = new Panorama({
                domContainer: "#vr-container",
                // background,
                // background: new THREE.Color(0x001c38),
                // lookAt: [0, 50, 0],
                cameraPos: [0, 100, 180],
                // grids: true,
                transparent: true,
                // autoRotateSpeed: 0,
                globe: {
                    radius: 100,
                    materialProps: {
                        // color: new THREE.Color(0x54a8ec),
                        // envMap: map,
                        map
                        // alphaMap: map,
                        // alphaTest: 0.9,
                        // emissive: new THREE.Color(pointColor)
                        // emissiveIntensity: 0.2
                    },
                    outGlow: true
                    // mesh: points
                }
            });
            // this.vr.add(points);
            // this.addLines();
        },
        addLines() {
            const color = "#519be5";
            const vertices = [],
                divisions = 50;
            _.times(divisions, i => {
                const v = (i / divisions) * (Math.PI * 2);
                const x = Math.sin(v);
                const z = Math.cos(v);
                vertices.push(x, 0, z);
            });
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
            const material = new THREE.LineDashedMaterial({
                color,
                linewidth: 10,
                dashSize: 5,
                gapSize: 5
            });
            const line = new THREE.Line(geometry, material);
            line.scale.setScalar(40);
            line.position.set(100, 0, 0);
            this.vr.add(line);
        }
    }
};
</script>
<style lang="scss">
.vr-page {
    background-image: url("../assets/bg.png");
    background-size: 100% 100%;
    #vr-container {
        // background-color: rgb(86, 86, 255);
        height: 100vh;
    }
}
</style>
