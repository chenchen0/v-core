# Excel

用于浏览器端生成和下载 `Excel` 表格的工具，基于 `exceljs` 实现。

## Install

安装见 `v-core` 文档

## Import and API

```javascript
import {VExcel} from "v-core";
//创建并下载 excel
VExcel.exportExcel(fileName, sheets);

// or

//先创建workbook
let workbook = VExcel.workbook(sheets);
//再下载excel
VExcel.download(workbook, fileName);
```

如果需要额外修改表格样式，可使用上述第二种方式。

其中`workbook`对象为`exceljs`创建的原始对象，同学们可以在此基础上进行修改表格样式等操作。

## Props

| Prop name | Descript     | Type   | Default value |
| --------- | ------------ | ------ | ------------- |
| fileName  | 导出文件名   | string | none          |
| sheets    | Sheet 页选项 | array  | none          |

#### Prop sheets

Sheet 页选项

> 除 `name`、`rows` 外，其它属性均与 `exceljs` 原始属性完全兼容。

| Prop name    | Descript           | Type   | Default value                               |
| ------------ | ------------------ | ------ | ------------------------------------------- |
| name         | sheet 页名称       | string | 'SheetN'                                    |
| rows         | 数据行             | array  | none                                        |
| columns      | 列标题、键、宽度等 | array  | none                                        |
| views        | 工作簿视图         | array  | none                                        |
| pageSetup    | 页面设置           | object | none                                        |
| properties   | 工作表属性         | object | {defaultRowHeight: 18, defaultColWidth: 15} |
| headerFooter | 页眉和页脚         | object | none                                        |

## Useage

```javascript
const DATA = _.times(100, i => {
    return {
        id: i + 1,
        name: "王小虎",
        province: "上海",
        city: "普陀区",
        address: "上海市普陀区金沙江路 1518 弄",
        zip: "200333"
    };
});

VExcel.exportExcel("测试", [
    {
        name: "第一页",
        columns: [
            {header: "Id", key: "id", width: 10},
            {header: "姓名", key: "name"},
            {header: "省份", key: "province"},
            {header: "城市", key: "city"},
            {header: "地址", key: "address", width: 50}
        ],
        rows: DATA
    }
]);
```

## Other

由于 Excel 本身比较复杂，本组件的初衷是方便浏览器端的 Excel 生成和下载、提供基础的样式，因此并不能完全的满足所有的样式渲染需求。

但是 `exceljs` 提供了相对完善的 API 和大量的配置项，对于样式和操作有较高需求的同学，可以查阅 `exceljs` 官方文档。

**友情链接**： [exceljs 官方](https://github.com/exceljs/exceljs) [中文文档](https://github.com/exceljs/exceljs/blob/master/README_zh.md)
