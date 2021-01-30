<template>
  <div>
    <!-- 面包屑 -->
    <el-bread></el-bread>
    <!-- 添加按钮 -->
    <el-button type="primary" size="small" @click="isAdd">添加</el-button>
    <!-- 列表渲染 -->
    <v-table @edit='edit'></v-table>
    <!-- 弹框渲染 -->
    <v-dialog  ref='dialog' @cancel='cancel' :addInfo='addInfo'></v-dialog>
  </div>
</template>

<script>
//引入管理员管理列表
import vTable from "./list";
import vDialog from "./addInfo";
export default {
  data() {
    return {
      addInfo: {
        //用于打开弹框（控制弹框）
        isShow: false,
        //用于区分是添加还是编辑
        isAdd: true
      }
    };
  },
  components: {
    vTable,
    vDialog
  },
  methods: {
    //添加事件
    isAdd(){
      //打开弹框
      this.addInfo.isAdd =true 
      this.addInfo.isShow = true
    },
    //取消事件
    cancel(e){
      //关闭弹框
      this.addInfo.isShow = e
    },
    //触发编辑事件
    edit(e){
      //打开弹框
      this.addInfo.isAdd =false 
      this.addInfo.isShow = true
      this.$refs.dialog.look(e)
    }
  },
};
</script>

<style lang="" scoped>
.el-button{
  margin-bottom: 20px;
}
</style>
