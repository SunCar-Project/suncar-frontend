import { defineStore } from 'pinia';
import authApi from '@/services/authApi';
import router from '@/router';

export const useAuthStore = defineStore('auth', {

    // 상태
    state: () => ({
        isLoggedIn: localStorage.getItem('accessToken') ? true : false,
        user: null,
        loading: false,
        error: null
    }),

    // 게터
    getters: {
        isAuthenticated: (state) => state.isLoggedIn && !!state.user,
        userId: (state) => state.user?.userId || '게스트'
    },

    // 액션
    actions: {
        // 로그인 액션
        async login(userId, password) {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await authApi.login(userId, password);
                
                // 액세스 토큰 저장
                localStorage.setItem('accessToken', response.data.data.accessToken);
                
                this.isLoggedIn = true;
                this.user = { userId }; // 응답에 사용자 정보가 포함되어 있다면 그것을 사용
                
                // 안내 메시지
                alert('로그인에 성공하였습니다.');
                
                // 홈페이지로 리다이렉트
                router.push('/');
                
                return response;
            }
            catch (error) {
                this.error = error.response?.data?.message || '로그인에 실패했습니다.';
                console.error(`로그인 실패: ${this.error}`, error);
                throw error;
            }
            finally {
                this.loading = false;
            }
        },
        
        // 로그아웃 액션
        logout() {
            localStorage.removeItem('accessToken');
            this.isLoggedIn = false;
            this.user = null;
            
            alert('성공적으로 로그아웃 되었습니다.');
            router.push('/');
        },
        
        // 인증 상태 체크 (앱 시작 시 호출)
        checkAuth() {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                this.isLoggedIn = false;
                this.user = null;
                return false;
            }
            
            // 토큰이 존재하면 로그인 상태로 설정
            this.isLoggedIn = true;
            
            // 필요한 경우 사용자 정보 가져오기
            // 예: this.loadUser();
            
            return true;
        }
    }
})