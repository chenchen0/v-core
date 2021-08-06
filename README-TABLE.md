# Table

封装了 `element-ui` 的 `el-table`，简化表格使用，方便项目统一样式。

## Install

安装见 `v-core` 文档

## Props

| Prop name  | Description      | Type     | Default value |
| ---------- | ---------------- | -------- | ------------- |
| page       | 分页信息         | Object   | null          |
| remoteFunc | 远程数据请求函数 | Function | null          |
| cols       | 数据列配置       | Array    | null          |

#### page props

分页信息，`json` 格式，支持 `.sync` 修饰符，需包含以下字段:

```javascript
{
    total: 100,     //总记录数
    pageNum: 1,     //当前页码
    pageSize: 15    //每页行数
}
```

> 当分页信息为空时，将不渲染分页组件

#### remoteFunc props

远程数据函数，用于获取数据。

**触发时机**：表格初始化、页码变化、排序变化、主动重置（reset 方法被调用）等，所有需要改变表格数据的时机，均会调用该方法获取数据。

**方法参数**：

| Param Index | Description    | Detail                    |
| ----------- | -------------- | ------------------------- |
| pageInfo    | 页码、排序参数 | {pageNum, pageSize, sort} |
| callback    | 回调函数       | function (data) { ... }   |

> 使用方法如下：

```javascript
/*
sort: {
    prop: "id", //col 的 prop 属性值
    order: "descending" //排序方式，descending：倒序，ascending：正序
}
*/
function remoteFunc({pageNum, pageSize, sort}, callback) {
    //... to do something, get table data

    //调用callback方法将数据传递给表格
    callback(data);
}
```

#### cols props

数据列选项配置。

```javascript
[
   {
      name: '', //列名
      prop: '', //字段名
      width: '', //宽度 px
      fixed: false, //固定列
      sort: false,  //列排序，可选：false/true/'custom'，详见el-table文档。为'custom'时会将页码重置，并触发 remoteFunc 方法刷新数据
      formatter: function(row, index){},  //优先级高于prop, 支持返回html
      funcs: [{ //功能选项，优先级高于formatter
        name: '详情',   //显示名字
        style: 'primary', //样式，primary/success/info/warning/danger
        click: function(row, index){}  //点击回调函数, 参数为当前行数据和索引
      }],
   },
   ...
 ]

```

## Methods

> 此处仅列出必要的对外方法，并非组件所有方法，有兴趣的同学可以阅读组件源码学习了解！

| Method | Description                              | Params |
| ------ | ---------------------------------------- | ------ |
| reset  | 重置页码，并触发 remoteFunc 方法获取数据 | none   |

## Useage

```html
<!-- template -->
<v-table ref="table" :page.sync="tablePage" :cols="tableCols" :remoteFunc="fetchTableData"> </v-table>
```

```javascript
//script
export default {
    data() {
        return {
            tablePage: {total: 100, pageNum: 1, pageSize: 10},
            tableCols: [
                {name: "ID", prop: "id", width: 80, sort: "custom"},
                {name: "姓名", prop: "name", sort: true},
                {name: "省份", prop: "province"},
                {
                    name: "城市",
                    prop: "city",
                    formatter(row) {
                        return `<span style='color: red;'>${row.city}市</span>`;
                    }
                },
                {name: "地址", prop: "address"},
                {
                    name: "操作",
                    funcs: [
                        {name: "详情", click: this.showDetail},
                        {name: "修改", style: "warning", click: this.showEdit}
                    ]
                }
            ]
        };
    },
    methods: {
        fetchTableData({pageNum, pageSize}, callback) {
            let data = _.times(100, i => {
                return {
                    id: i + 1,
                    name: "王小虎",
                    province: "上海",
                    city: "普陀区",
                    address: "上海市普陀区金沙江路 1518 弄",
                    zip: "200333"
                };
            });
            callback && callback(data);
        },
        showDetail() {},
        showEdit() {}
    }
};
```
