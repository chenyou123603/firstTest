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
      <el-card class="box-card">
        <template>
          <el-table
            :data="rightlist"
            style="width: 100%">
            <el-table-column
              prop="authName"
              label="权限名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="path"
              label="权限路径"
              width="180">
            </el-table-column>
            <el-table-column
              prop="level"
              label="权限等级">
              <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.level==0">
                  一级
                </el-tag>
                <el-tag type="success" v-if="scope.row.level==1">
                  二级
                </el-tag>
                <el-tag type="warning" v-if="scope.row.level==2">
                  三级
                </el-tag>
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
  name: 'rights',
  data () {
    return {
      rightlist: []
    }
  },
  created () {
    this.getRightlist()
  },
  methods: {
    async getRightlist () {
      const {data: res} = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败！')
      } else {
        this.rightlist = res.data
      }
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
