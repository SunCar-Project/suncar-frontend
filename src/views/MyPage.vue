<template>
    <div class="mypage-container">
        <div class="mypage-card">
            <h1 class="mypage-title">마이페이지</h1>

            <form v-if="user" class="user-info" @submit.prevent="handleSubmit">
                <div class="info-group">
                    <label>아이디</label>
                    <div class="info-value">{{ userId }}</div>
                </div>

                <div class="info-group">
                    <label for="userName">이름</label>
                    <input
                        v-if="isEdit"
                        v-model="editForm.userName"
                        class="info-input"
                        type="text"
                    />
                    <div v-else class="info-value">{{ user.userName }}</div>
                </div>

                <div class="info-group">
                    <label>이메일</label>
                    <div class="info-value">{{ user.email }}</div>
                </div>

                <div class="info-group">
                    <label for="phoneNumber">전화번호</label>
                    <input
                        v-if="isEdit"
                        v-model="editForm.phoneNumber"
                        class="info-input"
                        type="text"
                    />

                    <div v-else class="info-value">{{ user.phoneNumber }}</div>
                </div>

                <div class="info-group">
                    <label>회원유형</label>
                    <div class="info-value">{{ user.role }}</div>
                </div>

                <div class="mypage-footer">
                    <button
                        v-if="isEdit"
                        type="submit"
                        id="save-profile-button"
                    >
                        수정완료
                    </button>
                    <button
                        v-else
                        type="button"
                        id="edit-profile-button"
                        @click="startEdit"
                    >
                        회원정보 수정
                    </button>
                </div>
            </form>

            <!-- 내 차량 목록 보기 버튼 추가 -->
            <div class="car-list-section">
                <button 
                    class="toggle-car-list-button" 
                    @click="toggleCarList"
                >
                    {{ isCarListVisible ? '내 차량 목록 접기' : '내 차량 목록 보기' }}
                </button>
                
                <!-- 접었다 펼칠 수 있는 차량 목록 섹션 -->
                <div v-if="isCarListVisible" class="car-list-wrapper">
                    <div class="carlist-container">
                        <div class="carlist-card">
                            <h2 class="carlist-title">내 판매중인 차량 목록</h2>
                            
                            <div v-if="loading" class="loading-message">로딩 중...</div>
                            
                            <div v-else-if="error" class="error-message">
                                {{ error }}
                            </div>
                            
                            <div v-else-if="myCars.length === 0" class="no-cars-message">
                                판매중인 차량이 없습니다.
                            </div>
                            
                            <div v-else class="car-grid">
                                <div
                                    v-for="car in myCars"
                                    :key="car.carListingId"
                                    class="car-item"
                                    @click="goToCarDetail(car.carListingId)"
                                >
                                    <div class="car-image">
                                        <img :src="car.mainImageUrl" alt="차량 이미지">
                                    </div>
                                    <div class="car-details">
                                        <h3 class="car-name">{{ car.brandName }} {{ car.carName }}</h3>
                                        <p class="car-price">{{ formatPrice(car.price) }}</p>
                                        <div class="car-info">
                                            <p>연료: {{ car.fuelType }}</p>
                                            <p>연식: {{ car.year }}년 {{ car.month }}월</p>
                                            <p>주행거리: {{ car.distance }}km</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import userApi from "@/services/userApi";
import carApi from '@/services/carApi';
import formatKoreanPrice from '@/utils/formatters';

const authStore = useAuthStore();
const router = useRouter();
const isEdit = ref(false);
const editForm = ref({
    userName: '',
    phoneNumber: ''
});

// 차량 목록 관련 상태
const isCarListVisible = ref(false);
const myCars = ref([]);
const loading = ref(false);
const error = ref(null);
const formatPrice = formatKoreanPrice;

// 마이페이지 진입 시 사용자 정보가 없다면 api 호출해서 가져온다
onMounted(async () => {
    if (authStore.isLoggedIn && !authStore.user) {
        await authStore.loadUser();
    }
    
    // 페이지 로드 시 내 차량 데이터를 미리 로드해둠
    await loadMyCarList();
});

