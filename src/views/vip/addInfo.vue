<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加会员' : '修改会员'"
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
      center
    >
      <el-form :model="form" :rules="rules" ref="rules">
        <el-form-item
          prop="phone"
          label="手机号:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="nickname"
          label="昵称:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch
            v-model="form.status"
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
        <el-button @click="update" type="primary">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
import {  getMemberInfo, getMemberEdit } from "../../util/axios";
export default {
  data() {
    return {
      //表单对象
      form: {
        nickname: "", // 昵称
        phone: "", //手机号
        password:'',//密码
        status: 1 //状态1正常2禁用
      },
      //label宽度
      formLabelWidth: "120px",
      //规则验证
      rules: {
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
        ],
        phone:[
          { required: true, message: "请输入手机号", trigger: "blur" },
        ]
      }
    };
  },
  computed: {
  },
  mounted() {
  },
  props: ["addInfo"],
  methods: {
    //封装重置事件
    reset() {
      this.form = {
        nickname: "", // 昵称
        phone: "", //手机号
        password:'',//密码
        status: 1 //状态1正常2禁用
      };
       this.$refs['rules'].resetFields();
    },
    //点击取消修改父组件弹框事件
    cancel() {
      this.$emit("cancel", false);
      //调用重置
      this.reset();
    },
    //调取行动
    ...mapActions({
      getvipList: "vip/getMemberListAction"
    }),
    //封装一个查看一条数据的方法
    look(uid) {
      //调取查看接口
      getMemberInfo({ uid }).then(res => {
        console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.uid = uid;
        }
      });
    },
    //编辑确定事件
    update() {
      //调取添加接口
      getMemberEdit(this.form).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          //重新调取接口
          this.getvipList();
          //关闭弹框
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="" scoped></style>
