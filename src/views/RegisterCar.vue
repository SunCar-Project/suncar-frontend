<template>
    <div class="register-car-container">
        <div class="register-car-card">
            <h1 class="register-car-title">차량 등록</h1>
            
            <form class="car-info" @submit.prevent="handleSubmit">
                <div class="info-group">
                    <label for="carNumber">차량번호</label>
                    <input
                        v-model="carForm.carNumber"
                        class="info-input"
                        type="text"
                        placeholder="예: 123가 3456"
                        required
                    />
                </div>

                <div class="info-group">
                    <label for="price">가격 (원)</label>
                    <input
                        v-model="carForm.price"
                        class="info-input"
                        type="number"
                        min="0"
                        placeholder="예: 10000000"
                        required
                    />
                </div>

                <div class="info-group">
                    <label for="mainImage">메인 이미지</label>
                    <div class="image-upload-container">
                        <input
                            type="file"
                            id="mainImage"
                            ref="mainImageInput"
                            @change="handleMainImageUpload"
                            accept="image/*"
                        />
                        <div v-if="mainImagePreview" class="image-preview-container">
                            <img :src="mainImagePreview" class="image-preview" alt="메인 이미지 미리보기" />
                            <button type="button" class="remove-image-btn" @click="removeMainImage">×</button>
                        </div>
                    </div>
                </div>

                <div class="info-group">
                    <label for="additionalImages">추가 이미지 (여러 장 선택 가능)</label>
                    <div class="image-upload-container">
                        <input
                            type="file"
                            id="additionalImages"
                            ref="additionalImagesInput"
                            @change="handleAdditionalImagesUpload"
                            accept="image/*"
                            multiple
                        />
                        <div v-if="additionalImagePreviews.length > 0" class="additional-images-container">
                            <div v-for="(preview, index) in additionalImagePreviews" :key="index" class="image-preview-item">
                                <img :src="preview" class="image-preview" alt="추가 이미지 미리보기" />
                                <button type="button" class="remove-image-btn" @click="removeAdditionalImage(index)">×</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="register-car-footer">
                    <button type="submit" id="register-car-button">
                        차량 등록
                    </button>
                    <button type="button" id="cancel-button" @click="goBack">
                        취소
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import carApi from "@/services/carApi";

const router = useRouter();

// 차량 등록 폼 데이터
const carForm = ref({
    carNumber: '',
    price: '',
});

// 이미지 파일 참조 -> 이미지 요소에 직접 접근, 값 변경 등 가능하도록록
const mainImageInput = ref(null);
const additionalImagesInput = ref(null);

// 이미지 미리보기 URL
const mainImagePreview = ref('');
const additionalImagePreviews = ref([]);

// 실제 업로드할 이미지 파일들
const mainImageFile = ref(null);
const additionalImageFiles = ref([]);

// 메인 이미지 업로드 처리
const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        mainImageFile.value = file; // 실제 업로드할 파일 정보 저장
        mainImagePreview.value = URL.createObjectURL(file); // 이미지 미리보기 URL 저장
    }
};

// 메인 이미지 제거
const removeMainImage = () => {
    mainImageFile.value = null;
    mainImagePreview.value = '';
    if (mainImageInput.value) {
        mainImageInput.value.value = '';
    }
};

// 추가 이미지 업로드 처리
const handleAdditionalImagesUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        // 기존 미리보기에 새 이미지 추가
        files.forEach(file => {
            additionalImageFiles.value.push(file);
            additionalImagePreviews.value.push(URL.createObjectURL(file));
        });
    }
};

// 추가 이미지 제거
const removeAdditionalImage = (index) => {
    // 미리보기와 파일 목록에서 해당 인덱스 항목 제거
    additionalImagePreviews.value.splice(index, 1);
    additionalImageFiles.value.splice(index, 1);
};

// 이전 페이지로 돌아가기
const goBack = () => {
    router.go(-1);
};

// 폼 제출 처리 
// 후에 이 로직 사용하기!! 배포용 로직직
// const handleSubmit = async () => {
//     try {
//         // FormData 객체 생성
//         // 이 객체로 전송해야 파일 전송이 가능한 multipart/form-data 형식으로 전송 가능
//         const formData = new FormData();
        
//         // 차량 정보 추가
//         formData.append('carNumber', carForm.value.carNumber);
//         formData.append('price', carForm.value.price);
        
//         // 메인 이미지 추가
//         if (mainImageFile.value) {
//             formData.append('mainImage', mainImageFile.value);
//         }
        
//         // 추가 이미지들 추가
//         // 서버에서는 이것을 배열로 인식하게 된다.
//         additionalImageFiles.value.forEach((file) => {
//             formData.append(`additionalImages`, file);
//         });

//         // API 호출하여 차량 등록
//         await carApi.registerCar(formData);
        
//         alert('차량이 성공적으로 등록되었습니다.');
//         router.push('/cars'); // 차량 목록 페이지로 이동 (경로는 필요에 따라 조정)
//     } catch (err) {
//         console.error('차량 등록 실패:', err);
//         alert('차량 등록에 실패했습니다.');
//     }
// };

// 더미데이터 호출 로직
const handleSubmit = async () => {
    try {
        const registerCarDummyData = {
            carNumber: carForm.value.carNumber,
            price: carForm.value.price,
            mainImage: "/images/cars/listing_1_1.png",
            additionalImages: [
                "/images/cars/listing_1_2.png",
                "/images/cars/listing_1_3.png",
                "/images/cars/listing_4_2.png"
            ]
        };
        

        // API 호출하여 차량 등록
        await carApi.registerCarDummy(registerCarDummyData);
        
        alert('차량이 성공적으로 등록되었습니다.');
        router.push('/carList'); // 차량 목록 페이지로 이동 (경로는 필요에 따라 조정)
    } catch (err) {
        console.error('차량 등록 실패:', err);
        alert('차량 등록에 실패했습니다.');
    }
};
</script>

<style>
.register-car-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 20px;
}

.register-car-card {
    width: 100%;
    max-width: 600px;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: white;
}

.register-car-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.car-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

.info-input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    width: 100%;
}

.image-upload-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.image-preview-container {
    position: relative;
    width: 200px;
    height: 150px;
    margin-top: 10px;
}

.additional-images-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.image-preview-item {
    position: relative;
    width: 150px;
    height: 150px;
}

.image-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #ddd;
}

.remove-image-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #ff4d4f;
    color: white;
    border: none;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.remove-image-btn:hover {
    background-color: #ff7875;
}

.register-car-footer {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    gap: 20px;
}

#register-car-button {
    padding: 10px 25px;
    background-color: #86e4ad;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
}

#register-car-button:hover {
    background-color: #6dbb8a;
}

#cancel-button {
    padding: 10px 25px;
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
}

#cancel-button:hover {
    background-color: #e0e0e0;
}
</style>