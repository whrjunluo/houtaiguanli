<template>
  <div>
    <el-table :data="getSpecsList" border style="width: 100%">
      <el-table-column prop="id" label="规格编号" width="180">
      </el-table-column>
      <el-table-column prop="specsname" label="规格名称" width="180">
      </el-table-column>
      <el-table-column label="规格属性" width="180">
        <template slot-scope="item">
          <div>
            <el-tag v-for="attr in item.row.attrs"  type="info" :key='attr'>{{attr}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="primary" @click="edit(item.row.id)" size="small"
              >编辑</el-button
            >
            <el-button type="danger" @click="del(item.row.id)" size="small"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器 
      background	是否为分页按钮添加背景色	boolean	—	false
page-size	每页显示条目个数，支持 .sync 修饰符	number	—	10
total	总条目数	number	—	—
current-change	currentPage 改变时会触发	当前页
      -->
    <el-pagination :page-size='getSpecsSize' background layout="prev, pager, next" :total="getCountNum" @current-change='changePage'>
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//引入封装好的接口模块
import { getSpecsDelete } from "../../util/axios";
export default {
  data() {
    return {};
  },
  mounted() {
    //组件一加载触发这个获取规格列表的行动
    this.getSpecsListAction();
    //触发总条数行动
    this.getCountAction()
  },
  computed: {
    //store模块添加了命名空间，所以要修改名字
    ...mapGetters({
      getSpecsList: "specs/getSpecsList",
      getSpecsSize:'specs/getSpecsSize',
      getCountNum:'specs/getCountNum'
    })
  },
  methods: {
    ...mapActions({
      getSpecsListAction: "specs/getSpecsListAction",
      getCountAction:'specs/getCountAction',
      changePageAction:'specs/changePageAction'
    }),
    //切换页码触发的事件
    changePage(n){
      console.log(n,'当前页码数');
      this.changePageAction(n)
    },
    //封装编辑事件
    edit(id) {
      this.$emit("edit", id);
    },
    //封装一个删除事件
    del(id) {
      this.$confirm("你确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调取删除接口
          getSpecsDelete({
            id
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //删除之后要重新调取列表
              this.getSpecsListAction();
              //重新调取总条数
              this.getCountAction()
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

<style lang="" scoped>
.el-pagination{
  float: right;
  margin: 20px 35px 0 0;
}</style>
