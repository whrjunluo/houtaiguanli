import {
  getRoleList
} from '../../../util/axios'

// 封装模块的所有核心属性
const state = {
  roleList: []
}

const getters = {
  getRoleList(state) {
    return state.roleList
  }
}

const mutations = {
  REQ_ROLELIST(state, payload) {
    state.roleList = payload
  }
}

const actions = {
  // 获取角色列表的行动
  getRoleListAction({
    commit
  }) {
    getRoleList().then(res => {
      console.log(res, '角色列表');
      if (res.data.code == 200) {
        commit('REQ_ROLELIST', res.data.list)
      }
    }).catch(err => {
      console.log(err, '错误信息');
    })
  }
}

// 导出

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
