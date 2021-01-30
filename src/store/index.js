import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)
//引入menu模块
import menu from './modules/menu'
// 引用角色模块
import role from './modules/role'
// 引用管理员模块
import member from './modules/member'
//引入分类模块
import cate from './modules/classify'

// 导入规格模块
import specs from './modules/specs'

// 导入商品管理模块
import goods from './modules/goods'

// 导入轮播图管理模块
import banner from './modules/banner'

// 导入秒杀管理模块
import seck from './modules/seck'
// console.log(role, '角色模块');
export default new Vuex.Store({
  state: {
    loginInfo: sessionStorage.getItem('loginInfo') ? JSON.parse(sessionStorage.getItem('loginInfo')) : null //个人信息
  },
  getters: {
    getUserInfo(state) {
      return state.loginInfo
    }
  },
  mutations: {
    CHANGE_USER(state, payload) {
      state.loginInfo = payload
      if (payload) {
        //设置本地存储
        sessionStorage.setItem('loginInfo', JSON.stringify(payload))
      } else {
        sessionStorage.removeItem('loginInfo')
      }
    }
  },
  //actionsstate
  actions: {
    changeUserInfoAction(context, payload) {
      console.log(context, "上下文");
      console.log(payload, "载荷");
      context.commit('CHANGE_USER', payload)
    }
  },
  modules: {
    menu,
    role,
    member,
    cate,
    specs,
    goods,
    banner,
    seck
  }
})
