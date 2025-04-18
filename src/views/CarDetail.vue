<template>
    <div class="car-detail-container">
        <div v-if="loading" class="loading-message">로딩 중...</div>

        <div v-else-if="error" class="error-message">
            {{ error }}
        </div>

        <div v-else class="car-detail-card">
            <div class="car-detail-header">
                <h1 class="car-detail-title">{{ car.brandName }} {{ car.carName }}</h1>
                <p class="car-detail-price">{{ formatPrice(car.price) }}</p>
            </div>

            <div class="car-detail-images">
                <div class="main-image">
                    <img :src="selectedImage" alt="차량 대표 이미지">
                </div>
                <div class="gallery-images">
                    <!-- 메인 이미지를 첫 번째로 표시 -->
                    <div 
                        class="gallery-image" 
                        :class="{ 'active': selectedImage === car.mainImageUrl }"
                        @click="selectedImage = car.mainImageUrl"
                    >
                        <img :src="car.mainImageUrl" alt="차량 대표 이미지">
                    </div>
                    <!-- 추가 이미지들 표시 -->
                    <div 
                        v-for="(imgUrl, index) in car.additionalImageUrls" 
                        :key="`img-${index}`" 
                        class="gallery-image"
                        :class="{ 'active': selectedImage === imgUrl }"
                        @click="selectedImage = imgUrl"
                    >
                        <img :src="imgUrl" :alt="`차량 이미지 ${index + 1}`">
                    </div>
                </div>
            </div>

            <div class="car-detail-info">
                <div class="info-section">
                    <h2>기본 정보</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">브랜드/모델명</span>
                            <span class="info-value">{{ car.brandName }} / {{ car.modelName }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">차량번호</span>
                            <span class="info-value">{{ car.carNumber }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">연식</span>
                            <span class="info-value">{{ car.year }}년 {{ car.month }}월</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">연료</span>
                            <span class="info-value">{{ car.fuelType }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">배기량</span>
                            <span class="info-value">{{ car.displacement }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">차종</span>
                            <span class="info-value">{{ car.bodyShape }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">용도</span>
                            <span class="info-value">{{ car.modelType }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">최초 보험 가입일</span>
                            <span class="info-value">{{ formatDate(car.firstInsuranceDate) }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">차대번호</span>
                            <span class="info-value">{{ car.identificationNumber }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">국산/외제</span>
                            <span class="info-value">{{ car.isForeign ? '외제차' : '국산차' }}</span>
                        </div>
                    </div>
                </div>

                <div class="info-section" v-if="car.mileages && car.mileages.length > 0">
                    <h2>주행 기록</h2>
                    <div class="table-container">
                        <table class="info-table">
                            <thead>
                                <tr>
                                    <th>기록일</th>
                                    <th>주행거리</th>
                                    <th>제공처</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(mileage, index) in car.mileages" :key="`mileage-${index}`">
                                    <td>{{ formatDate(mileage.recordDate) }}</td>
                                    <td>{{ mileage.distance.toLocaleString() }}km</td>
                                    <td>{{ mileage.provider }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="info-section" v-if="car.accidents && car.accidents.length > 0">
                    <h2>사고 이력</h2>
                    <div v-for="(accident, accIndex) in car.accidents" :key="`accident-${accIndex}`"
                        class="accident-item">
                        <div class="accident-header">
                            <p class="accident-date">{{ formatDate(accident.accidentDate) }}</p>
                            <p class="accident-type">{{ accident.accidentType }} ({{ accident.processingType }})</p>
                        </div>
                        <div class="table-container" v-if="accident.repairs && accident.repairs.length > 0">
                            <table class="info-table">
                                <thead>
                                    <tr>
                                        <th>사고유형</th>
                                        <th>총 수리비용</th>
                                        <th>부품비</th>
                                        <th>공임비</th>
                                        <th>도장비</th>
                                        <th>보험처리금액</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(repair, repIndex) in accident.repairs"
                                        :key="`repair-${accIndex}-${repIndex}`">
                                        <td>{{ repair.accidType }}</td>
                                        <td>{{ repair.totalAmount }}</td>
                                        <td>{{ formatPrice(repair.partsCost) }}</td>
                                        <td>{{ formatPrice(repair.laborCost) }}</td>
                                        <td>{{ formatPrice(repair.paintingCost) }}</td>
                                        <td>{{ formatPrice(repair.insuranceAmount) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="info-section" v-if="car.options && car.options.length > 0">
                    <h2>옵션 정보</h2>
                    <div class="options-container">
                        <div v-for="(option, index) in car.options" :key="`option-${index}`" class="option-item">
                            <span class="option-name">{{ option.optionName }}</span>
                            <span
                                :class="['option-status', option.installStatus === 'INSTALLED' ? 'installed' : 'not-installed']">
                                {{ option.installStatus === 'INSTALLED' ? '장착' : '미장착' }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="info-section" v-if="car.ownershipChanges && car.ownershipChanges.length > 0">
                    <h2>소유자 변경 이력</h2>
                    <div class="table-container">
                        <table class="info-table">
                            <thead>
                                <tr>
                                    <th>변경일</th>
                                    <th>변경유형</th>
                                    <th>차량번호</th>
                                    <th>사용목적</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(change, index) in car.ownershipChanges" :key="`ownership-${index}`">
                                    <td>{{ formatDate(change.changeDate) }}</td>
                                    <td>{{ change.changeType }}</td>
                                    <td>{{ change.carNumber }}</td>
                                    <td>{{ change.usagePurpose }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="info-section" v-if="car.usage">
                    <h2>차량 이용 이력</h2>
                    <div class="usage-grid">
                        <div class="info-item">
                            <span class="info-label">렌트 이력</span>
                            <span class="info-value">{{ car.usage.rentalHistory }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">영업용 이력</span>
                            <span class="info-value">{{ car.usage.businessHistory }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">관용 이력</span>
                            <span class="info-value">{{ car.usage.governmentHistory }}</span>
                        </div>
                    </div>
                </div>

                <div class="info-section" v-if="car.description">
                    <h2>판매자 코멘트</h2>
                    <p class="car-description">{{ car.description }}</p>
                </div>

                <div class="info-section">
                    <h2>판매자 정보</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">판매자</span>
                            <span class="info-value">{{ car.sellerUserName }}</span>
                        </div>
                    </div>
                </div>

                <div class="car-action-buttons">
                    <div class="left-buttons">
                        <button class="contact-button">판매자와 연락하기</button>
                        <button class="back-button" @click="goBack">목록으로 돌아가기</button>
                    </div>
                    <div class="right-buttons">
                        <button class="edit-button" @click="openEditModal">차량정보 수정</button>
                        <button class="delete-button" @click="confirmDelete">차량 삭제</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 수정 모달 -->
        <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
            <div class="modal-content">
                <h2 class="modal-title">차량 정보 수정</h2>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="price">판매 가격</label>
                        <input 
                            type="number" 
                            id="price" 
                            v-model="editForm.price" 
                            class="modal-input"
                            placeholder="가격을 입력하세요"
                        />
                    </div>
                    <div class="form-group">
                        <label for="description">판매 설명</label>
                        <textarea 
                            id="description" 
                            v-model="editForm.description" 
                            class="modal-textarea"
                            placeholder="차량에 대한 설명을 입력하세요"
                        ></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-button" @click="closeEditModal">취소</button>
                    <button class="confirm-button" @click="updateCarInfo">수정하기</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import carApi from '@/services/carApi';
import formatKoreanPrice from '@/utils/formatters';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const formatPrice = formatKoreanPrice;

const car = ref({});
const loading = ref(true);
const error = ref(null);
const selectedImage = ref(''); // 선택된 이미지 URL

// 수정 관련 상태
const showEditModal = ref(false);
const editForm = ref({
    price: 0,
    description: ''
});

/** 날짜 포맷팅 */
const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/** 차량 상세 정보 가져오기 */
onMounted(async () => {
    const listingId = route.params.listingId;

    if (!listingId) {
        error.value = '차량 정보를 찾을 수 없습니다.';
        loading.value = false;
        return;
    }

    try {
        /** 차량 상세 조회 API 호출 */
        const response = await carApi.getCarDetailByListingId(listingId);
        car.value = response.data.data;
        
        // 메인 이미지를 초기 선택 이미지로 설정
        selectedImage.value = car.value.mainImageUrl;

        loading.value = false;
    } catch (err) {
        error.value = err.message || '차량 데이터를 불러오지 못했습니다.';
        loading.value = false;
    }
});

/** 목록으로 돌아가기 */
const goBack = () => {
    router.push('/carList');
};

/** 수정 모달 열기 */
const openEditModal = () => {
    if (!authStore.isLoggedIn) {
        alert('로그인이 필요한 기능입니다.');
        return;
    }

    // 현재 값으로 폼 초기화
    editForm.value.price = car.value.price;
    editForm.value.description = car.value.description || '';
    showEditModal.value = true;
};

/** 수정 모달 닫기 */
const closeEditModal = () => {
    showEditModal.value = false;
};

/** 차량 정보 업데이트 */
const updateCarInfo = async () => {
    if (!editForm.value.price || editForm.value.price <= 0) {
        alert('가격을 올바르게 입력해주세요.');
        return;
    }

    try {
        const listingId = route.params.listingId;
        // PATCH 요청으로 차량 정보 업데이트
        await carApi.updateCarInfo(listingId, editForm.value);

        // 성공 시 정보 갱신
        car.value.price = editForm.value.price;
        car.value.description = editForm.value.description;

        closeEditModal();
        alert('차량 정보가 성공적으로 수정되었습니다.');
    } catch (err) {
        if (err.response && err.response.status === 403) {
            alert('본인의 차량만 수정할 수 있습니다.');
        } else {
            console.error('차량 정보 수정 실패:', err);
            alert('차량 정보 수정에 실패했습니다: ' + (err.response?.data?.message || err.message));
        }
    }
};

/** 차량 삭제 확인 */
const confirmDelete = () => {
    if (!authStore.isLoggedIn) {
        alert('로그인이 필요한 기능입니다.');
        return;
    }

    if (confirm('정말로 이 차량을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        deleteCar();
    }
};

/** 차량 삭제 */
const deleteCar = async () => {
    try {
        const listingId = route.params.listingId;
        // DELETE 요청으로 차량 삭제
        await carApi.deleteCar(listingId);

        alert('차량이 성공적으로 삭제되었습니다.');
        // 차량 목록 페이지로 이동
        router.push('/carList');
    } catch (err) {
        if (err.response && err.response.status === 403) {
            alert('본인의 차량만 삭제할 수 있습니다.');
        } else {
            console.error('차량 삭제 실패:', err);
            alert('차량 삭제에 실패했습니다: ' + (err.response?.data?.message || err.message));
        }
    }
};
</script>

<style>
.car-detail-container {
    display: flex;
    justify-content: center;
    min-height: 80vh;
    padding: 20px;
    position: relative;
}

.car-detail-card {
    width: 100%;
    max-width: 1200px;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: white;
}

.loading-message {
    text-align: center;
    padding: 20px;
    font-size: 1.1rem;
    color: #666;
}

.error-message {
    color: #e74c3c;
    text-align: center;
    padding: 20px;
    font-size: 0.9rem;
}

.car-detail-header {
    margin-bottom: 30px;
}

.car-detail-title {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #333;
}

.car-detail-price {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
}

.car-detail-images {
    margin-bottom: 30px;
}

.main-image {
    margin-bottom: 15px;
    overflow: hidden;
    border-radius: 8px;
}

.main-image img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.main-image img:hover {
    transform: scale(1.02);
}

.gallery-images {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 15px;
}

.gallery-image {
    position: relative;
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    border: 3px solid transparent;
    transition: all 0.3s ease;
}

.gallery-image.active {
    border-color: #4a6ee0;
}

.gallery-image img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    display: block;
    transition: all 0.3s ease;
}

.gallery-image:hover img {
    opacity: 0.9;
}

.car-detail-info {
    margin-top: 20px;
}

.info-section {
    margin-bottom: 30px;
}

.info-section h2 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.usage-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.info-label {
    font-size: 0.9rem;
    color: #666;
}

.info-value {
    font-size: 1.1rem;
    font-weight: 500;
    color: #333;
}

.table-container {
    overflow-x: auto;
    margin-bottom: 20px;
}

.info-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #eee;
}

.info-table th,
.info-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.info-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
}

.info-table tr:hover {
    background-color: #f8f9fa;
}

.accident-item {
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 8px;
    background-color: #f8f9fa;
}

.accident-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.accident-date {
    font-weight: 600;
    color: #333;
}

.accident-type {
    color: #e74c3c;
}

.options-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}

.option-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 15px;
    background-color: #f8f9fa;
    border-radius: 6px;
}

.option-status {
    font-weight: 500;
}

.option-status.installed {
    color: #2ecc71;
}

.option-status.not-installed {
    color: #e74c3c;
}

.car-description {
    line-height: 1.6;
    color: #555;
    white-space: pre-line;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 6px;
}

.car-action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
}

.left-buttons, .right-buttons {
    display: flex;
    gap: 15px;
}

.contact-button,
.back-button,
.edit-button,
.delete-button {
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
}

.contact-button {
    background-color: #4a6ee0;
    color: white;
    border: none;
}

.contact-button:hover {
    background-color: #3a5ecc;
}

.back-button {
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #ddd;
}

.back-button:hover {
    background-color: #e0e0e0;
}

.edit-button {
    background-color: #4CAF50;
    color: white;
    border: none;
}

.edit-button:hover {
    background-color: #45a049;
}

.delete-button {
    background-color: #e74c3c;
    color: white;
    border: none;
}

.delete-button:hover {
    background-color: #c0392b;
}

/* 모달 스타일 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    padding: 25px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-title {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.modal-body {
    margin-bottom: 25px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
}

.modal-input, .modal-textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.modal-textarea {
    min-height: 150px;
    resize: vertical;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
}

.cancel-button, .confirm-button {
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
}

.cancel-button {
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #ddd;
}

.cancel-button:hover {
    background-color: #e0e0e0;
}

.confirm-button {
    background-color: #4a6ee0;
    color: white;
    border: none;
}

.confirm-button:hover {
    background-color: #3a5ecc;
}

@media (max-width: 768px) {
    .usage-grid {
        grid-template-columns: 1fr;
    }

    .car-action-buttons {
        flex-direction: column;
        gap: 15px;
    }

    .left-buttons, .right-buttons {
        width: 100%;
    }

    .left-buttons {
        margin-bottom: 10px;
    }

    .contact-button, .back-button, .edit-button, .delete-button {
        flex: 1;
    }
}
</style>