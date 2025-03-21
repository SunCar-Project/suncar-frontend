// 라우팅 정의
import { createRouter, createWebHistory } from 'vue-router';
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
        component: () => import('../views/MyPage.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;