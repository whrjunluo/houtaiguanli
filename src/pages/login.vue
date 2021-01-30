<template>
 <div class="login">
   <el-form :model="loginList" :rules="rules" ref="loginList" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username" class="name">
    <el-input v-model="loginList.username" clearable></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password" class="pass">
    <el-input type="password" v-model="loginList.password" clearable show-password></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="login('loginList')" class="loginbtn">立即登录</el-button>
    <el-button @click="resetForm('loginList')">重置</el-button>
  </el-form-item>
</el-form>
 </div>
</template>

<script>
import { mapActions } from "vuex";
import {userLogin} from "../util/axios";
export default {
 data() {

 return {

        loginList: {
          username: '',
          password:''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
           password: [
            { required:true,message: '请输入密码', trigger: 'blur' },
             { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
          ],
        }
    }
 },
 methods: {
  //  获取本地登录信息
  ...mapActions(['changeUserInfoAction']),
  //  提交表单方法
      login(formName) {
        console.log(formName,'formName');
        this.$refs[formName].validate((valid) => {
          console.log(valid,'valid内容');
          if (valid) {
            userLogin(this.loginList).then(res=>{
              console.log(res,'登录信息');
              if (res.data.code == 200) {
                 this.$message.success(res.data.msg)
 
                // 把信息存储到vuex中
                 this.changeUserInfoAction(res.data.list)
                //跳转到首页
                this.$router.push('/home')
              }else{
                this.$message.error(res.data.msg)
              }
            })

          }else{
            console.log("error submit!!");
            return false;
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

    },
    mounted() {
      let loginbtn = document.querySelector('.loginbtn')
      document.onkeyup = function(){
        let key = window.event.keyCode;
        if (key == 13 || key == 100) {
          loginbtn.click();
        }
      }
    },
};
</script>

<style lang="" scoped>
.login{
  height: 100vh;
  background-color: #cccccc;
}
  .demo-ruleForm{
    width: 500px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform:translate(-50%,-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius:10px;
  }
  .name,.pass{
    width: 400px;
  }
</style>
