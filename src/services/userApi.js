import axios from 'axios';

const API_URL = 'http://localhost:8080/users'

export default {

    /**
    * 현재 로그인한 사용자 정보를 조회합니다.
    * @returns {Promise} - 사용자 정보 조회 결과
    */
    getCurrentUser() {
        return axios.get(`${API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    }
}