/**
 * computed를 사용하는 이유
 * 1. authStore.user가 변경될 때마다 자동으로 컴포넌트 업데이트 ( 값 복사가 아님, 참조하게 함 )
 * 2. authStore.user가 변경되지 않았다면, 여러 번 접근해도 캐시된 값을 반환함.
 * -> 한번 사용할 데이터는 computed 안붙이기
 * -> 화면에 지속에서 업데이트 되어야 하는 데이터는 computed 붙이기
 */
const user = computed(() => authStore.user);
const userId = computed(() => authStore.userId); // 사용자 id OR 게스트

// 수정 모드
const startEdit = () => {
    // 기존 값으로 폼 초기화
    editForm.value.userName = user.value.userName;
    editForm.value.phoneNumber = user.value.phoneNumber;
    isEdit.value = true;
}

// 수정사항 제출
const handleSubmit = async () => {
    try {
        // 사용자 정보 업데이트 api 호출
        await userApi.updateCurrentUser(editForm.value);

        // 사용자 정보 재로드
        await authStore.loadUser();

        // 수정 모드 종료
        isEdit.value = false;

        alert('회원정보가 성공적으로 수정되었습니다.');
    }
    catch (err) {
        console.error('회원정보 수정 실패:', err);
        alert('회원정보 수정에 실패했습니다.');
    }
}

// 차량 목록 토글
const toggleCarList = () => {
    isCarListVisible.value = !isCarListVisible.value;
}

// 내 차량 목록 불러오기
const loadMyCarList = async () => {
    if (!authStore.isLoggedIn) return;

    loading.value = true;
    error.value = null;

    try {
        // 내 차량 목록 API 호출 - /me 엔드포인트 사용
        const response = await carApi.getMyCarList();
        myCars.value = response.data.data;
    } catch (err) {
        console.error('내 차량 목록 조회 실패:', err);
        error.value = err.message || '차량 목록을 불러오지 못했습니다.';
    } finally {
        loading.value = false;
    }
}

// 차량 상세 페이지로 이동
const goToCarDetail = (carListingId) => {
    router.push({
        name: 'CarDetail',
        params: { listingId: carListingId }
    });
}
</script>

<style>
.mypage-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
}

.mypage-card {
    width: 100%;
    max-width: 800px;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: white;
}

.mypage-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
}

.info-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-group label {
    font-weight: 500;
    color: #333;
}

.info-value {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    background-color: #f9f9f9;
}

.no-user-message {
    text-align: center;
    color: #e74c3c;
    padding: 20px;
    font-size: 1rem;
}

.mypage-footer {
    margin-top: 20px;
    text-align: center;
    font-size: 0.9rem;
}

.mypage-footer a {
    color: #86e4ad;
    text-decoration: none;
    font-weight: 500;
}

.mypage-footer a:hover {
    text-decoration: underline;
}

#edit-profile-button, .toggle-car-list-button {
    padding: 10px 20px;
    background-color: #86e4ad;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    display: inline-block;
}

#edit-profile-button:hover, .toggle-car-list-button:hover {
    background-color: #6dbb8a;
}

.info-input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
}

#save-profile-button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    display: inline-block;
}

#save-profile-button:hover {
    background-color: #45a049;
}

/* 차량 목록 관련 스타일 */
.car-list-section {
    margin-top: 30px;
    text-align: center;
}

.toggle-car-list-button {
    margin: 0 auto;
    display: block;
}

.car-list-wrapper {
    margin-top: 20px;
    transition: all 0.3s ease;
}

.carlist-container {
    padding: 0;
    min-height: auto;
}

.carlist-card {
    width: 100%;
    max-width: 100%;
    padding: 20px;
    box-shadow: none;
    border: 1px solid #eee;
}

.carlist-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
}

.car-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.car-item {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    background-color: white;
    cursor: pointer;
}

.car-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.car-image img {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.car-details {
    padding: 15px;
}

.car-name {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    color: #333;
}

.car-price {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.car-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-bottom: 10px;
}

.car-info p {
    margin: 0;
    font-size: 0.85rem;
    color: #555;
}

.loading-message {
    text-align: center;
    padding: 20px;
    font-size: 1rem;
    color: #666;
}

.error-message {
    color: #e74c3c;
    text-align: center;
    padding: 20px;
    font-size: 0.9rem;
}

.no-cars-message {
    text-align: center;
    padding: 20px;
    font-size: 1rem;
    color: #666;
}
</style>