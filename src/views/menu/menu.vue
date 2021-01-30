<template>
 <div>
    <!-- 面包屑 -->
    <el-bread></el-bread>
    <!-- 添加按钮，用于控制弹框的显示 -->
    <el-button @click='toOpen' type="primary" plain size="small" class="el-add">添加</el-button>
    <v-add ref='vAdd' @cancel='cancel' :addInfo ='addInfo'></v-add>
    <!-- 列表 -->
     <v-table  @edit='edit'></v-table>
 </div>
</template>

<script>
import vTable from './list'
import vAdd from "./addInfo1"
export default {
 data() {
 return {
    addInfo:{
        isShow:false,//控制弹框显示隐藏
        isAdd:true//用于控制添加或者编辑 true是添加
      }
 };
 },
 methods: {
   //  点击添加按钮，出现弹框
    toOpen(){
      //打开弹框
      this.addInfo.isShow = true
      //告诉弹框你是添加
      this.addInfo.isAdd =true
    },
    cancel(e){
      console.log(e,'子组件修改父组件的数据');
      this.addInfo =e
    },
    //封装一个编辑事件
    edit(e){
      //打开编辑弹框
      this.addInfo.isShow =true
      //告诉弹框你是编辑
      this.addInfo.isAdd = false
      this.$refs.vAdd.lookUp(e)
    }
 },
 components:{
    vTable,
    vAdd
 }
};
</script>

<style lang="" scoped>

</style>
