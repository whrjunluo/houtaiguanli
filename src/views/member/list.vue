<template>
 <div>
 <el-table

    :data="getUserList"
    border
    style="width: 100%">
    <el-table-column
      prop="uid"
      label="用户编号"
      width="180">
    </el-table-column>
     <el-table-column prop="username" label="用户名称" width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="所属角色" width="180">
      </el-table-column>
     <el-table-column label="状态">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="item">
        <div>
             <el-button type="primary" plain size="small" @click="edit(item.row.uid)">编辑</el-button>
             <el-button type="danger" plain size="small"  @click="del(item.row.uid)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>

   <el-pagination :page-size='getmemberSize' background layout="prev, pager, next" :total="getCountNum" @current-change='changePage'>
    </el-pagination>
 </div>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
// 引入接口
import { userDelete } from "../../util/axios";
export default {
 data() {
 return {
 };
 },
 mounted() {
  // 组件一加载触发这个获取用户列表的行动
  console.log(this,"当前this");
  this.getUserListAction()
 },
 computed:{
   ...mapGetters({
     getUserList: "member/getUserList",
      getmemberSize:'member/getMangeSize',
      getCountNum:'member/getCountNum'})
 },
 methods: {
   ...mapActions({
     getUserListAction:'member/getUserListAction', getCountAction:'member/getCountAction',
      changePageAction:'member/changePageAction'}),
      
      changePage(n){
      console.log(n,'当前页码数');
      this.changePageAction(n)
    },
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
          userDelete({uid:id}).then(res=>{
            if (res.data.code == 200) {
              
              this.$message.success(res.data.msg);
              // 删除成功之后，重新获取列表
              this.getUserListAction()
               //重新调取总条数
              this.getCountAction()
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
