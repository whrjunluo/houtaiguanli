<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加分类' : '编辑分类'"
      center
      :visible.sync="addInfo.isShow"
      :before-close="cancel"
    >
      <el-form :model="cateForm" :rules="rules" ref="ruleForm">
        <el-form-item
          label="上级分类："
          prop="pid"
          :label-width="formLabelWidth"
        >
          <el-select v-model="cateForm.pid" placeholder="请选择">
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option
              v-for="item in getCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="分类名称："
          prop="catename"
          :label-width="formLabelWidth"
        >
          <el-input v-model="cateForm.catename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          v-if="cateForm.pid != 0"
          label="图片"
          :label-width="formLabelWidth"
        >
          
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="onChange"
            :file-list="fileList"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 预览展示 -->
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="状态：" :label-width="formLabelWidth">
          <el-switch
            v-model="cateForm.status"
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
        <el-button v-if="addInfo.isAdd" @click="add('ruleForm')" type="primary"
          >确 定</el-button
        >
        <el-button v-else @click="update('ruleForm')" type="primary"
          >编辑</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入接口文档
import { getCateAdd, getCateInfo, getCateEdit } from "../../util/axios";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      //分类添加表单
      cateForm: {
        pid: 0, //上级分类编号 int型
        catename: "", //商品分类名称
        img: "", //图片(文件，一般用于二级分类)
        status: 1 //状态1正常2禁用
      },
      rules: {
        catename: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2到 8 个字符", trigger: "blur" }
        ],
        pid: [{ required: true, message: "请选择上级分类", trigger: "change" }]
      },
      formLabelWidth: "120px", //label宽度
      dialogImageUrl: "", //预览图片地址
      dialogVisible: false, //预览的弹框默认是false
      imgUrl: "", //文件图片的配置对象
      fileList: [] //文件列表
    };
  },
  computed: {
    ...mapGetters({
      getCateList: "cate/getCateList"
    })
  },
  methods: {
    //文件上传的限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    //当文件改变时，触发的函数方法
    onChange(file) {
      console.log(file, "文件的属性配置");
      this.imgUrl = file.raw;
    },
    //预览时的删除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //方法预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    ...mapActions({
      getCateListAction: "cate/getCateListAction"
    }),
    //取消去改变父组件的数据
    cancel() {
      //关闭弹框！！！！
      this.$emit("cancel", {
        isShow: false,
        isAdd: this.addInfo.isAdd
      });
      this.reset();
    },
    //封装重置函数
    reset() {
      this.cateForm = {
        pid: 0, //上级分类编号 int型
        catename: "", //商品分类名称
        img: "", //图片(文件，一般用于二级分类)
        status: 1 //状态1正常2禁用
      };
    },
    //封装一个查看一条数据事件
    lookUp(id) {
      //调取查看一条数据接口
      getCateInfo({
        id
      }).then(res => {
        if (res.data.code == 200) {
          this.cateForm = res.data.list;
          this.cateForm.id = id;
          //当查询数据调取接口，给fileList数组赋值
          this.fileList = this.cateForm.img
            ? [{ url: this.$imgUrl + this.cateForm.img }]
            : "";
        }
      });
    },

    
    //封装修改分类事件
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          
          this.cateForm.img = this.imgUrl ? this.imgUrl : this.cateForm.img;
          //对于有上传文件的数据，我们要用构造函数FormData去转化
          let file = new FormData();
          //FormData 数据的添加只能用append ,获取值也只能用ge t方式获取
          //循环添加 对象 转化成了 FormData这种格式
          for (let i in this.cateForm) {
            file.append(i, this.cateForm[i]);
          }
          getCateEdit(file).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //成功之后关闭弹框以及重置
              this.cancel();
              //重新调取接口列表
              this.getCateListAction();
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
    //封装添加分类事件
    add(formName) {
      console.log(this.cateForm, "表单体");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.cateForm.img = this.imgUrl;
         
          getCateAdd(this.cateForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //成功之后关闭弹框以及重置
              this.cancel();
              //重新调取接口列表
              this.getCateListAction();
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
    
  },
  props: ["addInfo"]
};
</script>

<style lang="" scoped></style>
