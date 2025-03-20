<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Footer from './components/layout/Footer.vue';
import Header from './components/layout/Header.vue';
import { useAuthStore } from '@/stores/auth.js';

export default {
  name: 'App',
  components: {
    Header: Header,
    Footer: Footer
  },

  setup() {
    const authStore = useAuthStore();

    // 앱 시작 시 인증 상태 확인
    authStore.checkAuth();

    return {};
  }

};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
}

.main-content {
  min-height: calc(100vh - 300px);
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
