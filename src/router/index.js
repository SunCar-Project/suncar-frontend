// 라우팅 정의
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Home from '../views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: () => import('../views/SignUp.vue')
    },
    {
        path: '/mypage',
        name: 'MyPage',
        component: () => import('../views/MyPage.vue'),
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 라우터 가드
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    
    // 인증이 필요한 페이지인지 확인 ( 부모자식 라우터를 전부 검사 )
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    if (requiresAuth) {
      // 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
      if (!authStore.isLoggedIn) {
        next({
          path: '/login',
          query: { redirect: to.fullPath } // 로그인 후 돌아올 페이지 저장
        });
      } 
      // 로그인은 되어 있지만 사용자 정보가 없는 경우
      else if (!authStore.user) {
        await authStore.loadUser();
        next();
      }
      // 로그인도 되어 있고 사용자 정보도 있으면 통과
      else {
        next();
      }
    } 
    // 인증이 필요없는 페이지
    else {
      next();
    }
});

export default router;