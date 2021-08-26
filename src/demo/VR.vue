<template>
    <div class="vr-page">
        <div id="vr-container">VR</div>
    </div>
</template>

<script>
import {Panorama} from "../VR";
// import {Panorama} from "@aaa/VR";

import * as THREE from "three";

const latlngTo3d = function(lng, lat, radius = 1) {
    let phi = ((90 - lat) * Math.PI) / 180;
    let theta = ((180 - lng) * Math.PI) / 180;

    let x = radius * Math.sin(phi) * Math.cos(theta),
        y = radius * Math.cos(phi),
        z = radius * Math.sin(phi) * Math.sin(theta);
    return {x, y, z};
};

const vec3 = function({x, y, z}) {
    return new THREE.Vector3(x, y, z);
};

const curvePoints = function(lng1, lat1, lng2, lat2, radius, points = 10) {
    let lng3 = (lng1 + lng2) / 2;
    let lat3 = (lat1 + lat2) / 2;
    let from = latlngTo3d(lng1, lat1, radius);
    let to = latlngTo3d(lng2, lat2, radius);
    let length = new THREE.LineCurve3(vec3(from), vec3(to)).getLength();
    let center = latlngTo3d(lng3, lat3, radius * (length / radius / 2 + 1));
    let curve = new THREE.QuadraticBezierCurve3(vec3(from), vec3(center), vec3(to));
    let res = curve.getPoints(points);
    return res;
};

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
            const background = textureLoader.load(require("../assets/textures/earth2.jpg"));
            background.mapping = THREE.EquirectangularReflectionMapping;
            background.encoding = THREE.sRGBEncoding;

            //球体贴图
            const map = textureLoader.load(require("../assets/textures/earth3.jpg"));
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
                autoRotateSpeed: 0,
                globe: {
                    radius: 100,
                    materialProps: {
                        color: new THREE.Color(0x54a8ec),
                        // envMap: background,
                        map
                        // alphaMap: map,
                        // alphaTest: 0.9
                        // emissive: new THREE.Color(pointColor)
                        // emissiveIntensity: 0.2
                    },
                    outGlow: true,
                    shaderParams: {
                        uniforms: {c: {type: "f", value: 1.1}, p: {type: "f", value: 12}},
                        fragmentShader: `
                            uniform float c;
                            uniform float p;
                            varying vec3 vNormal;
                            void main()
                            {
                                float intensity = pow( c - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), p );
                                gl_FragColor = vec4( 0.2, 0.6, 1.0, 1.0 ) * intensity;
                            }
                        `
                    }
                    // mesh: points
                }
            });
            // this.vr.add(points);
            // this.addLines();
            this.addCurves();
        },
        addCurves() {
            let cites = {
                鄂尔多斯: [109.781327, 39.608266],
                齐齐哈尔: [123.97, 47.33],
                青岛: [120.33, 36.07],
                日照: [119.46, 35.42],
                拉萨: [91.11, 29.97],
                上海: [121.48, 31.22],
                攀枝花: [101.718637, 26.582347],
                厦门: [118.1, 24.46],
                烟台: [121.39, 37.52],
                福州: [119.3, 26.08],
                宁波: [121.56, 29.86],
                广州: [113.23, 23.16],
                昆明: [102.73, 25.04],
                深圳: [114.07, 22.62],
                海口: [110.35, 20.02],
                大连: [121.62, 38.92],
                苏州: [120.62, 31.32],
                三亚: [109.511909, 18.252847],
                呼和浩特: [111.65, 40.82],
                成都: [104.06, 30.67],
                西安: [108.95, 34.27],
                台州: [121.420757, 28.656386],
                克拉玛依: [84.77, 45.59],
                北京: [116.46, 39.92],
                包头: [110, 40.58],
                乌鲁木齐: [87.68, 43.77],
                杭州: [120.19, 30.26],
                兰州: [103.73, 36.03],
                沧州: [116.83, 38.33],
                天津: [117.2, 39.13],
                郑州: [113.65, 34.76],
                哈尔滨: [126.63, 45.75],
                石家庄: [114.48, 38.03],
                长沙: [113, 28.21],
                廊坊: [116.7, 39.53],
                合肥: [117.27, 31.86]
            };
            let color = 0xb85dad;
            // 武汉: [114.31, 30.52],
            let wuhan = [114.31, 30.52];
            // lines
            let lines = _.map(cites, latlng => {
                let points = curvePoints(...wuhan, ...latlng, 100, 50);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({color});
                const line = new THREE.Line(geometry, material);
                return line;
            });
            this.vr.add(lines);
            // points
            // const geometry = new THREE.BufferGeometry().setFromPoints(_.map(cites, latlng => vec3(latlngTo3d(...latlng, 100))));
            // const material = new THREE.PointsMaterial({
            //     size: 2,
            //     color
            // });
            // const points = new THREE.Points(geometry, material);
            // points.lookAt(0, 0, 0);

            let points = _.map(_.values(cites), (latlng, i) => {
                let {x, y, z} = latlngTo3d(...latlng, 100);
                let geometry = new THREE.CircleGeometry(0.5);
                let material = new THREE.MeshBasicMaterial({
                    color,
                    side: THREE.BackSide
                });
                let mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, y, z);
                mesh.lookAt(0, 0, 0);
                lines[i].add(mesh);

                let ringGeometry = new THREE.RingGeometry(0.4, 0.5, 16);
                let ringMaterial = new THREE.MeshBasicMaterial({
                    color,
                    side: THREE.BackSide,
                    transparent: true
                });
                let ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.set(x, y, z);
                ring.lookAt(0, 0, 0);
                ring.name = "ring-" + i;
                lines[i].add(ring);
                return mesh;
            });
            // this.vr.add(points);
            // animate
            this.vr.addAnimate("lines", time => {
                let duration = 10000; //动画时长，ms
                let ringDura = 0.1; // ring 动画时长占比
                let _rate = (time % duration) / duration;
                _.forEach(lines, (line, i) => {
                    let ring = line.getObjectByName("ring-" + i);
                    let rate = _rate + i / lines.length;
                    if (rate > 1) {
                        rate -= 1;
                    }
                    // line.material.color.setHSL(rate, 1, 0.5);
                    let geo = line.geometry;
                    let count = geo.getAttribute("position").count;
                    let start = 0,
                        _count = count;
                    let ringRate = 1;
                    if (rate < 0.3) {
                        _count = parseInt((count / 0.3) * rate);
                    } else if (rate < 0.7) {
                        if (rate < 0.3 + ringDura) {
                            ringRate = (rate - 0.3) / ringDura;
                        }
                    } else {
                        start = parseInt((count / 0.3) * (rate - 0.7));
                        ring.material.opacity = 0;
                    }
                    line.geometry.setDrawRange(start, _count);
                    ring.material.opacity = 1 - ringRate;
                    ring.scale.setScalar(1 + ringRate * 3);
                });
            });
        },
        addLines() {
            let pos = {
                鄂尔多斯: [109.781327, 39.608266],
                齐齐哈尔: [123.97, 47.33],
                青岛: [120.33, 36.07],
                日照: [119.46, 35.42],
                拉萨: [91.11, 29.97],
                上海: [121.48, 31.22],
                攀枝花: [101.718637, 26.582347],
                厦门: [118.1, 24.46],
                烟台: [121.39, 37.52],
                福州: [119.3, 26.08],
                宁波: [121.56, 29.86],
                广州: [113.23, 23.16],
                昆明: [102.73, 25.04],
                深圳: [114.07, 22.62],
                海口: [110.35, 20.02],
                大连: [121.62, 38.92],
                苏州: [120.62, 31.32],
                三亚: [109.511909, 18.252847],
                呼和浩特: [111.65, 40.82],
                成都: [104.06, 30.67],
                西安: [108.95, 34.27],
                台州: [121.420757, 28.656386],
                克拉玛依: [84.77, 45.59],
                北京: [116.46, 39.92],
                包头: [110, 40.58],
                乌鲁木齐: [87.68, 43.77],
                杭州: [120.19, 30.26],
                兰州: [103.73, 36.03],
                沧州: [116.83, 38.33],
                天津: [117.2, 39.13],
                郑州: [113.65, 34.76],
                哈尔滨: [126.63, 45.75],
                石家庄: [114.48, 38.03],
                长沙: [113, 28.21],
                廊坊: [116.7, 39.53],
                合肥: [117.27, 31.86],
                武汉: [114.31, 30.52],

                帕劳_科罗尔: [134.29, 7.2],
                格陵兰_戈特霍布: [-51.43, 64.11],
                加拿大_渥太华: [-75.41, 45.24],
                圣皮埃尔_圣皮埃尔市: [-56.1, 46.46],
                美国_华盛顿: [-77.0, 38.53],
                墨西哥_墨西哥城: [-99.07, 19.24],
                危地马拉_危地马拉城: [-90.32, 14.37],
                伯利兹_贝尔莫潘: [-88.46, 17.14],
                萨尔瓦多_圣萨尔瓦多: [-89.12, 13.42],
                尼加拉瓜_马那瓜: [-86.16, 12.08],
                哥斯达黎加_圣何塞: [-84.04, 9.55],
                巴拿马_巴拿马城: [-79.31, 8.59],
                巴哈马_拿骚: [-77.2, 25.03],
                特克斯_科伯恩城: [-71.08, 21.27],
                古巴_哈瓦那: [-82.23, 23.07],
                牙买加_金斯敦: [-76.47, 17.59],
                海地_太子港: [-72.2, 18.32],
                多米尼加_圣多明各: [-69.53, 18.28],
                波多黎各_圣胡安: [-66.03, 18.26],
                美属维尔京_阿马里: [-64.55, 18.2],
                英属维尔京_罗德城: [-64.37, 18.25],
                圣基茨_巴斯特尔: [-62.43, 17.18],
                安圭拉_英_瓦利: [-63.03, 18.13],
                安提瓜_圣约翰: [-61.5, 17.06],
                蒙特塞拉特_普利茅斯: [-62.11, 16.4],
                瓜德罗普_巴斯特尔: [-61.43, 15.59],
                多米尼克_罗索: [-61.23, 15.17],
                马提尼克_法兰西堡: [-61.03, 14.36],
                圣卢西亚_卡斯特里: [-60.59, 14.0],
                圣文森特_金斯敦: [-61.16, 13.12],
                巴巴多斯_布里奇顿: [-59.36, 13.05],
                格林纳达_圣乔治: [-61.44, 12.03],
                特立尼达_西班牙港: [-61.28, 10.39],
                安的列所_威廉斯塔德: [-68.56, 12.06],
                哥伦比亚_波哥大: [-74.04, 4.36],
                委内瑞拉_加拉加斯: [-66.54, 10.29],
                圭亚那_乔治敦: [-58.09, 6.48],
                苏里南_帕拉马里博: [-55.1, 5.49],
                法属圭亚那_卡宴: [-52.19, 4.56],
                厄瓜多尔_基多: [-78.3, -0.13],
                秘鲁_利马: [-77.02, -12.05],
                巴西_巴西利亚: [-47.53, -15.47],
                玻利维亚_苏克雷: [-68.08, -16.3],
                智利_圣地亚哥: [-70.38, -33.28],
                阿根廷_布宜诺斯: [-58.25, -34.36],
                巴拉圭_亚松森: [-57.38, -25.18],
                乌拉圭_蒙得维的亚: [-56.09, -34.53],
                中国_北京: [116.23, 39.54],
                蒙古_乌兰巴托: [16.54, 47.55],
                朝鲜_平壤: [125.45, 39.01],
                韩国_汉城: [126.57, 37.31],
                日本_东京: [139.49, 35.4],
                老挝_万象: [12.36, 17.57],
                越南_河内: [15.51, 21.01],
                柬埔寨_金边: [14.54, 11.33],
                缅甸_仰光: [96.09, 16.47],
                泰王国_曼谷: [10.31, 13.43],
                马来西亚_吉隆坡: [11.42, 3.09],
                新加坡_新加坡: [13.49, 1.17],
                文莱_斯里巴加湾: [114.56, 4.56],
                菲律宾_马尼拉: [120.58, 14.36],
                印尼_雅加达: [16.5, 6.12],
                东帝汶_帝力: [125.34, 8.33],
                尼泊尔_加德满都: [85.19, 27.42],
                锡金_甘托克: [88.36, 27.19],
                不丹_廷布: [89.38, 27.28],
                孟加拉国_达卡: [90.24, 23.42],
                印度_新德里: [77.13, 28.37],
                斯里兰卡_科伦坡: [79.5, 6.55],
                马尔代夫_马累: [73.3, 4.1],
                巴基斯坦_伊斯兰堡: [73.03, 33.43],
                阿富汗_喀布尔: [69.1, 34.31],
                伊朗_德黑兰: [51.25, 35.41],
                科威特_科威特城: [48.0, 29.19],
                沙特_利雅得: [46.43, 24.38],
                巴林_麦纳麦: [50.35, 26.12],
                卡塔尔_多哈: [51.31, 25.16],
                阿联酋_阿布扎比: [55.25, 24.28],
                阿曼_马斯喀特: [58.35, 23.36],
                也门_萨那: [44.12, 15.21],
                伊拉克_巴格达: [44.25, 33.19],
                叙利亚_大马士革: [36.18, 33.31],
                黎巴嫩_贝鲁特: [35.3, 33.53],
                约旦_安曼: [35.55, 31.56],
                巴勒斯坦_耶路撒冷: [35.13, 31.46],
                以色列_特拉维: [34.46, 32.02],
                塞浦路斯_尼科西亚: [33.22, 35.1],
                土耳其_安卡拉: [32.51, 39.55],
                乌兹别克_塔什干: [69.16, 41.18],
                哈萨克_阿斯塔纳: [71.26, 51.1],
                吉尔吉斯_比什凯克: [74.35, 42.52],
                塔吉克_杜尚别: [68.46, 38.33],
                亚美尼亚_埃里温: [44.3, 40.09],
                土库曼_阿什哈巴德: [58.22, 37.57],
                阿塞拜疆_巴库: [49.53, 40.23],
                格鲁吉亚_第比利斯: [44.47, 41.42]
            };
            let maxSize = 25;
            _.forEach(pos, ([lng, lat]) => {
                const color = new THREE.Color(`hsl(${Math.random() * 360}, 80%, 50%)`);

                let size = Math.random() * maxSize;

                // let lat = (Math.random() - 0.5) * 180,
                //     lng = (Math.random() - 0.5) * 360;

                let {x, y, z} = latlngTo3d(lng, lat, 100);

                let radius = (size / maxSize) * 0.5 + 0.2;
                // const geometry = new THREE.CylinderGeometry(radius, radius, 20);
                const geometry = new THREE.BoxGeometry(radius, radius, size);
                const material = new THREE.MeshBasicMaterial({color});
                const line = new THREE.Mesh(geometry, material);
                line.position.set(x, y, z);
                line.lookAt(0, 0, 0);

                this.vr.add(line);
                return line;
            });
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
