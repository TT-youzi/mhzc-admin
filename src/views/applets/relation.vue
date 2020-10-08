<template>
  <div class="app-container">
    <div class="form-box">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="小程序AppId" prop="appId">
          <el-input v-model="ruleForm.appId" />
        </el-form-item>
        <el-form-item label="小程序appSecret" prop="appSecret">
          <el-input
            v-model="ruleForm.appSecret"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item label="微信支付商户号" prop="merchantNumber">
          <el-input
            v-model="ruleForm.merchantNumber"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item label="微信支付Api密钥" prop="apiCode">
          <el-input
            v-model="ruleForm.apiCode"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item label="微信支付apiclient_cert.pem" prop="apiclient_cert">
          <el-input
            v-model="ruleForm.apiclient_cert"
            type="textarea"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item label="微信支付apiclient_key.pem" prop="apiclient_key">
          <el-input
            v-model="ruleForm.apiclient_key"
            type="textarea"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >保存</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchList, userDetail, updateUser } from '@/api/user'

export default {
  name: 'User',
  components: {},
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        appId: [{ required: true, message: '请输入小程序appId', trigger: 'blur' }],
        appSecret: [
          { required: true, message: '请输入小程序appSecret', trigger: 'blur' }
        ],
        merchantNumber: [
          { required: true, message: '请输入微信支付商户号', trigger: 'blur' }
        ],
        apiCode: [
          { required: true, message: '请输入微信支付Api密钥', trigger: 'blur' }
        ]
        // desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      }
    }
  },
  created() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss">
.form-box {
  width: 50%;
}
</style>
