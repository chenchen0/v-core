# v-core

基于 Vue,ElementUI 开发的一组页面组件包，目前包含以下组件：

| 组件  | 说明                                               |
| ----- | -------------------------------------------------- |
| Table | 表格组件                                           |
| Form  | 表单组件（在 vue-form-making-h5 的基础上修改而来） |
| Excel | 导出 excel 工具                                    |

## Install

```shell
npm install v-core -S
```

# Useage

> import to vue

```javascript
//全部安装
import VCore from "v-core";
Vue.use(VCore);

// or 按需安装
import {VMakingForm, VForm, VFormH5, VTable} from "form-making";
Vue.component(VMakingForm.name, VMakingForm);
Vue.component(VForm.name, VForm);
Vue.component(VFormH5.name, VFormH5);
Vue.component(VTable.name, VTable);
```

> Template

```html
<v-making-form></v-making-form>
<v-form></v-form>
<v-table></v-table>
```

## Form

请查看 `README-FORM.md` 文档

![](https://user-gold-cdn.xitu.io/2018/9/27/1661a6cd60454273)

## Table

请查看 `README-TABLE.md` 文档

## Excel

请查看 `README-EXCEL.md` 文档

## Version logs

| Version | Upate Date | Descript         |
| ------- | ---------- | ---------------- |
| 1.0.5   | 2021-08-06 | add excel module |
| lower   | -          | no record        |
