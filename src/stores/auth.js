import { defineStore } from "pinia";
import authApi from "@/services/authApi";
import userApi from "@/services/userApi";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: localStorage.getItem("accessToken") ? true : false,
    user: null,
    loading: false,
    error: null, // 사용자에게 표시해줄 에러
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn && !!state.user,
    userId: (state) => state.user?.userId || "게스트",
  },

  actions: {
    /**
     * 로그인합니다.
     */
    async login(userId, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authApi.login(userId, password);

        // 액세스 토큰 저장
        localStorage.setItem("accessToken", response.data.data.accessToken);

        this.isLoggedIn = true;

        // 사용자 정보 로드
        await this.loadUser();

        // 안내 메시지
        alert("로그인에 성공하였습니다.");

        // redirect path가 존재하면 거기로, 아니라면 홈으로 리다이렉트
        const redirectPath = router.currentRoute.value.query.redirect || '/';
        router.push(redirectPath);

        return response;

      } catch (error) {
        this.error = error.response?.data?.message || "로그인에 실패했습니다.";
        console.error(`로그인 실패: ${this.error}`, error);
        throw error;
        
      } finally {
        this.loading = false;
      }
    },

    /**
     * 현재 사용자 정보를 가져옵니다.
     */
    async loadUser() {
      if (!this.isLoggedIn) return;

      this.loading = true;
      this.error = null;
      try {
        const response = await userApi.getCurrentUser();
        this.user = response.data.data;
        return this.user;
      } catch (err) {
        console.error("사용자 정보 로드 실패", err);

        // 토큰이 유효하지 않다면 로그아웃
        if (err.response?.status === 401) {
          this.logout();
        }
        this.error = "사용자 정보를 불러오는데 실패했습니다.";
      } finally {
        this.loading = false;
      }
    },

    /**
     * 로그아웃합니다.
     */
    logout() {
      localStorage.removeItem("accessToken");
      this.isLoggedIn = false;
      this.user = null;

      alert("성공적으로 로그아웃 되었습니다.");
      router.push("/");
    },

    /**
     * 인증 상태를 체크합니다. (앱 시작 시 호출)
     */
    checkAuth() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        this.isLoggedIn = false;
        this.user = null;
        return false;
      }

      // 토큰이 존재하면 로그인 상태로 설정
      this.isLoggedIn = true;
      return true;
    },
  },
});
