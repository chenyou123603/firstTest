<template>
<div>
  <div style="margin: 10px">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">添加商品</a></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div style="margin: 20px">
    <el-card style="padding: 20px; width: 1400px">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon>
      </el-alert>
      <el-steps :space="200" :active="activeindex" finish-status="success" style="margin:10px">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs :tab-position="'left'" style="margin: 10px;margin-top: 30px" v-model="activeindex" @tab-click="parameterClick">
        <el-tab-pane label="基本信息" name="0">
          <el-form ref="addformref" :model="addForm" :rules="addrule" label-width="80px">
                                  <el-form-item label="商品名称" prop="goods_name">
                                    <el-input v-model="addForm.goods_name"></el-input>
                                  </el-form-item>
                                  <el-form-item label="商品价格" prop="goods_price">
                                    <el-input v-model="addForm.goods_price"></el-input>
                                  </el-form-item>
                                  <el-form-item label="商品数量" prop="goods_number">
                                    <el-input v-model="addForm.goods_number"></el-input>
                                  </el-form-item>
                                  <el-form-item label="商品重量" prop="goods_weight">
                                    <el-input v-model="addForm.goods_weight"></el-input>
                                  </el-form-item>
                                  <el-form-item label="选择商品分类" label-width="150px" prop="goods_cat">
                                    <el-cascader
                                      v-model="addForm.goods_cat"
                                      :options="parentTwolist"
                                      :props="cascaderProps"
                                      @change="Changecascader"
                                      clearable
                                      change-on-select>
                                    </el-cascader>
                                  </el-form-item>
                                </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <template slot-scope="scope">
                <el-row v-for="item in  parameterlist" :key="item.attr_id">
                  <el-tag  style="margin:10px">
                    {{item.attr_name}}
                  </el-tag>
                    <el-checkbox-group v-model="item.attr_vals" >
                    <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i"></el-checkbox>
                  </el-checkbox-group>
                </el-row>
          </template>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
           <el-form :model="staticProperties" ref="jtsxRef">
             <el-form-item :label="jtsx.attr_name"  v-for="jtsx in staticProperties" :key="jtsx.attr_id">
            <el-input v-model="jtsx.attr_vals"></el-input>
           </el-form-item>
           </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :headers="headerObj"
            :on-success="handleSuccess"
            list-type="picture">
            <el-button size="small" type="primary" >点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
<!--          图片预览弹窗开始-->
          <el-dialog
            :visible.sync="previewVisible"
            width="30%"
            :before-close="handleClose">
            <img :src="previewPath" style="width: 100%">
          </el-dialog>
<!--          图片预览弹窗结束-->
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" style="margin: 20px" v-on:click="add()">添加商品</el-button>
        </el-tab-pane>
        <el-tab-pane label="完成" name="5" style="min-height: 300px"></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'add',
  data () {
    return {
      activeindex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addrule: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'}
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'}
        ],
        goods_cat: [
          {required: true, message: '请输入商品分类', trigger: 'blur'}
        ]
      },
      parentTwolist: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      cateid: 0,
      // 动态参数列表
      parameterlist: [],
      // 静态参数列表
      staticProperties: [],
      fileList: [],
      uploadUrl: 'http://timemeetyou.com:8889/api/private/v1/upload',
      headerObj: {
        Authorization:
        window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.getParentCategory()
  },
  methods: {
    async getParentCategory () {
      const {data: res} = await this.$http.get('categories')
      this.parentTwolist = res.data
    },
    Changecascader () {
      // eslint-disable-next-line no-unused-vars
      let nameexample = this.addForm.goods_cat.join(',')
      console.log(nameexample)
    },
    async parameterClick () {
      if (this.activeindex === '1') {
        console.log('动态参数面板')
        this.cateid = this.addForm.goods_cat[2]
        console.log(this.cateid)
        const {data: res} = await this.$http.get(`categories/${this.cateid}/attributes`, {params: {sel: 'many'}})
        console.log('******************------------------------****************************')
        console.log(res)
        console.log('******************------------------------****************************')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })
        this.parameterlist = res.data
      }
      if (this.activeindex === '2') {
        console.log('静态属性面板')
        this.cateid = this.addForm.goods_cat[2]
        console.log(this.cateid)
        const {data: res} = await this.$http.get(`categories/${this.cateid}/attributes`, {params: {sel: 'only'}})
        console.log('******************------------------------****************************')
        console.log(res)
        console.log('******************------------------------****************************')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })
        this.staticProperties = res.data
      }
    },
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove (file) {
      console.log(file)
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中，找到这个图片对应的索引值
      const ghfg = this.addForm.pics.findIndex(x =>
        x.pics === filePath
      )
      // 调用数组的splice方法，把图片信息对象从pics数组中移除
      // for (var i = 0; i < this.addForm.pics.length; i++) {
      //   if (this.addForm.pics[i].pic === file.response.data.tmp_path) {
      //     this.addForm.pics.splice(i, 1)
      //   }
      // }
      this.addForm.pics.splice(ghfg, 1)
      console.log(this.addForm.pics)
    },
    handleSuccess (res) {
      console.log(res)
      // 拼接得到一个图片的信息
      const picInfo = { pic:
        res.data.tmp_path}
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics)
    },
    add () {
      this.$refs.addformref.validate(async valid => {
        if (!valid) {
          this.$message.error('请完成填写必要的表单！')
        }
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.parameterlist.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.staticProperties.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        console.log(form)
        const {data: res} = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style scoped>

</style>
