import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'

export default {

     /**
     * 로그인 요청을 보냅니다.
     * @param {string} userId - 사용자 아이디
     * @param {string} password - 사용자 비밀번호
     * 
     * @returns {Promise} 로그인 결과를 담은 Promise 객체
     */
    login(userId, password) {
        return axios.post(`${API_URL}/login`, { userId, password });
    },

    /**
     * 회원가입 요청을 보냅니다.
     * @param {Object} userData - 사용자 데이터
     * 
     * @param {string} userData.userId - 사용자 아이디
     * @param {string} userData.email - 사용자 이메일
     * @param {string} userData.username - 사용자 이름
     * @param {string} userData.password - 사용자 비밀번호
     * @param {string} userData.phoneNumber - 사용자 전화번호
     * @param {string} userData.role - 사용자 권한
     * 
     * @returns {Promise} 회원가입 결과를 담은 Promise 객체
     */
    signup(userData) {
        return axios.post(`${API_URL}/signup`, userData);
    }
};