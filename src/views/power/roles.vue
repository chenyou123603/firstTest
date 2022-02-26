<template>
  <div>
    <!--    头部  面包屑-->
    <div>
      <el-breadcrumb separator="/" style="margin: 15px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--    列表-->
    <div>
      <el-button type="primary" style="margin:10px">添加角色</el-button>
      <el-card class="box-card">
        <template>
          <el-table
            :data="roleslist"
            style="width: 100%">
<!--            展开列-->
            <el-table-column
              type="expand">
              <template slot-scope="scope">
                <el-row v-for="item1 in scope.row.children" :key="item1.id">
                  <el-col :span="5">
<!--                    {{item1.authName}}-->
                    <el-tag type="success">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right" style="margin-left: 5px"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-row v-for="item2 in item1.children" :key="item2.id">
                      <el-col :span="7">
<!--                        {{item2.authName}}-->
                        <el-tag type="warning">{{item2.authName}}</el-tag>
                        <i class="el-icon-caret-right" style="margin-left: 5px"></i>
                      </el-col>
                      <el-col :span="14">
<!--                          {{item3.authName}}-->
                          <el-tag style="margin: 8px"  v-for="item3 in item2.children" :key="item3.id"
                                  closable @click="deletetags(scope.row,item3.id)">
                            {{item3.authName}}
                          </el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
<!--            索引列-->
            <el-table-column
              prop="roleName"
              label="角色名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="roleDesc"
              label="角色描述"
              width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row.id)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)">删除</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  @click="showsetDiolog(scope.row)">分配权限</el-button>
<!--                分配权限弹窗开始-->
                <el-dialog
                  title="分配权限"
                  :visible.sync="showsetdialogVisible"
                  width="30%"
                @close="setDiologClose">
                  <span>
                    <el-tree
                      :data="rightlist"
                      show-checkbox
                      node-key="id"
                      :default-checked-keys="defKey"
                      default-expand-all
                      ref="treeRef"
                      :props="treeProps">
                    </el-tree>
                  </span>
                  <span slot="footer" class="dialog-footer">
    <el-button @click="showsetdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitTree">确 定</el-button>
  </span>
                </el-dialog>
<!--                分配权限弹窗结束-->
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
  name: 'roles',
  data () {
    return {
      roleslist: [],
      showsetdialogVisible: false,
      rightlist: [],
      defKey: [],
      // 即将分配权限的ID
      roleId: '',
      treeProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  created () {
    this.getRoleslist()
  },
  methods: {
    async getRoleslist () {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败！')
      } else {
        this.roleslist = res.data
      }
    },
    async deletetags (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (!confirmResult) {
        this.$message.info('取消删除')
      } else {
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除失败')
        } else {
          this.$message({
            message: '添加成功！',
            type: 'success'
          })
          role.children = res.data
          // this.getRoleslist()
        }
      }
    },
    async showsetDiolog (role) {
      this.roleId = role.id
      const {data: res} = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败！')
      } else {
        this.rightlist = res.data
        this.getleafKeys(role, this.defKey)
        this.showsetdialogVisible = true
      }
    },
    getleafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getleafKeys(item, arr)
      )
    },
    setDiologClose () {
      this.defKey = []
    },
    async submitTree () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()]
      console.log(keys)

      const idStr = keys.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('权限分配失败！')
      }
      this.$message({
        message: '权限分配成功！',
        type: 'success'
      })
      this.getRoleslist()
      this.showsetdialogVisible = false
    },
    handleEdit (id) {

    },
    handleDelete (id) {

    }
  }
}
</script>

<style scoped>
  .box-card{
    width: 1400px;
    margin: 20px;
  }
</style>
