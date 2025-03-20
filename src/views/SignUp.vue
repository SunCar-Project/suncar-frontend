<template>
    <div class="signup-container">
        <div class="signup-card">
            <h1 class="signup-title">회원가입</h1>

            <form @submit.prevent="handleSignup" class="signup-form">
                <div class="form-group">
                    <label for="user-id">아이디</label>
                    <input type="text" id="user-id" v-model="userId" placeholder="ex) abcd1234" required>
                </div>

                <div class="form-group">
                    <label for="email">이메일</label>
                    <input type="email" id="email" v-model="email" placeholder="ex) abcd1234@gmail.com" required>
                </div>

                <div class="form-group">
                    <label for="username">이름</label>
                    <input type="text" id="username" v-model="username" placeholder="ex) 홍길동" required>
                </div>

                <div class="form-group">
                    <label for="user-password">비밀번호</label>
                    <input type="password" id="user-password" v-model="password" placeholder="비밀번호를 입력하세요" required>
                </div>

                <div class="form-group">
                    <label for="phone-number">전화번호</label>
                    <input type="tel" id="phone-number" v-model="phoneNumber" placeholder="ex) 01012345678" required>
                </div>

                <div v-if="error" class="error-message">
                    {{ error }}
                </div>

                <button type="submit" class="signup-button" :disabled="isLoading">
                    {{ isLoading ? '가입 중...' : '회원가입' }}
                </button>
            </form>
            <div class="signup-footer">
                <p>
                    이미 계정이 있으신가요?&nbsp;
                    <router-link id="login-button" to="/login">
                        로그인
                    </router-link>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authApi from '@/services/authApi';

export default {
    name: 'SignUpComponent',

    setup() {
        const router = useRouter();

        
        /**
         * 폼 입력 필드
         * 
         * TODO
         * 추후 딜러 회원가입 시 role 추가 필요
         */
        const userId = ref('');
        const email = ref('');
        const username = ref('');
        const password = ref('');
        const phoneNumber = ref('');

        // 상태 관리
        const isLoading = ref(false);
        const error = ref('');

        const handleSignup = async() => {
            isLoading.value = true;
            error.value = '';

            try {
                // 회원가입 API 호출
                await authApi.signup({
                    userId: userId.value,
                    email: email.value,
                    username: username.value,
                    password: password.value,
                    phoneNumber: phoneNumber.value,
                    role: '회원'
                });

                alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
                router.push('/login');
            }
            catch (err) {
                error.value = err.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
                console.error('회원가입 오류:', err);
            }
            finally {
                isLoading.value = false;
            }
        };

        return {
            userId,
            email,
            username,
            password,
            phoneNumber,
            isLoading,
            error,
            handleSignup
        };
    }
};
</script>
<style>
    .signup-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 20px;
    }

    .signup-card {
        width: 100%;
        max-width: 400px;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        background-color: white;
    }

    .signup-title {
        text-align: center;
        margin-bottom: 30px;
        color: #333;
    }

    .signup-form {
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

    .error-message {
        color: #e74c3c;
        font-size: 0.9rem;
    }

    .signup-button {
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

    .signup-button:hover {
        background-color: #6dbb8a;
    }

    .signup-button:disabled {
        background-color: #b8e4cb;
        cursor: not-allowed;
    }

    .signup-footer {
        margin-top: 20px;
        text-align: center;
        font-size: 0.9rem;
    }

    .signup-footer a {
        color: #86e4ad;
        text-decoration: none;
        font-weight: 500;
    }

    .signup-footer a:hover {
        text-decoration: underline;
    }

    #login-button {
        font-weight: 600;
    }
</style>