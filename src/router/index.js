import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Message from '../views/Message.vue'
import TypeManage from '../views/TypeManage.vue'
import BookForm from '../views/BookForm.vue'
import Login from '../views/Login.vue'
import Comments from '../views/Comments.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    children: [
      { path: '/Message', component: Message },
      { path: '/Comments', component: Comments },
      { path: '/TypeManage', component: TypeManage },
      { path: '/BookForm', component: BookForm },
      { path: '/Message', component: Message }
      // { path: '/About', component: () => import('../views/About') },
    ]
  }
]

const router = new VueRouter({
  routes
})

// 防止重复访问出错
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
