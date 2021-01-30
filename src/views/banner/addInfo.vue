<template>
  <div>
    <el-dialog
      :title="addInfo.isAdd ? '添加轮播图' : '编辑轮播图'"
      :visible.sync="addInfo.isShow"
      center
      :before-close="cancel"
    >
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item
          prop="title"
          label="标题"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="onPreview"
            :on-remove="onRemove"
            :auto-upload="false"
            :on-change="onChange"
            :file-list="fileList"
            :limit='1'
            :on-exceed='onExceed'	
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <!-- 可以使用active-color属性与inactive-color属性来设置开关的背景色。 -->
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
        <el-button
          v-if="addInfo.isAdd"
          @click="add('formDialog')"
          type="primary"
          >添 加</el-button
        >
        <el-button v-else @click="update('formDialog')" type="primary"
          >编 辑</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入封装好的接口
import { getBannerAdd, getBannerInfo, getBannerEdit } from "../../util/axios";
//引入辅助性函数
import { mapActions } from "vuex";
export default {
  data() {
    return {
      form: {
        title: "", //轮播图标题
        img: "", //图片(文件，一般用于二级分类)
        status: 1 //状态1正常2禁用
      },
      rules: {
        title: [
          { required: true, message: "请输入轮播图标题", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
      },
      formLabelWidth: "120px",
      dialogImageUrl: "", //预览图片地址
      dialogVisible: false, //预览图片的弹框
      imgUrl: "", //用来接收图片信息
      fileList: [] //文件上传列表
    };
  },
  props: ["addInfo"],
  methods: {
    //onChange 当图片上传时触发的文件
    onChange(file) {
      console.log(file, "wenjian");
      this.imgUrl = file.raw;
    },
    //图片预览
    onPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片移除
    onRemove(file, fileList) {},
    //文件上传限制
    onExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    //封装一个重置事件
    reset() {
      this.form = {
        title: "", //轮播图标题
        img: "", //图片(文件，一般用于二级分类)
        status: 1 //状态1正常2禁用
      };
      this.fileList= []
    },
    ...mapActions({
      getBannerList: "banner/getBannerListAction"
    }),
    //取消事件，关闭弹框，修改父组件数据
    cancel() {
      this.$emit("cancel", false);
      //调用重置函数
      this.reset();
    },
    //查看一条事件
    look(id) {
      // console.log(id,'形参')
      //调取查看列表
      getBannerInfo({ id }).then(res => {
        // console.log(res,'一条数据')
        if (res.data.code == 200) {
          this.form = res.data.list;
          //当前表单没有id 创建一个id，给确定提交用
          this.form.id = id;
          //把图片格式进行转化
          this.fileList = this.form.img
            ? [{ url: `${this.$imgUrl}${this.form.img}` }]
            : [];
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //确定修改事件
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //修改逻辑
          //调取修改接口
          //把数据修改成formData形式
          let data = this.form;
          let file = new FormData();
          for (let i in data) {
            file.append(i, data[i]);
          }
          //如果你新传了图片 this.imgUrl就有值。就赋值给this.imgUrl。如果没有新添加的图片就用上一次的图片
          this.imgUrl = this.imgUrl ? this.imgUrl : this.form.img;
          file.append("img", this.imgUrl);
          getBannerEdit(file).then(res => {
            console.log(res, "修改响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框
              this.cancel();
              //重新获取列表
              this.getBannerList();
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
    add(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //添加逻辑
          console.log(this.form, "表单提交");
          //我们的参数不能用form表单，我们要FormData对象形式
          //把普通表单改成FormData
          let data = this.form;
          let file = new FormData();
          //必须通过append 去添加它的属性
          for (let i in data) {
            file.append(i, data[i]);
          }
          //添加img参数
          file.append("img", this.imgUrl);
          //直接打印FormData不好用，要用get去取值
          //console.log(file.get('catename'),'文件')

          //调取添加接口
          getBannerAdd(file).then(res => {
            console.log(res, "添加响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框
              this.cancel();
              //重新获取列表
              this.getBannerList();
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
  }
};
</script>

<style lang="" scoped></style>
