<template>
    <div>
      <div id="top" style="margin:10px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">参数列表</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-form ref="AddformRef" :model="Addform" label-width="80px">
          <el-form-item label="选择商品分类" label-width="150px">
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
      </div>
      <div style="margin:20px">
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button style="margin-top: 10px"  type="primary" :disabled="isdisabled" @click="adddialogVisible=true">添加参数</el-button>
              <template style="margin-top: 10px">
                <el-table
                  :data="parameterList"
                  style="width: 1400px">
<!--                  展开列开始-->
                  <el-table-column
                    type="expand">
                    <template slot-scope="scope">
                      <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" style="margin-right: 10px">
                        {{item}}
                      </el-tag>
                    </template>
                  </el-table-column>
<!--                  展开列结束-->
                  <el-table-column
                    label="参数名称"
                    prop="attr_name"
                    width="680">
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row.attr_id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
              <el-button style="margin-top: 10px"  type="primary" :disabled="isdisabled" @click="adddialogVisible=true">添加属性</el-button>
              <template style="margin-top: 10px">
                <el-table
                  :data="parameterList"
                  style="width: 1400px">
                  <!--                  展开列开始-->
                  <el-table-column
                    type="expand">
                    <template slot-scope="scope">
                      <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" style="margin-right: 10px" closable :disable-transitions="false" @close="handleClose(tag)">
                        {{item}}
                      </el-tag>
<!--                      <el-input-->
<!--                        class="input-new-tag"-->
<!--                        v-if="inputVisible"-->
<!--                        v-model="inputValue"-->
<!--                        ref="saveTagInput"-->
<!--                        size="small"-->
<!--                        @keyup.enter.native="handleInputConfirm"-->
<!--                        @blur="handleInputConfirm"-->
<!--                      >-->
<!--                      </el-input>-->
<!--                      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>-->
                    </template>
                  </el-table-column>
                  <!--                  展开列结束-->
                  <el-table-column
                    label="参数名称"
                    prop="attr_name"
                    width="680">
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row.attr_id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
      <!--              添加参数弹窗开始-->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="adddialogVisible"
        width="30%">
                <span>
                  <el-form ref="addformref" :model="addattrform" label-width="80px">
                    <el-form-item :label="titleText" prop="attr_name">
                      <el-input v-model="addattrform.attr_name"></el-input>
                    </el-form-item>
                  </el-form>
                </span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="adddialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addAttr">确 定</el-button>
                </span>
      </el-dialog>
      <!--              添加参数弹窗结束-->
    </div>
</template>

<script>
export default {
  name: 'params',
  data () {
    return {
      tableData: [],
      selectKeys: [],
      parentTwolist: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      Addform: {
        cat_pid: '',
        cat_name: '',
        cat_level: ''
      },
      activeName: 'many',
      parameterList: [],
      specificParameters: [],
      adddialogVisible: false,
      addattrform: {
        attr_name: ''
      }
    }
  },
  created () {
    this.getParentCategory()
  },
  computed: {
    isdisabled () {
      if (this.selectKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateid () {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2]
      } else {

      }
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    handleClick (tab, event) {
      // this.activeName = console.log(tab.name)
      console.log(this.activeName)
      this.Changecascader()
    },
    async getParentCategory () {
      const {data: res} = await this.$http.get('categories')
      this.parentTwolist = res.data
    },
    async Changecascader () {
      console.log(this.activeName)
      console.log(this.selectKeys)
      if (this.selectKeys.length !== 3) {
        this.$message.error('请选择三级分类')
        this.selectKeys = []
      }
      const {data: res} = await this.$http.get(`categories/${this.cateid}/attributes`, {params: {sel: this.activeName}})
      if (res.meta.status !== 200) {
        this.$message.error('获取参数失败！')
      } else {
        console.log(res)
        this.parameterList = res.data

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })
        console.log(this.specificParameters)
      }
    },
    addAttr () {
      this.$refs.addformref.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post(`categories/${this.cateid}/attributes`, {attr_name: this.addattrform.attr_name, attr_sel: this.activeName})
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败！')
        } else {
          this.Changecascader()
          this.adddialogVisible = false
          this.$message.success('添加成功！')
        }
      })
    },
    async handleDelete (id) {
      const {data: res} = await this.$http.delete(`categories/${this.cateid}/attributes/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除失败！')
      } else {
        this.Changecascader()
        this.$message.success('删除成功！')
      }
    }
  }
}
</script>

<style scoped>

</style>
