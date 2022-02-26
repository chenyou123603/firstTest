<template>
  <div>
    <div id="top" style="margin:10px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品分类</a></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="margin:20px">
      <el-card style="width: 1400px">
        <el-button type="primary" @click="adddialogVisible = true">添加商品</el-button>
<!--        添加商品弹窗开始-->
        <el-dialog
          title="添加商品"
          :visible.sync="adddialogVisible"
          width="30%"
        @close="closeClearForm">
          <span>
            <el-form ref="AddformRef" :model="Addform" label-width="80px">
              <el-form-item label="商品名称">
                <el-input v-model="Addform.cat_name"></el-input>
              </el-form-item>
              <el-form-item label="父层级">
                <el-cascader
                  v-model="selectKeys"
                  :options="parentTwolist"
                  :props="cascaderProps"
                  @change="Changecascader"
                clearable
                change-on-select>
                </el-cascader>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>
<!--        添加商品弹窗结束-->
        <template>
          <el-table
            :data="categorylist"
            style="width: 100%">
            <el-table-column
              type="expand">
              <template  slot-scope="scope">
                <el-table
                  :data="scope.row.children"
                  style="width: 100%">
                  <el-table-column
                    type="expand">
                    <template  slot-scope="scope">
                      <el-table
                        :data="scope.row.children"
                        style="width: 100%">
                        <el-table-column
                          label="分类名称"
                          prop="cat_name">
                        </el-table-column>
                        <el-table-column
                          label="排序"
                          prop="cat_level">
                          <template slot-scope="scope">
                            <el-tag type="warning" v-if="scope.row.cat_level==2">
                              三级
                            </el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <el-button
                              size="mini"
                              @click="EditThreeLevel(scope.row.cat_id)">编辑</el-button>
                            <el-button
                              size="mini"
                              type="danger"
                              @click="DeleteThreeLevel(scope.row.cat_id)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="分类名称"
                    prop="cat_name">
                  </el-table-column>
                  <el-table-column
                    label="排序"
                    prop="cat_level">
                    <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.cat_level==1">
                        二级
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="handleEdit(scope.row.id)">编辑</el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="DeleteThreeLevel(scope.row.cat_id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              type="index">
            </el-table-column>
            <el-table-column
              label="分类名称"
              prop="cat_name">
            </el-table-column>
            <el-table-column
              label="排序"
              prop="cat_level">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.cat_level==0">
                  一级
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row.id)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="DeleteThreeLevel(scope.row.cat_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'categories',
  data () {
    return {
      categorylist: [],
      categorylisterji: [],
      parentTwolist: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectKeys: [],
      queryInfo: {
        type: 0,
        pagenum: 1,
        pagesize: 20
      },
      value: [],
      // options: [],
      adddialogVisible: false,
      Addform: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      }
    }
  },
  created () {
    this.getCategory()
    this.getParentCategory()
  },
  methods: {
    async DeleteThreeLevel (id) {
      const {data: res} = await this.$http.delete('categories/' + id)
      console.log(id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getCategory()
      this.$message.success('删除成功')
    },
    handleChange () {

    },
    async getParentCategory () {
      const {data: res} = await this.$http.get('categories', {params: {type: 2}})
      this.parentTwolist = res.data
    },
    async getCategory () {
      const {data: res} = await this.$http.get('categories', this.queryInfo)
      this.categorylist = res.data
    },
    handleDelete () {

    },
    handleEdit () {

    },
    Changecascader () {
      console.log(this.selectKeys)
      if (this.selectKeys > 0) {
        this.Addform.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.Addform.cat_level = this.selectKeys.length
        console.log('成功')
      } else {
        this.Addform.cat_pid = 0
        this.Addform.cat_level = 0
        console.log('失败')
      }
    },
    addCate () {
      this.$refs.AddformRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('categories', this.Addform)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败')
        } else {
          this.getCategory()
          this.adddialogVisible = false
          this.$message.success('添加成功')
        }
      })
    },
    closeClearForm () {
      this.$refs.AddformRef.resetFields()
      this.selectKeys = []
      this.Addform.cat_pid = 0
      this.Addform.cat_level = 0
    }
  }
}
</script>

<style scoped>

</style>
