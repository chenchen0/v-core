import Vue from "vue";
import Router from "vue-router";

import Home from "../demo/Home.vue";
import Table from "../demo/Table.vue";
import Test from "../Test.vue";
import H5 from "../test/h5.vue";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/table",
            component: Table
        },
        {
            path: "/3d",
            component: () => import("../demo/3DStore")
        },
        {
            path: "/vr",
            component: () => import("../demo/VR")
        },
        {
            path: "/test",
            name: "test",
            component: Test
        },
        {
            path: "/h5",
            name: "h5",
            component: H5
        }
    ]
});
