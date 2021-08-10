<template>
    <div class="store-page">
        <div id="store-container">3d store</div>
    </div>
</template>

<script>
import {Store, Box, Shelf} from "../v3DStore";
import * as THREE from "three";

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
                showCoords: process.env.NODE_ENV == "development"
            });
            this.store.add(new Box().getObject3d());
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
