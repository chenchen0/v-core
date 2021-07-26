<template>
    <div class="v-table">
        <el-table :data="listData" style="width: 100%">
            <el-table-column :fixed="col.fixed" :width="col.width" :label="col.name" v-for="(col, i) in cols" :key="i">
                <template v-slot="scope">
                    <div v-if="col.funcs" class="v-func-ctn">
                        <div v-for="(func, j) in col.funcs" :key="j">
                            <div
                                @click="func.click && func.click(scope.row, j)"
                                class="v-func"
                                :class="`v-func-${func.style || 'primary'}`"
                            >
                                {{ func.name }}
                            </div>
                        </div>
                    </div>
                    <div v-else-if="col.formatter">
                        <div v-html="col.formatter(scope.row, i)"></div>
                    </div>
                    <div v-else>{{ scope.row[col.prop] }}</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="v-table-page-ctn" v-if="hasPager">
            <el-pagination
                layout="prev, pager, next"
                :total="pageInfo.total"
                :page-size="pageInfo.pageSize"
                :current-page.sync="pageInfo.pageNum"
                @current-change="fetchData"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
export default {
    name: "VTable",
    props: {
        // data: Array, //数据
        page: Object, //分页 {total: 100, pageNum: 1, pageSize: 15}
        remoteFunc: Function, //远程数据请求，function(page, callback){}; callback接收data参数
        /*
         cols: [
           {
              name: '', //列名
              prop: '', //字段名
              width: '', //宽度 px
              fixed: false, //固定列
              formatter: function(row, index){},  //优先级高于prop, 支持返回html
              funcs: [{ //功能选项，优先级高于formatter
                name: '详情',   //显示名字
                style: 'primary', //样式，primary/success/info/warning/danger
                show: function(row, index){}, //是否显示, function返回boolean
                click: function(row, index){}  //回调函数
              }],
           }
         ]
         */
        cols: Array
    },
    data() {
        return {
            listData: this.data,
            pageInfo: this.page
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.$emit("update:page", this.pageInfo);
            this.remoteFunc &&
                this.remoteFunc(this.pageInfo, data => {
                    this.listData = data || [];
                });
        },
        reset() {
            this.pageInfo.pageNum = 1;
            this.$emit("update:page", this.pageInfo);
            this.fetchData();
        },
        update() {
            this.fetchData();
        }
    },
    watch: {
        page() {
            this.pageInfo = this.page;
        }
    },
    computed: {
        hasPager() {
            return !_.isEmpty(this.pageInfo);
        }
    }
};
</script>

<style lang="scss">
@import "../../styles/variables.scss";
.v-table {
    .v-table-page-ctn {
        text-align: center;
        margin: 15px;
    }
    .v-func-ctn {
        display: flex;
        flex-wrap: wrap;
        & > :not(:last-child) {
            margin-right: 10px;
        }
    }
    .v-func {
        color: $v-primary;
        cursor: pointer;
        &.v-func-primary {
            color: $v-primary;
        }
        &.v-func-success {
            color: $v-success;
        }
        &.v-func-info {
            color: $v-info;
        }
        &.v-func-warning {
            color: $v-warning;
        }
        &.v-func-danger {
            color: $v-danger;
        }
    }
}
</style>
