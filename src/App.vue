<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import AppHeader from '@/components/AppHeader.vue'
import { useUserStore } from '@/stores/user.ts'

const userStore = useUserStore()

const isLoading = ref<boolean>(true)

onMounted(() => {
    onAuthStateChanged(getAuth(), (user) => {
        if (user) {
            userStore.userId = user.uid
        } else {
            userStore.userId = ''
        }
        isLoading.value = false
    })
})
</script>

<template>
    <div class="container">
        <app-progress v-if="isLoading" class="m-auto" />

        <div v-else>
            <app-header />
            <div class="content">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    max-width: 1280px;
    margin: auto;
    padding: 20px;
}
</style>
