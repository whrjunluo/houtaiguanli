<template>
 <div>
<el-dialog :title="addInfo.isAdd?'添加用户':'编辑用户'" :before-close="cancel" :visible.sync="addInfo.isShow">
  <el-form :model="userForm" :rules="rules" ref="ruleForm">
    <el-form-item label="所属角色" :label-width="formLabelWidth" prop="roleid">
      <el-select v-model="userForm.roleid" placeholder="请选择">
            <el-option
              v-for="item in getRoleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            >
            </el-option>
          </el-select>
    </el-form-item>
    <el-form-item label="用户名称" prop="username" 
    :label-width="formLabelWidth">
       <el-input v-model="userForm.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth">
      <el-input v-model="userForm.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="userForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="add('ruleForm')" v-if="addInfo.isAdd">确 定</el-button>
    <el-button type="primary" @click="updata('ruleForm')" v-else>编 辑</el-button>
  </div>
</el-dialog>
 </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
// 接口模块
import {userAdd,userEdit,userInfo} from '../../util/axios'
export default {
 data() {
 return {
   
   dialogFormVisible: false,
      userForm: {
           roleid: "", //角色编号
        username: "", //管理员名称
        password: "", //密码
        status: 1 //1是正常2禁用

        },
         formLabelWidth: '120px',
         rules: {
          username: [
            { required: true, message: '请输入管理员名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ], 
          roleid: [
          { required: true, message: "请选择所属角色", trigger: "change" }
        ]
          }
 };
 },
 props:['addInfo'],
 computed:{
   ...mapGetters({
     'getRoleList':'role/getRoleList'
   })
 },
 mounted() {
   this.getRoleListAction();
 },
 methods: {
  ...mapActions({
    'getRoleListAction':'role/getRoleListAction',
    'getUserListAction':'member/getUserListAction',
     'getCountAction': "member/getCountAction"
  }),
   cancel(){
     this.$emit('cancel',{
       isShow:false,
       isAdd:this.addInfo.isAdd
     })
     this.reset()
   },
  //  添加事件
   add(formName){
     this.$refs[formName].validate((valid) => {
          if (valid) {
            userAdd(this.userForm).then(res=>{
      if (res.data.code==200) {
        this.$message.success(res.data.msg)
        //关闭弹窗重置
        this.cancel()
        // 重新获取列表
        this.getUserListAction()
         //重新调取下总数（当你添加成功，分页也要跟着变化，只有总数变化之后，分页才能跟着变化）
              this.getCountAction();
      }else{
        this.$message.error(res.data.msg)
      }
    }).catch(err=>{
      console.log(err,'添加事件错误信息');
    })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    //  console.log(this.$refs.tree.getCheckedKeys(),'通过key获取节点');
    
    //  console.log(this.userForm,'管理员表单对象');
    //  调取接口

    
   },
  //  重置事件
  reset(){
    this.userForm= {
            roleid: "", //角色编号
        username: "", //管理员名称
        password: "", //密码
        status: 1 //1是正常2禁用

        }
         //重置规则验证
      this.$refs['ruleForm'].resetFields();
  },
  // 查询
  lookInfo(id){
    // 调取查询接口
    userInfo({uid:id}).then(res=>{
      if (res.data.code==200) {
        this.userForm = res.data.list

        this.userForm.uid = id
      }else{
        this.$message.error(res.data.msg)
      }
    }).catch(err=>{
      console.log(err,'添加事件错误信息');
    })
  },
  // 修改事件
   updata(formName){
     this.$refs[formName].validate((valid) => {
          if (valid) {
            this.userForm.menus=this.$refs.tree.getCheckedKeys().join(',')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    //  console.log(this.$refs.tree.getCheckedKeys(),'通过key获取节点');
    
    //  console.log(this.userForm,'管理员表单对象');
    //  调取接口

    userEdit(this.userForm).then(res=>{
      if (res.data.code==200) {
        this.$message.success(res.data.msg)
        //关闭弹窗重置
        this.cancel()
        // 重新获取列表
        this.getUserListAction()
        //重新调取下总数（当你添加成功，分页也要跟着变化，只有总数变化之后，分页才能跟着变化）
              this.getCountAction();
      }else{
        this.$message.error(res.data.msg)
      }
    }).catch(err=>{
      console.log(err,'添加事件错误信息');
    })
   },
  
 },
};
</script>

<style lang="" scoped>

</style>
