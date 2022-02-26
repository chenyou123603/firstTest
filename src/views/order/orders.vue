<template>
  <div>
    <div style="margin: 20px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-card style="padding:20px;width:1400px">
<!--        <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" style="width:400px"  clearable @clear="queryOrderlist">-->
<!--          <el-button slot="append" icon="el-icon-search" @click="queryOrderlist"></el-button>-->
<!--        </el-input>-->
        <el-input style="width: 400px" placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="queryOrderlist">

          <el-button slot="append" icon="el-icon-search" @click="queryOrderlist"></el-button>
        </el-input>

          <el-table
            :data="orderlist.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
            style="width: 100%;margin-top: 10px">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="order_number"
              label="订单编号"
              width="280">
            </el-table-column>
            <el-table-column
              prop="order_price"
              label="订单价格"
              width="180">
            </el-table-column>
            <el-table-column
              prop="pay_status"
              label="是否付款"
              width="180">
              <template slot-scope="scope">
                <el-tag size="medium" v-if="scope.row.pay_status ==0 ">未付款</el-tag>
                <el-tag size="medium" v-if="scope.row.pay_status ==1 ">已付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="is_send"
              label="是否发货"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="create_time"
              label="下单时间"
              width="280">
            </el-table-column>
            <el-table-column label="操作" style="width:300px">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle></el-button>
                <el-button type="success" icon="el-icon-location" circle></el-button>
              </template>
            </el-table-column>
          </el-table>

        <div style="margin-top:10px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orders',
  data () {
    return {
      tableData: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      orderlist: [],
      total: 0,
      search: ''
    }
  },
  created () {
    this.queryOrderlist()
  },
  methods: {
    async queryOrderlist () {
      const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
      if (res.meta.status !== 200) {

      } else {
        this.orderlist = res.data.goods
        this.total = res.data.total
      }
    },
    handleEdit () {

    },
    handleDelete () {

    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.queryOrderlist()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.queryOrderlist()
    }
  }
}
</script>

<style scoped>

</style>
