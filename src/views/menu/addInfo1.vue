<template>
  <div>
    <!-- 弹框内容 -->
    <!--     el-dialog 
    visible	是否显示 Dialog，支持 .sync 修饰符 
    before-close	关闭前的回调，会暂停 Dialog 的关闭	function(done)，done 用于关闭 Dialog
    center	是否对头部和底部采用居中布局	boolean

    props是单项数据流，只能接收，不可以子组件直接修改！！！！子组件想要修改父组件的数据要用子传父！！！！
    -->
    <el-dialog
      :title="addInfo.isAdd?'添加菜单':'编辑菜单'"
      center
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
    >
      <el-form :model="menu" :rules="rules" ref="ruleForm">
        <el-form-item
          label="菜单名称："
          prop="title"
          :label-width="formLabelWidth"
        >
          <el-input v-model="menu.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="上级菜单："
          prop="pid"
          :label-width="formLabelWidth"
        >
          <el-select v-model="menu.pid" placeholder="请选择">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in menuList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型：" :label-width="formLabelWidth">
          <el-radio v-model="menu.type" :label="1">目录</el-radio>
          <el-radio v-model="menu.type" :label="2">菜单</el-radio>
        </el-form-item>
        <!-- 菜单图标和菜单地址，只能渲染一个，根据菜单类型所决定 -->
        <el-form-item
          v-if="menu.type == 1"
          label="菜单图标："
          :label-width="formLabelWidth"
        >
          <!-- 循环icon列表供用户选择 -->
          <el-select v-model="menu.icon" placeholder="请选择">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in iconList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else label="菜单地址：" :label-width="formLabelWidth">
          <!-- 循环path地址列表供用户选择 -->
          <el-select v-model="menu.url" placeholder="请选择">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in indexRoutes"
              :key="item.path"
              :label="item.name"
              :value="item.path"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="menu.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if='addInfo.isAdd' @click="add('ruleForm')" type="primary">确 定</el-button>
        <el-button v-else @click="update('ruleForm')" type="primary">编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入接口文档
import { addMenu,menuInfo,editMenu } from "../../util/axios";
//引入路由配置项
import { indexRoutes } from "../../router";
// console.log(indexRoutes,'indexRoutes111');
import {mapActions,
mapGetters} from 'vuex'
export default {
  data() {
    return {
      //菜单添加表单
      menu: {
        pid: 0, //上级分类编号 int型
        title: "", //标题
        icon: "", //图标
        type: 1, //类型1目录2菜单
        url: "", //菜单地址
        status: 1 //状态1正常2禁用
      },
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2到 6 个字符", trigger: "blur" }
        ],
        pid: [{ required: true, message: "请选择上级菜单", trigger: "change" }]
      },
      formLabelWidth: "120px", //label宽度
      // options: [
      //   {
      //     //假数据模拟菜单列表
      //     value: 1,
      //     label: "系统管理"
      //   },
      //   {
      //     value: 2,
      //     label: "商城管理"
      //   }
      // ],
      iconList: [
        "el-icon-s-tools",
        "el-icon-setting",
        "el-icon-s-goods",
        "el-icon-goods"
      ], //图标列表
      indexRoutes: indexRoutes //路由配置项
    };
  },
  computed:{
    ...mapGetters({
      'menuList':'menu/getMenuList'
    })
  },
  methods: {
    ...mapActions({
      'getMenuList':'menu/getMenuListAction'
    }),
    //取消去改变父组件的数据
    cancel() {
      //关闭弹框！！！！
      this.$emit("cancel",{
        isShow:false,
        isAdd:this.addInfo.isAdd
      });
      this.reset();
    },
    //封装重置函数
    reset() {
      this.menu = {
        pid: 0, //上级分类编号 int型
        title: "", //标题
        icon: "", //图标
        type: 1, //类型1目录2菜单
        url: "", //菜单地址
        status: 1 //状态1正常2禁用
      };
    },
    //封装一个查看一条数据事件
    lookUp(id){
      //调取查看一条数据接口
      menuInfo({
        id
      })
      .then(res=>{
        if(res.data.code==200){
          this.menu = res.data.list
          this.menu.id = id
        }
      })
    },
    //封装修改菜单事件
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editMenu(this.menu).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //成功之后关闭弹框以及重置
              this.cancel();
              //重新调取接口列表
              this.getMenuList()
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //封装添加菜单事件
    add(formName) {
      console.log(this.menu, "表单体");
      this.$refs[formName].validate(valid => {
        if (valid) {
          addMenu(this.menu).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //成功之后关闭弹框以及重置
              this.cancel();
              //重新调取接口列表
              this.getMenuList()
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    // console.log(this.addInfo,'哈哈哈哈')
  },
  props: ["addInfo"]
};
</script>

<style lang="" scoped></style>
