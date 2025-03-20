<template>
    <header class="header">
        <div class="logo">
            <router-link to="/">SunCar</router-link>
        </div>
        <nav class="nav">
            <ul>
                <li><router-link to="/">홈</router-link></li>
                <li><router-link to="/about">소개</router-link></li>
                <li><router-link to="/services">서비스</router-link></li>
                <li><router-link to="/contact">연락처</router-link></li>
                <li v-if="authStore && authStore.isLoggedIn"><a href="#" @click.prevent="logout">로그아웃</a></li>
                <li v-else><router-link to="/login">로그인</router-link></li>
            </ul>
        </nav>
    </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth.js';

export default {
    name: 'HeaderComponent',

    setup() {
        const authStore = useAuthStore();
        
        // 컴포넌트가 마운트될 때 인증 상태 확인
        authStore.checkAuth();
        
        const logout = () => {
            authStore.logout();
        };
        
        return {
            authStore,
            logout
        };
    }
};
</script>
<style>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    border-bottom: 1px solid #ddd
}

.logo a {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
}

.nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav li {
    margin-left: 2rem;
}

.nav a {
    color: #2c3e50;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
}

.nav a:hover,
.nav a.router-link-active {
    color: #000;
    font-weight: 900;
}
</style>