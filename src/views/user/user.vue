<template>
    <div>
      <div style="margin:10px">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-card class="box-card">
        <div>
          <div style="margin-top: 20px;">
            <el-input style="width: 400px" placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">

              <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
              </el-input>
              <el-button type="primary" @click="adddialogVisible = true">添加用户</el-button>
<!--            添加用户-->
              <el-dialog
              title="添加用户"
              :visible.sync="adddialogVisible"
              width="30%"
              :before-close="handleClose" @close="addClose">
<!--                内容-->
                <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
                  <el-form-item label="姓名：" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                  </el-form-item>
                  <el-form-item label="密码：" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="电话：" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                  </el-form-item>
                  <el-form-item label="Email：" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                  </el-form-item>
                </el-form>
<!--                确定取消按钮-->
              <span slot="footer" class="dialog-footer">
              <el-button @click="adddialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="adduser" >确 定</el-button>
              </span>
            </el-dialog>
<!--            修改用户-->
            <el-dialog
              title="修改用户信息"
              :visible.sync="alterdialogVisible"
              width="30%"
              :before-close="handleClose" @close="alterClose">
              <!--                内容-->
              <el-form :model="alterForm" :rules="alterRules" ref="alterFormRef" label-width="80px">
                <el-form-item label="姓名：" prop="username" >
                  <el-input v-model="alterForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="mobile">
                  <el-input v-model="alterForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="Email：" prop="email">
                  <el-input v-model="alterForm.email"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
              <el-button @click="alterdialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="alterUserInfo">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <div>
            <el-table
              :data="userlist.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%">
              <el-table-column
                type="index">
              </el-table-column>
              <el-table-column
                label="角色"
                prop="role_name">
              </el-table-column>
              <el-table-column
              label="姓名"
              prop="username">
            </el-table-column>
              <el-table-column
                label="电话"
                prop="mobile">
              </el-table-column>
              <el-table-column
                label="Email"
                prop="email">
              </el-table-column>
              <el-table-column
                align="" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="alterUser(scope.row.id)">Edit</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="deleteUser(scope.row.id)">Delete</el-button>
                  <el-button
                    size="mini"
                    type="success"
                    @click="allocationUser(scope.row)">分配角色</el-button>
<!--                  分配角色开始-->
                  <el-dialog
                    title="分配角色"
                    :visible.sync=" allocationdialogVisible"
                    width="30%"
                    @close="setRoleDialogVisible"
                    >
                    <span>
                      <div>
                        <span style="margin:5px">当前的用户</span>
                        <span style="margin:5px">{{userInfo.username}}</span>
                      </div>
                      <div>
                        <span style="margin:5px">当前的角色</span>
                        <span style="margin:5px">{{userInfo.role_name}}</span>
                      </div>
                      <div>
                        <span style="margin:5px">分配新角色</span>
                        <span style="margin:5px">
                          <template>
                            <el-select v-model="selectedRoleId" placeholder="请选择">
                              <el-option
                                v-for="item in rolelist"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </template>
                        </span>
                      </div>
                    </span>
                    <span slot="footer" class="dialog-footer">
    <el-button @click="allocationdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="savaRoleInfo()">确 定</el-button>
  </span>
                  </el-dialog>
<!--                  分配角色结束-->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
                <div style="margin-top: 20px">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 5, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                  </el-pagination>
                </div>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'users',
  created () {
    this.getUsers()
  },
  data () {
    return {
      userInfo: {
        username: '',
        role_name: ''
      },
      value: '',
      allocationdialogVisible: false,
      alterForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      addRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
          // {min: 6, max: 12, message: '密码长度在6~12个字符之间', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
          {min: 11, max: 11, message: '请检查手机号是否正确', trigger: 'blur'}
        ]
      },
      alterRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
          // {min: 6, max: 12, message: '密码长度在6~12个字符之间', trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
          {min: 11, max: 11, message: '请检查手机号是否正确', trigger: 'blur'}
        ]
      },
      adddialogVisible: false,
      alterdialogVisible: false,
      allocationForm: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      rolelist: [],
      selectedRoleId: '',
      total: 0,
      search: ''
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    adduser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败！')
        } else {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          this.adddialogVisible = false
          this.getUsers()
        }
      })
    },
    async deleteUser (id) {
      // eslint-disable-next-line no-lone-blocks

      const confirmResult = await this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const {data: res} = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户信息失败！')
      } else {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getUsers()
      }
    },
    async alterUser (id) {
      this.alterdialogVisible = true
      console.log(id)
      const {data: res} = await this.$http.get('users/' + id)
      this.alterForm = res.data
      console.log(this.alterForm)
    },
    alterUserInfo () {
      this.$refs.alterFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.put('users/' + this.alterForm.id, {email: this.alterForm.email, mobile: this.alterForm.mobile})
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('修改用户信息失败！')
        } else {
          this.alterdialogVisible = false
          this.getUsers()
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
        }
      })
    },
    alterClose () {
      this.$refs.alterFormRef.resetFields()
    },
    addClose () {
      this.$refs.addFormRef.resetFields()
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getUsers()
      // 几条每页
    },
    handleCurrentChange (val) {
      // 第几页
      this.queryInfo.pagenum = val
      this.getUsers()
    },
    async getUsers () {
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      console.log('-------------')
      console.log(res.data)
      if (res.meta.status !== 200) {
        console.log('获取用户列表失败')
      } else {
        this.userlist = res.data.users
        this.total = res.data.total
        console.log(this.userlist)
      }
    },
    async allocationUser (userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前获取全部角色
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败！')
      }
      this.rolelist = res.data
      this.allocationdialogVisible = true
    },
    async savaRoleInfo () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择需要分配的角色！')
      }
      const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.selectedRoleId})
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败！')
      }

      this.$message.success('分配角色成功！')
      this.getUsers()
      this.allocationdialogVisible = false
    },
    setRoleDialogVisible () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 1400px;
    margin: 20px;
  }
</style>
