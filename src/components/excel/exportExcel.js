import _ from "lodash";
import download from "./download";
import workbook from "./workbook";

function exportExcel(fileName, sheets) {
    const excel = workbook(sheets);
    download(excel, fileName);
}

export default exportExcel;
