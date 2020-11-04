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
        <el-form-item label="小程序AppId" prop="appletId">
          <el-input v-model="ruleForm.appletId" />
        </el-form-item>
        <el-form-item label="小程序appSecret" prop="appletSecret">
          <el-input
            v-model="ruleForm.appletSecret"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item label="微信支付商户号" prop="wechatPayMerchant">
          <el-input
            v-model="ruleForm.wechatPayMerchant"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item label="微信支付Api密钥" prop="wechatPayApiKey">
          <el-input
            v-model="ruleForm.wechatPayApiKey"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item label="微信支付apiclient_cert.pem" prop="apiClientCert">
          <el-input
            v-model="ruleForm.apiClientCert"
            type="textarea"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item label="微信支付apiclient_key.pem" prop="apiClientKey">
          <el-input
            v-model="ruleForm.apiClientKey"
            type="textarea"
            placeholder="以隐藏内容，点击查看或编辑"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >保存</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { createApplets, readApplets, updateApplets } from "@/api/applets";

export default {
  name: "User",
  components: {},
  data() {
    return {
      ruleForm: {
        appletId: "",
        appletSecret: "",
        mallId: "",
        wechatPayMerchant: "",
        wechatPayApiKey: "",
        apiClientCert: "",
        apiClientKey: "",
      },
      rules: {
        appletId: [
          { required: true, message: "请输入小程序appId", trigger: "blur" },
        ],
        appletSecret: [
          { required: true, message: "请输入小程序appSecret", trigger: "blur" },
        ],
      },
      listLoading: false,
    };
  },
  created() {
    if (sessionStorage.getItem("currMallInfo")) {
      let mallId = JSON.parse(sessionStorage.getItem("currMallInfo")).id;
      console.log(mallId);
      if (mallId) {
        readApplets({ mallId: mallId }).then((res) => {
          if (res.data.data) {
            this.ruleForm = res.data.data;
          }
        });
      }
    }
  },
  methods: {
    submitForm(formName) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        loading.close();
      }, 2000);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.mallId = JSON.parse(
            sessionStorage.getItem("currMallInfo")
          ).id;

          console.log(this.ruleForm);
          if (this.ruleForm.id) {
            //修改
            delete this.ruleForm.createOn;
            updateApplets(this.ruleForm)
              .then((response) => {
                console.log(response);
                this.$notify.success({
                  title: "成功",
                  message: "修改小程序成功",
                });
              })
              .catch(() => {
                this.$notify.warning({
                  title: "失败",
                  message: "修改小程序失败",
                });
              });
          } else {
            //新增
            createApplets(this.ruleForm)
              .then((response) => {
                console.log(response);
                this.$notify.success({
                  title: "成功",
                  message: "关联小程序成功",
                });
                this.$router.push('/dashboard')
              })
              .catch(() => {
                this.$notify.warning({
                  title: "失败",
                  message: "关联小程序失败",
                });
              });
          }
        } else {
          console.log("参数错误！");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss">
.form-box {
  width: 50%;
}
</style>
