<template>
    <div>
        <!-- 面包屑 -->
        <el-bread></el-bread>
        <!-- 添加按钮 -->
        <el-button @click="toOpen" type='primary' plain size='small'>添加</el-button>
        <!-- 数据展示 -->
        <v-table @edit='edit'></v-table>
        <!-- 弹框渲染 -->
        <v-add ref="vDialog" :addInfo='addInfo' @cancel ='cancel'></v-add>
    </div>
</template>

<script>
//引入table组件
import vTable from './list'
//引入弹框
import vAdd from './addInfo'
export default {
    data() {
        return {
            addInfo:{
                isShow:false,//用于控制子组件弹框的显示隐藏
                isAdd:true,//是否是添加还是编辑
            }
        };
    },
    components:{
        vTable,
        vAdd
    },
    methods: {
        //打开添加弹框事件
        toOpen(){
            //打开弹框
            this.addInfo.isShow = true 
            //你是一个添加
            this.addInfo.isAdd =true
        },
        //封装一个改变isShow状态的自定义事件
        cancel(e){
            this.addInfo = e
        },
        //封装一个编辑事件
        edit(e){
            console.log(e,"id吗");
            //打开编辑弹框
            this.addInfo.isShow =true
            //你是一个编辑
            this.addInfo.isAdd =false
            //调用查询方法
            this.$refs.vDialog.lookInfo(e)
        }
    },
};
</script>

<style  lang="" scoped>

</style>
