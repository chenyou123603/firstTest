<template>
<div>
  <el-form :model="Form" status-icon :rules="rules" ref="Formref" label-width="100px" class="demo-ruleForm">
    <el-form-item label="用户" prop="username">
      <el-input style="width: 400px" v-model.number="Form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input style="width: 400px" type="password" v-model="Form.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('Form')">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      Form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 12, message: '密码长度在6~12个字符之间', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.Formref.validate(async valid => {
        const {data: res} = await this.$http.post('login', this.Form)
        if (res.meta.status !== 200) {
          this.$message.error('登陆失败')
        } else {
          this.$message({
            message: '登陆成功',
            type: 'success'
          })
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    },
    resetForm () {
      this.$refs.Formref.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
