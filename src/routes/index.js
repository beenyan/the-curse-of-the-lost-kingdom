import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';
import axios from 'axios';

const routes = [
  {
    path: '/',
    component: () => import('../views/loginVue.vue'),
    meta: { title: '登入系統' },
  },
  {
    path: '/manage',
    component: () => import('../views/manageHub.vue'),
    meta: { title: '後臺管理系統' },
  },
  {
    path: '/manage/user',
    component: () => import('../views/userManagement.vue'),
    meta: { title: '人員管理' },
  },
  {
    path: '/manage/team',
    component: () => import('../views/teamManaegment.vue'),
    meta: { title: '隊伍管理' },
  },
  {
    path: '/manage/progress',
    component: () => import('../views/progressManaegment.vue'),
    meta: { title: '進度統整' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  let isAuth = null;
  await axios('/login', { timeout: 300 })
    .then((res) => {
      isAuth = res.data;
    })
    .catch((err) => {
      alert('連線錯誤');
    });
  if (to.path === '/' && isAuth) {
    return '/manage';
  } else if (to.path !== '/' && !isAuth) {
    return '/';
  }
  return true;
});

router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title;
  });
});

export default router;
