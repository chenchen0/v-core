// exceljs 所需的 polyfills
// require("core-js/modules/es.promise");
// require("core-js/modules/es.string.includes");
// require("core-js/modules/es.object.assign");
// require("core-js/modules/es.object.keys");
// require("core-js/modules/es.symbol");
// require("core-js/modules/es.symbol.async-iterator");
// require("regenerator-runtime/runtime");

// const ExcelJS = require("exceljs/dist/es5");
const ExcelJS = require("exceljs");

import _ from "lodash";

/*
    fileName: 文件名,
    //sheet页选项，
    sheets: [{
        name: string, sheet名称，默认 “SheetN”
        rows: array,  数据行

        //其它 exceljs 的选项，包括：
        //columns, views, pageSetup, properties, headerFooter
    }, ...]

*/
function workbook(sheets) {
    const workbook = new ExcelJS.Workbook();
    sheets.forEach((sheet, i) => {
        let {views = [], pageSetup = {}, properties = {}, headerFooter = {}} = sheet;
        let hasHeader = !!sheet.columns;
        const worksheet = workbook.addWorksheet(sheet.name || `Sheet ${i}`, {
            views: [
                {
                    state: "frozen",
                    xSplit: 0,
                    ySplit: hasHeader ? 1 : 0
                },
                ...views
            ],
            properties: {
                defaultRowHeight: 18,
                defaultColWidth: 15,
                ...properties
            },
            pageSetup: {
                ...pageSetup
            },
            headerFooter: {
                ...headerFooter
            }
        });
        let rowIdx = 1;
        if (hasHeader) {
            worksheet.columns = sheet.columns;
            worksheet.getRow(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {argb: "FFCCCCCC"},
                bgColor: {argb: "FF0000FF"}
            };
            rowIdx++;
        }
        _.forEach(sheet.rows, row => {
            worksheet.getRow(rowIdx++).values = row;
        });
    });
    return workbook;
}

export default workbook;
