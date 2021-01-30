<template>
 <div>
<el-dialog :title="addInfo.isAdd?'添加角色':'编辑角色'" :before-close="cancel" :visible.sync="addInfo.isShow">
  <el-form :model="roleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="角色名称" :label-width="formLabelWidth" prop="rolename">
      <el-input v-model="roleForm.rolename" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色权限" :label-width="formLabelWidth">
      <el-tree
  :data="getMenuList"
  show-checkbox
  node-key="id"
  default-expand-all
  ref="tree"
  :props="defaultProps"
  check-strictly>
</el-tree>
    </el-form-item>
    <el-form-item label="状态" :label-width="formLabelWidth">
      <el-switch
    v-model="roleForm.status"
    active-color="#13ce66"
    inactive-color="#ff4949"
    :active-value="1"
    :inactive-value="2">
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
import {addRole,editRole,roleInfo} from '../../util/axios'
export default {
 data() {
 return {
   
   dialogFormVisible: false,
      roleForm: {
          rolename: '',// 角色名称
          menus:"",     //角色权限//菜单权限 存放的是菜单编号，用逗号隔开 '[1,2,3]'
          status: 1, // 1正常 2禁用

        },
         formLabelWidth: '120px',
        defaultProps: {
          children: 'children',
          label: 'title'
        },
         rules: {
          rolename: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          }
 };
 },
 props:['addInfo'],
 computed:{
   ...mapGetters({
     'getMenuList':'menu/getMenuList'
   })
 },
 mounted() {
   this.getMenuListAction();
 },
 methods: {
  ...mapActions({
    'getMenuListAction':'menu/getMenuListAction',
    'getRoleListAction':'role/getRoleListAction',
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
            this.roleForm.menus=this.$refs.tree.getCheckedKeys().join(',')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    //  console.log(this.$refs.tree.getCheckedKeys(),'通过key获取节点');
    
    //  console.log(this.roleForm,'角色表单对象');
    //  调取接口

    addRole(this.roleForm).then(res=>{
      if (res.data.code==200) {
        this.$message.success(res.data.msg)
        //关闭弹窗重置
        this.cancel()
        // 重新获取列表
        this.getRoleListAction()
      }else{
        this.$message.error(res.data.msg)
      }
    }).catch(err=>{
      console.log(err,'添加事件错误信息');
    })
   },
  //  重置事件
  reset(){
    this.roleForm= {
          rolename: '',// 角色名称
          menus:"",     //角色权限//菜单权限 存放的是菜单编号，用逗号隔开 '[1,2,3]'
          status: 1, // 1正常 2禁用

        }
        // 重置角色权限树结构
    this.$refs.tree.setCheckedKeys([]);
  },
  // 查询
  lookInfo(id){
    // 调取查询接口
    roleInfo({id}).then(res=>{
      if (res.data.code==200) {
        this.roleForm = res.data.list
        // 把menus的返回值设置给角色权限
        this.$refs.tree.setCheckedKeys(this.roleForm.menus.split(','));
  this.roleForm.id = id
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
            this.roleForm.menus=this.$refs.tree.getCheckedKeys().join(',')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    //  console.log(this.$refs.tree.getCheckedKeys(),'通过key获取节点');
    
    //  console.log(this.roleForm,'角色表单对象');
    //  调取接口

    editRole(this.roleForm).then(res=>{
      if (res.data.code==200) {
        this.$message.success(res.data.msg)
        //关闭弹窗重置
        this.cancel()
        // 重新获取列表
        this.getRoleListAction()
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
