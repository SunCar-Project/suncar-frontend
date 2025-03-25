import axios from 'axios';

const API_URL = 'http://localhost:8080/cars'

export default {

    /**
     * 판매중인 차량 정보를 조회합니다.
     * @returns - 판매중인 차량 정보
     */
    getCarList() {
        return axios.get(`${API_URL}`);
    }
}