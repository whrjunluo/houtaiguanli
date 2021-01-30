<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加秒杀管理' : '修改秒杀管理'"
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
      center
    >
      <el-form :model="form" :rules="rules">
        <el-form-item
          prop="title"
          label="秒杀管理名称:"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限:" :label-width="formLabelWidth">
          <el-date-picker
            v-model="timer"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="一级分类">
          <el-select v-model="form.first_cateid" @change="changeCate(false)">
            <el-option value label="请选择" disabled></el-option>
            <!-- 调取商品分类的列表接口 -->
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="二级分类">
          <el-select v-model="form.second_cateid" @change="changeGoods(false)">
            <!-- 二级分类一定是根据一级分类选择之后的联动信息 -->
            <el-option value label="请选择" disabled></el-option>
            <el-option
              v-for="item in secondArr"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="商品">
          <el-select v-model="form.goodsid">
            <!-- 二级分类一定是根据一级分类选择之后的联动信息 -->
            <el-option
              v-for="item in goodsArr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            >
            </el-option>
            <el-option value label="请选择" disabled></el-option>
          </el-select>
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
        <el-button v-if="addInfo.isAdd" @click="add" type="primary"
          >添 加</el-button
        >
        <el-button v-else @click="update" type="primary">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
import {
  getGoodsList,
  getSeckAdd,
  getSeckInfo,
  getSeckEdit
} from "../../util/axios";
export default {
  data() {
    return {
      //表单对象
      form: {
        title: "", //限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: 1 //状态1正常2禁用
      },
      timer: "", //日期
      //创建一个二级分类数据
      secondArr: [],
      goodsArr: [], //商品数组
      //label宽度
      formLabelWidth: "120px",
      //规则验证
      rules: {
        title: [
          { required: true, message: "请输入秒杀管理名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    //获取菜单列表
    ...mapGetters({
      cateList: "cate/getCateList"
    })
  },
  mounted() {
    this.getCateListAction();
  },
  props: ["addInfo"],
  methods: {
    //封装一个以及分类切换事件
    changeCate(n) {
      //查找与catelist符合的一级分类所在的索引
      let index = this.cateList.findIndex(
        item => this.form.first_cateid == item.id
      );
      //二级分类数组赋值
      this.secondArr = this.cateList[index].children;
      //清空二级分类双向数据绑定
      if (!n) {
        this.form.second_cateid = "";
        this.form.goodsid = "";
      }
    },
    //封装一个切换商品的事件
    changeGoods(n) {
      //调取商品接口列表
      getGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid
      }).then(res => {
        console.log(res, "商品联动列表");
        if (res.data.code == 200) {
          this.goodsArr = res.data.list ? res.data.list : [];
        }
      });
      if (!n) {
        this.form.goodsid = "";
      }
    },
    //封装重置事件
    reset() {
      this.form = {
        title: "", //限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: 1 //状态1正常2禁用
      };
      this.timer = "";
    },
    //点击取消修改父组件弹框事件
    cancel() {
      this.$emit("cancel", false);
      //调用重置
      this.reset();
    },
    //调取行动
    ...mapActions({
      getCateListAction: "cate/getCateListAction",
      getSeckListAction: "seck/getSeckListAction"
    }),
    //添加事件
    add() {
      //调取添加接口
      this.form.begintime = new Date(this.timer[0]).getTime();
      this.form.endtime = new Date(this.timer[0]).getTime();
      getSeckAdd(this.form).then(res => {
        if (res.data.code == 200) {
          this.getSeckListAction();
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //封装一个查看一条数据的方法
    look(id) {
      //调取查看接口
      getSeckInfo({ id }).then(res => {
        console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.id = id;
          //针对于时间进行转化
          this.timer = [
            new Date(parseFloat(this.form.begintime)),
            new Date(parseFloat(this.form.endtime))
          ];
          //重新调取一级分类 和 商品
          this.changeCate(true);
          this.changeGoods(true);
        }
      });
    },
    //编辑确定事件
    update() {
      //调取添加接口
      getSeckEdit(this.form).then(res => {
        if (res.data.code == 200) {
          this.getSeckListAction();
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
