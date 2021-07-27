<template>
    <v-table class="v-table-ctn" ref="table" :page.sync="tablePage" :cols="tableCols" :remoteFunc="fetchTableData"></v-table>
</template>

<script>
import _ from "lodash";

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
        }
    }
};
</script>
