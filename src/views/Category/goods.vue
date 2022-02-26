<template>
  <div>
    <div id="top" style="margin:10px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">参数列表</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin:20px">
      <el-card>
        <div style="margin-top: 20px;margin-bottom: 20px">
          <el-input style="width: 400px" placeholder="请输入搜索内容" class="input-with-select" clearable @clear="getCategories">
            <el-button slot="append" icon="el-icon-search" @click="addCategories"></el-button>
          </el-input>
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </div>
<!--        表格开始-->
        <template>
          <el-table
            :data="categorylist"
            style="width: 1400px">
            <el-table-column
              prop="goods_name"
              label="商品名称"
              width="480">
            </el-table-column>
            <el-table-column
              prop="goods_price"
              label="商品价格"
              width="180">
            </el-table-column>
            <el-table-column
              prop="goods_weight"
              label="商品重量"
              width="180">
            </el-table-column>
            <el-table-column
              prop="add_time"
              label="创建时间"
              width="280">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row.goods_id)">修改</el-button>
<!--                修改弹窗开始-->
<!--                <el-dialog-->
<!--                  title="修改商品信息"-->
<!--                  :visible.sync="adddialogVisible"-->
<!--                  width="30%">-->
<!--                  <span>-->
<!--                    <el-form ref="addformref" :model="alterForm" label-width="80px">-->
<!--                      <el-form-item label="商品名称" prop="goods_name">-->
<!--                        <el-input v-model="alterForm.goods_name"></el-input>-->
<!--                      </el-form-item>-->
<!--                      <el-form-item label="商品价格" prop="goods_price">-->
<!--                        <el-input v-model="alterForm.goods_price"></el-input>-->
<!--                      </el-form-item>-->
<!--                      <el-form-item label="商品数量" prop="goods_number">-->
<!--                        <el-input v-model="alterForm.goods_number"></el-input>-->
<!--                      </el-form-item>-->
<!--                      <el-form-item label="商品重量" prop="goods_weight">-->
<!--                        <el-input v-model="alterForm.goods_weight"></el-input>-->
<!--                      </el-form-item>-->
<!--                    </el-form>-->
<!--                  </span>-->
<!--                  <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="adddialogVisible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="alterCategory">确 定</el-button>-->
<!--  </span>-->
<!--                </el-dialog>-->
<!--                修改弹窗结束-->
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.goods_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
<!--        表格结束-->
<!--        分页开始-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
<!--        分页结束-->
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'goods',
  data () {
    return {
      adddialogVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      categorylist: [],
      total: 0,
      alterForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: ''
      }
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getCategories()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getCategories()
    },
    async getCategories () {
      const {data: res} = await this.$http.get('goods', {params: this.queryInfo})
      console.log(res.data)
      if (res.meta.status !== 200) {
        this.$message.error('获取列表失败！')
      } else {
        this.categorylist = res.data.goods
        this.total = res.data.total
      }
    },
    addCategories () {

    },
    async handleDelete (id) {
      const {data: res} = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败！')
      } else {
        this.getCategories()
        this.$message.success('删除成功！')
      }
    },
    goAddPage () {
      this.$router.push('/add')
    }
    // async handleEdit (id) {
    //   this.adddialogVisible = true
    //   console.log(id)
    //   const {data: res} = await this.$http.get('goods/' + id)
    //   console.log(res)
    //   if (res.meta.status !== 200) {
    //     this.$message.error('获取商品列表失败！')
    //   } else {
    //     this.alterForm = res.data
    //   }
    // },
    // alterCategory () {
    //   this.$refs.addformref.validate(async valid => {
    //     if (!valid) return
    //     const {data: res} = await this.$http.put('goods/' + this.alterForm.goods_id,
    //       {goods_name: this.alterForm.goods_name,
    //         goods_price: this.alterForm.goods_price,
    //         goods_number: this.alterForm.goods_number,
    //         goods_weight: this.alterForm.goods_weight})
    //     console.log(res)
    //   })
    // }
  }
}
</script>

<style scoped>

</style>
