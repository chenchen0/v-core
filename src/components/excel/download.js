import {saveAs} from "file-saver";

export default function download(workbook, workbookName) {
    return workbook.xlsx.writeBuffer().then(buffer => {
        saveAs(new Blob([buffer]), `${workbookName}.xlsx`);
    });
}
