# form-making

基于 Vue,ElementUI 开发的一款表单设计器，提高表单开发效率的利器，让开发者从枯燥的表单代码编写中解放出来，同步兼容 pc 和 H5 端

工具地址：（待发布）
H5 演示地址： （待发布）

![](https://user-gold-cdn.xitu.io/2018/9/27/1661a6cd60454273)

## 特性

-   可视化配置页面
-   提供栅格布局，并采用 flex 实现对齐
-   一键预览配置的效果
-   一键生成配置 json 数据
-   一键生成代码，立即可运行
-   提供自定义组件满足用户自定义需求
-   提供远端数据接口，方便用户需要异步获取数据加载
-   提供功能强大的高级组件
-   支持表单验证
-   快速获取表单数据

## Install

见 `v-core` 安装文档

## 设计器引用

```javascript
import {VMakingForm} from "v-core";
Vue.component(VMakingForm.name, VMakingForm);
```

```html
<v-form preview generate-code generate-json>
    <template slot="action"> </template>
</v-form>
```

##### props

| Prop name     | Description        | Type    | Default value |
| ------------- | ------------------ | ------- | ------------- |
| preview       | 预览，头部操作按钮 | Boolean | false         |
| generate-json | 生成 JSON          | Boolean | false         |
| generate-code | 生成代码           | Boolean | false         |

##### methods

| Function name    | Description                 |
| ---------------- | --------------------------- |
| `getJSON`        | 获取设计器生成的 JSON 数据  |
| `getHtml`        | 获取生成可使用的 html 代码  |
| `setJSON(value)` | 根据 value 值设置表单设计器 |

##### slots

| Slot name | Description                              |
| --------- | ---------------------------------------- |
| action    | 自定义设计器操作按钮，展示在设计头部区域 |

## 表单渲染

通过设计器生成的 JSON，用于表单渲染
![](https://user-gold-cdn.xitu.io/2018/9/27/1661a50b64f77e5f?w=1580&h=1080&f=png&s=162948)

下面就是加载对应的数据用于展示，假设你已经正确加载组件

```html
<v-form :data="jsonData" :remote="remoteFuncs" :value="values" ref="generateForm"> </v-form>
```

```javascript
new Vue({
    ...
    data () {
        return {
            jsonData: {}, // 表单配置中生成的json数据
            values: {}, // 表单需要显示的表单数据
            remoteFuncs: {
                // 组件配置时配置的远端方法,保持和配置时输入的名称一致
                func_test (resolve) {
                  // 模拟接口请求
                  setTimeout(() => {
                    const options = [
                      {id: '1', name: '1111'},
                      {id: '2', name: '2222'},
                      {id: '3', name: '3333'}
                    ]

                    // 获取到的值和标签可以通过配置页远端配置
                    // 值:id  标签：name

                    resolve(options) // 将后端获取的数据放入回调函数中
                  }, 2000)
                },
                func_test2....
            }
        }
    },
    methods: {
        ...{
            // 调用此方法验证表单数据和获取表单数据
            this.$refs.generateForm.getData().then(data => {
                // 数据校验成功
                // data 为获取的表单数据
            }).catch(e => {
                // 数据校验失败
            })
        }
    }
})
```

## 高级字段使用

-   [自定义扩展](https://github.com/GavinZhuLei/vue-form-making/blob/master/doc/blank.md "自定义扩展")
-   [图片上传](https://github.com/GavinZhuLei/vue-form-making/blob/master/doc/imgupload.md "图片上传")

## 社区资料笔记

-   [Vue.Draggable](https://note.youdao.com/share/?id=f525c8897d9d7f6648bc28d59f5d03f4&type=note#/) （by @[jianhunxia](https://github.com/jianhunxia) 提供)

-   [jsonEditor、ace 和 clipboard](https://note.youdao.com/share/?id=4cb3b53c76cb9f5f733f171529f71501&type=note#/) （by @[jianhunxia](https://github.com/jianhunxia) 提供)

## 支持

-   如果你发现了新的 bug，或者有新的 feature request，请新建一个 issue
