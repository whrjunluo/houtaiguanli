<template>
  <div>
    <!-- 面包屑 -->
    <el-bread></el-bread>
    <!-- 添加按钮 -->
    <el-button type="primary" size="small" @click="isAdd">添加</el-button>
    <!-- 表格列表渲染 -->
    <v-table @edit='edit'></v-table>
    <!-- 弹框表单 -->
    <v-dialog ref='dialog' @cancel="cancel" :addInfo="addInfo"></v-dialog>
  </div>
</template>

<script>
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
    //打开弹框事件
    isAdd() {
      this.addInfo.isShow = true;
      //点击添加的时候，告诉弹框你是添加
      this.addInfo.isAdd = true
    },
    //cancel事件去改变弹框的属性
    cancel(e) {
      this.addInfo.isShow = e;
    },
    //编辑事件
    edit(e){
      //e是表格传递的id
      console.log(e,'eeeediidididi')
      //这个事件一触发，就知道是编辑了，就要修改弹框状态
      //打开弹框
      this.addInfo.isShow=true 
      //告诉弹框你是一个编辑
      this.addInfo.isAdd =false
      //获取弹框的函数
      // console.log(this.$refs.dialog)
      this.$refs.dialog.look(e)
    }
  }
};
</script>

<style lang="" scoped></style>
