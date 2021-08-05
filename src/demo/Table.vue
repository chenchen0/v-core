<template>
    <div class="demo-table">
        <div class="funcs">
            <el-button type="primary" @click="download">下载Excel</el-button>
        </div>
        <v-table class="v-table-ctn" ref="table" :page.sync="tablePage" :cols="tableCols" :remoteFunc="fetchTableData"></v-table>
    </div>
</template>

<script>
import _ from "lodash";
import {VExcel} from "../index";

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

export default {
    data() {
        return {
            tablePage: {total: 100, pageNum: 1, pageSize: 10},
            tableCols: [
                {
                    name: "ID",
                    prop: "id",
                    width: 80,
                    sort: "custom"
                },
                {
                    name: "姓名",
                    prop: "name",
                    sort: true
                },
                {
                    name: "省份",
                    prop: "province"
                },
                {
                    name: "城市",
                    prop: "city",
                    formatter(row) {
                        return `<span style='color: red;'>${row.city}市</span>`;
                    }
                },
                {
                    name: "地址",
                    prop: "address"
                },
                {
                    name: "操作",
                    funcs: [
                        {
                            name: "详情",
                            click: this.showDetail
                        },
                        {
                            name: "修改",
                            style: "warning",
                            click: this.showEdit
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        fetchTableData({pageNum, pageSize, sort}, callback) {
            console.log(pageNum, pageSize, sort);
            let start = (pageNum - 1) * pageSize;
            let data = DATA.slice(start, start + 10);
            callback && callback(data);
        },
        showDetail(row, i) {
            console.log("detail", row, i);
        },
        showEdit(row, i) {
            console.log("edit", row, i);
        },
        download() {
            VExcel.exportXlsx("测试", [
                {
                    name: "第一页",
                    columns: [
                        {header: "Id", key: "id", width: 10},
                        {header: "Name", key: "name", width: 20},
                        {header: "D.O.B.", key: "DOB", width: 10}
                    ],
                    rows: _.times(20, i => {
                        i += 1;
                        return {
                            id: i,
                            name: "名称 " + i,
                            DOB: "BOD" + i
                        };
                    })
                }
            ]);
        }
    }
};
</script>

<style lang="scss">
.demo-table {
    .funcs {
        padding: 20px;
    }
}
</style>
