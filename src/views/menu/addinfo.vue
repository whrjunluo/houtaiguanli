<template>
 <div>
<el-dialog :title="addInfo.isAdd?'添加菜单':'编辑菜单'"
      center
      :visible.sync="addInfo.isShow"
      :before-close="cancel">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="菜单名称："  prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="pid" label="上级菜单" :label-width="formLabelWidth">
          <el-select v-model="form.pid" placeholder="请选择">
            <el-option label='顶级菜单' :value='0'></el-option>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item><el-form-item label="菜单类型" :label-width="formLabelWidth">
          <el-radio v-model="form.type" :label="1">目录</el-radio>
          <el-radio v-model="form.type" :label="2">菜单</el-radio>
        </el-form-item>
        <el-form-item  v-if="menu.type == 1" label="菜单图标" :label-width="formLabelWidth">
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
        <el-form-item v-else label="菜单地址" :label-width="formLabelWidth">
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
        <el-form-item label="状态" :label-width="formLabelWidth">
          <!-- 可以使用active-color属性与inactive-color属性来设置开关的背景色。 -->
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value='1'
            :inactive-value='2'
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click='cancel'>取 消</el-button>
        <el-button  v-if='addInfo.isAdd' @click="add('ruleForm')"  type="primary">确 定</el-button>
         <el-button v-else @click="update('ruleForm')" type="primary">编辑</el-button>
      </div>
    </el-dialog>
 </div>
</template>

<script>
//引入封装好的接口
import { addMenu,menuInfo,editMenu } from "../../util/axios";
//引入路由配置项
import { indexRoutes } from "../../router";
//引入辅助性函数
import {mapActions,mapGetters} from 'vuex'
export default {
 data() {
 return {
 //菜单添加表单
      form: {
        pid: "", //上级分类编号
        title: "", //标题
         pid: 0, //上级分类编号 默认是0 是顶级
        icon: "", //图标
        type: 1, //类型1目录2菜单
        url: "", //菜单地址
        status: 1 //状态1正常2禁用
      },
       //上级菜单
      // options: [
      //   {
      //     value: "选项1",
      //     label: "系统管理"
      //   },
      //   {
      //     value: "选项2",
      //     label: "商城管理"
      //   }
          // ],
      iconList: [
        "el-icon-s-tools",
        "el-icon-setting",
        "el-icon-s-goods",
        "el-icon-goods"
      ], //图标列表
      indexRoutes: indexRoutes, //路由配置项
  
      rules: {
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        pid: [{ required: true, message: "请选择上级菜单", trigger: "blur" }]
      },
      formLabelWidth: '120px'//label宽度
 };
 },
  props: ["addInfo"],
  computed:{
    ...mapGetters({
      'options':'menu/getMenuList'
    })
  },
 methods: {
    ...mapActions({
      getMenuList:'menu/getMenuListAction'
    }),
   cancel(){
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
       //添加事件
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
};
</script>

<style lang="" scoped>

</style>
