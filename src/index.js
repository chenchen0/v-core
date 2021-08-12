import Vue from "vue";
import "normalize.css/normalize.css";
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons/regular/keyboard";
import "vue-awesome/icons/regular/trash-alt";
import "vue-awesome/icons/regular/clone";
import "vue-awesome/icons/regular/dot-circle";
import "vue-awesome/icons/regular/check-square";
import "vue-awesome/icons/bars";
import "vue-awesome/icons/regular/calendar-alt";
import "vue-awesome/icons/regular/clock";
import "vue-awesome/icons/th";
import "vue-awesome/icons/sort-numeric-up";
import "vue-awesome/icons/regular/star";
import "vue-awesome/icons/palette";
import "vue-awesome/icons/regular/caret-square-down";
import "vue-awesome/icons/toggle-off";
import "vue-awesome/icons/sliders-h";
import "vue-awesome/icons/regular/image";
import "vue-awesome/icons/chalkboard";
import "vue-awesome/icons/tasks";
import "vue-awesome/icons/hand-point-up";
import * as filters from "./filters"; // 全局vue filter
import VMakingForm from "./components/form/Container.vue";
import VForm from "./components/form/GenerateForm.vue";
import VFormH5 from "./components/form/h5/GenerateFormH5.vue";
import VTable from "./components/table/VTable";

import VExcel from "./components/excel";
import VR from "./components/vr";

Vue.component("icon", Icon);

/*移动端组件*/
import Vant from "vant";
import "vant/lib/index.css";
Vue.use(Vant);

const components = [VMakingForm, VForm, VFormH5, VTable];

components.forEach(component => {
    component.install = function(Vue) {
        Vue.component(component.name, component);
    };
});

const install = function(Vue, opts = {}) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
    Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key]);
    });
};

if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}

export {install, VMakingForm, VForm, VFormH5, VTable, VExcel};

export default {install, VMakingForm, VForm, VFormH5, VTable, VExcel};
