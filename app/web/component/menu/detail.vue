<template>
<div class="detail">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="权限id" prop="codeId">
            <el-input v-model="ruleForm.codeId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级id" prop="parentId">
            <el-input v-model="ruleForm.parentId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
            <el-input v-model="ruleForm.icon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否总显示" prop="is_always_show">
            <el-switch on-text="" off-text="" v-model="ruleForm.is_always_show"></el-switch>
        </el-form-item>
        <el-form-item label="是否入驻" prop="is_join">
            <el-switch on-text="" off-text="" v-model="ruleForm.is_join"></el-switch>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="ruleForm.menuName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="url">
            <el-input v-model="ruleForm.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

  <style>
    .detail {
        width: 50%;
        margin: 0 auto;
    }
  </style>
  <script>
  import { mapGetters } from 'vuex';
  export default {
      data() {
          const checkIsShowWithCodeId = (rule, value, callback) => {
              if (this.ruleForm.is_always_show && value) {
                  callback(new Error('权限id只能为空'));
              } else if (!this.ruleForm.is_always_show && !value) {
                  callback(new Error('权限id为必填项'));
              } else {
                  callback();
              }
          };
        // is_always_show为false时，codeId不能为空，即
          const checkIsShowWithParentId = (rule, value, callback) => {
              if (!this.ruleForm.is_always_show && value) {
                  callback(new Error('父级id只能为空'));
              } else if (this.ruleForm.is_always_show && !value) {
                  callback(new Error('父级id为必填项'));
              } else {
                  callback();
              }
          };
          return {
              ruleForm: {
                  codeId: '',
                  parentId: '',
                  icon: '',
                  is_always_show: false,
                  is_join: true,
                  menuName: '',
                  url: ''
              },
              rules: {
                  codeId: [
                    { min: 1, message: '最少输入1个字符', trigger: 'blur' },
                    { validator: checkIsShowWithCodeId, trigger: 'blur' }
                  ],
                  parentId: [
                    { min: 1, message: '最少输入1个字符', trigger: 'blur' },
                    { validator: checkIsShowWithParentId, trigger: 'blur' }
                  ],
                  icon: [
                    { required: true, message: '请输入图标', trigger: 'blur' },
                    { min: 3, message: '最少输入3个字符', trigger: 'blur' }
                  ],
                  menuName: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                    { min: 2, message: '最少输入2个字符', trigger: 'blur' }
                  ],
                  url: [
                    { min: 3, message: '最少输入3个字符', trigger: 'blur' }
                  ]
              }
          };
      },
      mounted() {
          if (this.$route.params.id) {
              this.getData(this.$route.params.id);
          }

      },
      methods: {
          submitForm(formName) {
              this.$refs[formName].validate(async valid => {
                  if (valid) {
                    // 判断请求id和获取id相同
                      const url = (this.$route.params.id && this.$route.params.id === this.ruleForm._id) ? 'editMenu' : 'saveMenu';
                      const loginRs = await this.$store.dispatch(url, this.ruleForm);
                      if (loginRs.statusCode) {
                        // error
                      } else {
                          this.$router.replace('/menuList');
                      }
                  } else {
                      return false;
                  }
              });
          },
          async getData(id) {
              const rs = await this.$store.dispatch('menuDetail', id);
              this.ruleForm = rs;
          },
          resetForm(formName) {
              this.$refs[formName].resetFields();
          }
      }
};
  </script>
