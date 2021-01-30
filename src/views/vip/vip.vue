<template>
  <div>
    <!-- 面包屑 -->
    <el-bread></el-bread>
    <!-- 列表渲染 -->
    <v-table @edit="edit"></v-table>
    <!-- 弹框 -->
    <v-dialog ref="dialog" @cancel="cancel" :addInfo="addInfo"></v-dialog>
  </div>
</template>

<script>
import vTable from "./list";
import vDialog from "./addInfo";
export default {
  data() {
    return {
      addInfo: {
        isShow: false, //弹框打开关闭
        isAdd: true //添加还是编辑
      }
    };
  },
  components: {
    vTable,
    vDialog
  },
  methods: {
    //子组件触发的父组件修改弹框状态
    cancel() {
      this.addInfo.isShow = false;
    },
    //子组件触发父组件联动编辑
    edit(e) {
      this.addInfo.isShow = true;
      this.addInfo.isAdd = false;
      this.$refs.dialog.look(e);
    }
  }
};
</script>

<style lang="" scoped>
.el-button{
  margin-bottom: 20px;
}
</style>
