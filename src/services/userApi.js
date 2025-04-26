import axios from 'axios';

const BASE_URL = process.env.VUE_APP_API_URL;
const API_URL = BASE_URL + '/users';

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

    /**
     * 
     * @param {Object} form - 수정할 정보를 담은 객체
     * @returns {Promise} - 수정된 사용자 정보
     */
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