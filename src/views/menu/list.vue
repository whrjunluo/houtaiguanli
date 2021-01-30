<template>
  <div>
    <!-- 专门用于列表渲染 -->
    <el-table :data="menuList" border style="width: 100%"
    row-key ="id" :tree-props="{children: 'children'}" default-expand-all>
      <el-table-column prop="id" label="菜单编号" width="180">
      </el-table-column>
      <el-table-column prop="title" label="菜单名称" width="180">
      </el-table-column>
      <el-table-column prop="pid" label="上级菜单"> </el-table-column>
      <el-table-column prop="icon" label="菜单图标" width="180">
      </el-table-column>
      <el-table-column prop="url" label="菜单地址" width="180">
      </el-table-column>
      <el-table-column prop="status" label="状态"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="item">
          <div>
            <el-button type="primary" @click="edit(item.row.id)" size="small">编辑</el-button>
            <el-button type="danger" @click="del(item.row.id)" size="small"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
//引入接口文档
import { deleteMenu } from "../../util/axios";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      menuList: "menu/getMenuList"
    })
  },
  mounted() {
    //当列表渲染触发行动
    this.getMenuList();
    console.log(this,'查看this');
    console.log(mapActions,"查看行动扩展");
    //  mapActions 辅助函数将组件的 methods 映射为 store.dispatch  是一个带有返回值的方法
  },
  methods: {
    ...mapActions({
      getMenuList: "menu/getMenuListAction"
    }),
    //封装编辑事件
    edit(id){
      //告诉父组件，我要打开编辑弹框顺便传一个id
      this.$emit('edit',id)
    },
    //封装删除事件
    del(id) {
      this.$confirm("你确定要删除吗？？？？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调取删除接口
          deleteMenu({
            id
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //当列表删除成功触发行动
              this.getMenuList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="" scoped></style>
