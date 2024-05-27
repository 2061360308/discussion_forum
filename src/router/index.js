import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DiscussionView from '../views/DiscussionView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      keepAlive: true,
    },
    component: HomeView
  },
  {
    path: '/discussion/:id',
    name: 'discussion',
    component: DiscussionView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
