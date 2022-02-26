<template>
<div>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" router>
        <el-submenu :index="item.id+' '" v-for="item in menulist" :key="item.id">
          <template slot="title"><i class="el-icon-message"></i>{{item.authName}}</template>
          <el-menu-item-group v-for="item1 in item.children" :key="item1.id" >
            <el-menu-item :index="'/'+item1.path">{{item1.authName}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <router-view></router-view>
    </el-container>
  </el-container>

</div>
</template>

<script>
export default {
  created () {
    this.getMenuList()
  },
  data () {
    return {
      menulist: []
    }
  },
  name: 'home',
  methods: {
    quit () {
      window.sessionStorage.getItem('token')
      this.$router.push('/login')
    },
    async getMenuList () {
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(this.menulist)
    }
  }
}
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>
