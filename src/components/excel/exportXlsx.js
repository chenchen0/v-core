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
import download from "./download";

/*
    fileName: 文件名,
    //sheet页选项，
    sheets: [{
        name: string, sheet名称，默认 “SheetN”

        //其它 exceljs 的选项，可以覆盖组件默认配置
        rows: array,  数据行



        
    }, ...]

*/
function exportXlsx(fileName, sheets) {
    const workbook = new ExcelJS.Workbook();
    sheets.forEach((sheet, i) => {
        let hasHeader = !!sheet.columns;
        const worksheet = workbook.addWorksheet(sheet.name || `Sheet ${i}`, {
            views: [
                // {
                //     showGridLines: false
                // },
                {
                    state: "frozen",
                    xSplit: 0,
                    ySplit: hasHeader ? 1 : 0
                }
            ],
            properties: {tabColor: {argb: "FF00FF00"}}
        });
        let rowIdx = 1;
        if (sheet.columns) {
            worksheet.columns = sheet.columns;
            worksheet.getRow(1).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {argb: "FFCCCCCC"},
                bgColor: {argb: "FF0000FF"}
            };
            rowIdx++;
        }
        if (sheet.views) {
            worksheet.views = sheet.views;
        }
        _.forEach(sheet.rows, row => {
            worksheet.getRow(rowIdx++).values = row;
        });
    });
    download(workbook, fileName);
}

export default exportXlsx;
