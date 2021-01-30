<template>
 <div>
   <!-- 面包屑 -->
 <el-bread></el-bread>
 <!-- 添加按钮 -->
  <el-button type="primary" plain size="small" @click="toOpen">添加</el-button>
  <!-- 列表 -->
  <v-table @edit='edit'></v-table>
  <!-- 弹框 -->
  <v-add :addInfo="addInfo" @cancel="cancel" ref="vDilog"></v-add>
 </div>
</template>

<script>
import vTable from './list'
import vAdd from './addInfo'
export default {
 data() {
 return {
   addInfo:{
     isShow:false,
     isAdd:true,//是否是添加还是编辑
   }
 };
 },
 components:{
   vTable,
   vAdd,
 },
 methods:{
  //  打开添加弹框事件
   toOpen(){
    //  console.log(this,"当前this");
     this.addInfo.isShow = true
     this.addInfo.isAdd = true
   },
   cancel(e){
      this.addInfo=e
   },
   edit(e){
    //  打开编辑弹框
    this.addInfo.isShow = true
    this.addInfo.isAdd = false
    this.$refs.vDilog.lookInfo(e)
   }
 }
};
</script>

<style lang="" scoped>

</style>
