<template>
    <div class="carlist-container">
      <div class="carlist-card">
        <h1 class="carlist-title">판매중인 차량 목록</h1>
        
        <div v-if="loading" class="loading-message">로딩 중...</div>
        
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-else class="car-grid">
          <div
            v-for="car in cars"
            :key="car.carListingId"
            class="car-item"
            @click="goToCarDetail(car.carListingId)"
          >
            <div class="car-image">
              <img :src="car.mainImageUrl" alt="차량 이미지">
            </div>
            <div class="car-details">
              <h2 class="car-name">{{ car.brandName }} {{ car.carName }}</h2>
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
  </template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import carApi from '@/services/carApi';
import formatKoreanPrice from '@/utils/formatters';

const router = useRouter();
const formatPrice = formatKoreanPrice;

const cars = ref([]);
const loading = ref(true);
const error = ref(null);

/** 판매중인 차량 목록 가져오기 */
onMounted(async () => {
    try {
        /** 차량 조회 api 호출 */
        const response = await carApi.getCarList();
        cars.value = response.data.data;

        loading.value = false;
    }
    catch (err) {
        error.value = err.message || '데이터를 불러오지 못했습니다';

        loading.value = false;
    }
});

/** 차량 상세 페이지로 이동 */
const goToCarDetail = (carListingId) => {
  router.push({
    name: 'CarDetail',
    params: { listingId: carListingId}
  });
}

</script>

<style>
.carlist-container {
  display: flex;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
}

.carlist-card {
  width: 100%;
  max-width: 1200px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.carlist-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
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

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
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
  height: 200px;
  object-fit: cover;
}

.car-details {
  padding: 20px;
}

.car-name {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  color: #333;
}

.car-price {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.car-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 20px;
}

.car-info p {
  margin: 0;
  font-size: 0.95rem;
  color: #555;
}

.car-info span {
  font-weight: 500;
  color: #333;
}
</style>