import axios from 'axios';

const API_URL = 'http://localhost:8080/cars';

const apiClient = axios.create({
    baseURL: API_URL
});

// 요청 인터셉터
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 응답 인터셉터
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // 토큰 제거
            localStorage.removeItem('accessToken');
            
            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';
            
            // 알림
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        }
        return Promise.reject(error);
    }
);

export default {
    getCarList() {
        return apiClient.get('');
    },
    
    registerCar(registerCarData) {
        return apiClient.post('', registerCarData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    registerCarDummy(registerCarDummyData) {
        return apiClient.post('/dummy', registerCarDummyData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    getCarDetailByListingId(listingId) {
        return apiClient.get(`/${listingId}`);
    }
}