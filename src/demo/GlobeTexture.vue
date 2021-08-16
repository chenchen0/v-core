<template>
    <div class="demo-gt">
        <canvas class="gt-canvas" :width="width" :height="height"></canvas>
    </div>
</template>

<script>
import _ from "lodash";
import $ from "jquery";

export default {
    data() {
        return {
            width: 1024,
            height: 512,

            ctx: null
        };
    },
    mounted() {
        this.ctx = $(".gt-canvas")[0].getContext("2d");
        this.drawPoints();
    },
    methods: {
        drawPoints(rows = 128, cols = 256, width = 1, height = 1) {
            // this.fillRect(0, 0, this.width, this.height, "#29357d");
            this.ctx.fillStyle = "#a5ddff";
            let xStep = this.width / cols;
            let yStep = this.height / rows;
            let ctx = this.ctx;
            let r = this.height / 2;
            _.times(rows / 2 + 1, y => {
                y *= yStep;
                let _y = r - y;
                let _x = Math.sqrt(r * r - _y * _y);
                let wRatio = r / _x;
                _.times(cols / wRatio + 1, x => {
                    x *= xStep * wRatio;
                    this.fillRect(x, y, width * wRatio, height);
                    this.fillRect(x, this.height - y, width * wRatio, height);
                });
            });
        },
        fillRect(x, y, w, h, color) {
            color && (this.ctx.fillStyle = color);
            y = parseInt(y);
            x = parseInt(x);
            this.ctx.fillRect(x, y, w, h);
        }
    }
};
</script>

<style lang="scss">
.demo-gt {
    .gt-canvas {
        background-color: #eee;
        margin: 10px;
    }
}
</style>
