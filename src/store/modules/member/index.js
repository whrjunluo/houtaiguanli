//引入接口文件
import {
  getUserList,
  userCount
} from '../../../util/axios'
//创建一个 模块 state
const state = {
  userList: [],
  size: 2, // 条数
  page: 1, // 页码
  countNum: 0 //种条数
}

//创建一个 模块 getters
const getters = {
  getUserList(state) {
    return state.userList
  },
  //条数，当前页面渲染个数
  getMangeSize(state) {
    return state.size
  },
  //总条数
  getCountNum(state) {
    return state.countNum
  }
}
//创建一个 模块 mutations
const mutations = {
  //获取菜单列表
  REQ_USERLIST(state, padload) {
    state.userList = padload
  },
  //总条数
  REQ_COUNT(state, payload) {
    state.countNum = payload
  },
  //修改页码
  CHANGE_PAGE(state, payload) {
    state.page = payload
  }
}

//创建一个 模块 action
const actions = {
  //封装一个获取菜单列表的行动
  getUserListAction(payload) {
    console.log(payload, '上下文');
    getUserList({
        size: payload.state.size,
        page: payload.state.page,
      })
      .then(res => {
        if (res.data.code === 200) {
          //如果返回值是null 转化成[]
          console.log(res, "返回值");
          let list = res.data.list ? res.data.list : []
          //提交一个mutation去修改state中的mangerList
          payload.commit('REQ_USERLIST', list)
          //如果你的返回数据是一个[]数组并且它不是第一页，那么我们就应该给page-1并且重新调取列表
          if (payload.state.page != 1 && list.length == 0) {
            console.log('进入到重新修改page');
            //先修改page
            payload.dispatch('changePageAction', payload.state.page - 1)
            return
          }
        }

      })
  },
  //封装一个获取总条数的行动
  getCountAction(payload) {
    userCount()
      .then(res => {
        console.log(res, '总条数啊啊啊啊啊');
        if (res.data.code === 200) {
          payload.commit('REQ_COUNT', res.data.list[0].total)
        }
      })
  },
  //封装一个修改page行动
  changePageAction(context, payload) {
    //触发mutaitons去修改state中的page
    //context 上下文对象，含有 commit方法
    //payload 触发该行动传递的参数
    context.commit('CHANGE_PAGE', payload)
    // console.log(context,'contextcontextcontext');
    // console.log(payload,'payloadpayloadpayloadpayload');
    //当页码切换之后，重新调取接口并传入新的参数
    context.dispatch('getUserListAction')
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
