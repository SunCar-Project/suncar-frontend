<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">로그인</h1>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="user-id">아이디</label>
          <input type="text" id="user-id" v-model="userId" placeholder="아이디를 입력하세요" required>
        </div>

        <div class="form-group">
          <label for="user-password">비밀번호</label>
          <input
            type="password"
            id="user-password"
            v-model="userPassword"
            placeholder="비밀번호를 입력하세요"
            required
          >
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>


        <button
          type="submit"
          class="login-button"
          :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </form>
      <div class="login-footer">
        <p>
            계정이 없으신가요?&nbsp;
          <router-link id="signup-button" to="/signup">
              회원가입
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoginComponent'
}
</script>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const userId = ref('');
const userPassword = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  await authStore.login(userId.value, userPassword.value);
  isLoading.value = false;
};
</script>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: white;
  }

  .login-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-weight: 500;
    color: #333;
  }

  .form-group input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  .form-group input:focus {
    outline: none;
    border-color: #86e4ad;
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }

  .remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .forgot-link {
    color: #666;
    text-decoration: none;
  }

  .forgot-link:hover {
    text-decoration: underline;
  }

  .login-button {
    padding: 12px;
    background-color: #86e4ad;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .login-button:hover {
    background-color: #6dbb8a;
  }

  .login-button:disabled {
    background-color: #b8e4cb;
    cursor: not-allowed;
  }

  .login-footer {
    margin-top: 20px;
    text-align: center;
    font-size: 0.9rem;
  }

  .login-footer a {
    color: #86e4ad;
    text-decoration: none;
    font-weight: 500;
  }

  .login-footer a:hover {
    text-decoration: underline;
  }

  #signup-button {
    font-weight: 600;
  }
</style>