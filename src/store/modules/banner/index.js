//引入封装好的接口
import {getBannerList} from '../../../util/axios'

//state
const state = {
    bannerList:[]
}

//getters
const getters = {
    //封装了一个state中菜单列表
    getBannerList(state){
        return state.bannerList
    }
}

//mutations
const mutations = {
    //去修改state中菜单列表
    REQ_BANNERLIST(state,payload){
        state.bannerList = payload
    }
}

//actions
const actions = {
    //获取菜单列表
    getBannerListAction({commit}){
        getBannerList()
        .then(res=>{
            console.log(res,'响应')
            if(res.data.code==200){
                //提交一个mutation以及携带参数，参数就是返回的数据
                commit("REQ_BANNERLIST",res.data.list)
            }
        })
        .catch(err=>{
            console.log(err,'错误响应')
        })
    }
}


//默认导出所有的内容
export default {
    state,
    getters,
    mutations,
    actions,
    //命名空间
    namespaced:true
}