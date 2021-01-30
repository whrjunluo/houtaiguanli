<template>
 <div>
 <el-table
    :data="getRoleList"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="角色编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="rolename"
      label="角色名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="item">
        <div>
             <el-button type="primary" plain size="small" @click="edit(item.row.id)">编辑</el-button>
             <el-button type="danger" plain size="small"  @click="del(item.row.id)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
 </div>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
// 引入接口
import { deleteRole } from "../../util/axios";
export default {
 data() {
 return {
 };
 },
 mounted() {
  // 组件一加载触发这个获取角色列表的行动
  console.log(this,"当前this");
  this.getRoleListAction()
 },
 computed:{
   ...mapGetters({'getRoleList':'role/getRoleList'})
 },
 methods: {
   ...mapActions({'getRoleListAction':'role/getRoleListAction'}),
   edit(id){
     this.$emit('edit',id)
   },
  //  look(e){
  //    console.log(e,"item是啥");
  //  }
  del(id){
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 调取删除接口
          deleteRole({id}).then(res=>{
            if (res.data.code == 200) {
              
              this.$message.success(res.data.msg);
              // 删除成功之后，重新获取列表
              this.getRoleListAction()
            }else{
              this.$message.error(res.data.msg);
            }
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
  }
 },
};
</script>

<style lang="" scoped>

</style>
