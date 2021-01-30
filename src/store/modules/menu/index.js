//引入接口文件
import {
  getMenuList
} from '../../../util/axios'
//创建一个 模块 state
const state = {
  menuList: []
}

//创建一个 模块 getters
const getters = {
  getMenuList(state) {
    return state.menuList
  }
}
//创建一个 模块 mutations
const mutations = {
  //获取菜单列表
  REQ_MENULIST(state, padload) {
    state.menuList = padload
  }
}

//创建一个 模块 action
const actions = {
  //封装一个获取菜单列表的行动
  getMenuListAction({
    commit
  }) {
    getMenuList()
      .then(res => {
        if (res.data.code === 200) {
          //提交一个mutations
          commit('REQ_MENULIST', res.data.list)
        }
        console.log(res, '菜单列表');
      })
  }
}

//导出创建好的这些属性
export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
