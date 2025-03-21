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
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import userApi from "@/services/userApi";

const authStore = useAuthStore();
const isEdit = ref(false);
const editForm = ref({
    userName: '',
    phoneNumber: ''
});

// 마이페이지 진입 시 사용자 정보가 없다면 api 호출해서 가져온다
onMounted(async () => {
    if (authStore.isLoggedIn && !authStore.user) {
        await authStore.loadUser();
    }
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
    max-width: 400px;
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

#edit-profile-button {
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

#edit-profile-button:hover {
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
</style>