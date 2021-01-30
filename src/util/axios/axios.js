import axios from 'axios'
//引入路由配置项
import router from '../../router'

let http = axios.create({
  baseURL: '/api'
})


// axios拦截器
// 请求拦截
http.interceptors.request.use(req => {
  console.log(req, '请求拦截');
  // 从存储中取出来token
  let token = sessionStorage.getItem('loginInfo') ? JSON.parse(sessionStorage.getItem('loginInfo')).token : ''
  // 需求：在请求头中添加token令牌
  req.headers.authorization = token
  //设置请求拦截之后，要返回值这个配置
  return req
})

// 响应拦截
http.interceptors.response.use(res => {
  console.log(res, "响应拦截");
  if (res.data.code === 500) {
    alert(res.data.msg)
    // console.log(router,'路由配置项');
    router.push('/login')
  } else if (res.data.code === 403) {
    //token验证过期，重新登录
    alert(res.data.msg)
    router.push('/login')
  } else {

    return res
  }
})
export default http
