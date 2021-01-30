//引入接口文件
import {getCateList} from '../../../util/axios'
//创建一个 模块 state
const state = {
    cateList:[]
}
//创建一个 模块 getters
const getters ={
    getCateList(state){
        return state.cateList
    }
}
//创建一个 模块 mutations
const mutations ={
    //获取分类列表
    REQ_CATELIST(state,padload){
        state.cateList= padload
    }
}
//创建一个 模块 action
const actions = {
    //封装一个获取分类列表的行动
    getCateListAction({commit}){
        getCateList()
        .then(res=>{
            console.log(res,'分类列表');
            if(res.data.code===200){
                //提交一个mutations
                commit('REQ_CATELIST',res.data.list)
            }
        })
    }
}

//导出创建好的这些属性
export default {
    state,
    getters,
    mutations,
    actions,
    namespaced:true
}
