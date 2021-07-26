# Table

封装了 `element-ui` 的 `el-table`，简化表格使用，方便项目统一样式。

## Install

安装见 `v-core` 文档

## Props

| Prop name  | Description      | Type     | Default value |
| ---------- | ---------------- | -------- | ------------- |
| page       | 分页信息         | Object   | null          |
| remoteFunc | 远程数据请求函数 | Function | null          |
| cols       | 数据列           | Array    | null          |

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

远程数据调用函数，用于获取数据。

remoteFunc 传入 2 个参数：

> 1. page: props.page, 组件接收的的 page 对象。

> 2. callback: Function，回调函数，改函数接收 `data` 参数，`data` 为数据数组。

```javascript
function remoteFunc(page, callback) {
    //... to do something
}

function callback(data) {
    //... to do something
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

## Useage

```html
//template <v-table ref="table" :page.sync="tablePage" :cols="tableCols" :remoteFunc="fetchTableData"> </v-table>
```

```javascript
//secript
export default {
    data() {
        return {
            tablePage: {total: 100, pageNum: 1, pageSize: 10},
            tableCols: [
                {name: "ID", prop: "id", width: 80},
                {name: "姓名", prop: "name"},
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
