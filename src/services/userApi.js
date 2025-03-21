import axios from 'axios';

const API_URL = 'http://localhost:8080/users'

export default {

    /**
    * 현재 로그인한 사용자 정보를 조회합니다.
    * @returns {Promise} - 사용자 정보 조회 결과
    */
    getCurrentUser() {
        return axios.get(`${API_URL}/me`, {
            // config
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });
    },

    updateCurrentUser(form) {
        return axios.patch(`${API_URL}/me`,
            {
                // data
                "userName": form.userName,
                "phoneNumber": form.phoneNumber
            },
            {
                // config
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        );
    }
}