<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    getFirestore,
    collection,
    query,
    orderBy,
    getDocs,
    deleteDoc,
    doc,
    where,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
import { useConfirm } from 'primevue/useconfirm'

const userStore = useUserStore()
const db = getFirestore()
const confirm = useConfirm()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)
const selectedFilterResult = ref<string>('')

const submitFilter = async (): Promise<void> => {
    isLoading.value = true

    const listInterviews: Array<IInterview> = await getAllInterviews(true)
    interviews.value = listInterviews

    isLoading.value = false
}

const clearFilter = async (): Promise<void> => {
    isLoading.value = true

    const listInterviews: Array<IInterview> = await getAllInterviews()
    interviews.value = listInterviews

    selectedFilterResult.value = ''
    isLoading.value = false
}

const getAllInterviews = async <T extends IInterview>(isFilter?: boolean): Promise<T[]> => {
    let getData

    if (isFilter) {
        getData = query(
            collection(db, `users/${userStore.userId}/interviews`),
            orderBy('createdAt', 'desc'),
            where('result', '==', selectedFilterResult.value),
        )
    } else {
        getData = query(
            collection(db, `users/${userStore.userId}/interviews`),
            orderBy('createdAt', 'desc'),
        )
    }

    const listDocs = await getDocs(getData)

    return listDocs.docs.map((doc) => doc.data() as T)
}

const confirmRemoveInterview = async (id: string): Promise<void> => {
    confirm.require({
        message: 'Вы хотите удалить собеседование?',
        header: 'Удаление собеседования',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Отмена',
        acceptLabel: 'Удалить',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: async () => {
            isLoading.value = true
            await deleteDoc(doc(db, `users/${userStore.userId}/interviews`, id))
            const listInterviews: Array<IInterview> = await getAllInterviews()
            interviews.value = [...listInterviews]
            isLoading.value = false
        },
    })
}

onMounted(async () => {
    const listInterviews: Array<IInterview> = await getAllInterviews()
    interviews.value = listInterviews

    isLoading.value = false
})
</script>

<template>
    <app-dialog />
    <app-progress v-if="isLoading" />
    <app-message class="inline-block" v-else-if="!isLoading && !interviews.length" severity="info"
        >Нет добавленных собеседований
    </app-message>
    <div v-else>
        <h1>List of interviews</h1>
        <div class="flex align-items-center column-gap-4 mb-5">
            <div class="flex align-items-center">
                <app-radio
                    inputId="interviewResult1"
                    name="result"
                    value="Refusal"
                    v-model="selectedFilterResult"
                />
                <label for="interviewResult1" class="ml-2">Refusal</label>
            </div>
            <div class="flex align-items-center">
                <app-radio
                    inputId="interviewResult2"
                    name="result"
                    value="Offer"
                    v-model="selectedFilterResult"
                />
                <label for="interviewResult2" class="ml-2">Offer</label>
            </div>

            <div class="flex column-gap-2">
                <app-button @click="submitFilter" :disabled="!selectedFilterResult"
                    >Apply</app-button
                >
                <app-button severity="danger" :disabled="!selectedFilterResult" @click="clearFilter"
                    >Reset</app-button
                >
            </div>
        </div>
        <app-data-table :value="interviews">
            <app-column field="company" header="Company"></app-column>
            <app-column field="hrName" header="Hr Name"></app-column>
            <app-column field="vacancyLink" header="Vacancy Link">
                <template #body="slotProps">
                    <a :href="slotProps.data.vacancyLink" target="_blank">Vacancy link</a>
                </template>
            </app-column>
            <app-column header="Contacts">
                <template #body="slotProps">
                    <div class="contacts">
                        <a
                            v-if="slotProps.data.contactTelegram"
                            :href="`https://t.me/${slotProps.data.contactTelegram}`"
                            class="contacts__telegram"
                        >
                            <span class="contacts__icon pi pi-telegram"></span>
                        </a>
                        <a
                            v-if="slotProps.data.contactWhatsApp"
                            :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
                            class="contacts__whatsapp"
                        >
                            <span class="contacts__icon pi pi-whatsapp"></span>
                        </a>
                        <a
                            v-if="slotProps.data.contactPhone"
                            :href="`tel:${slotProps.data.contactPhone}`"
                            class="contacts__phone"
                        >
                            <span class="contacts__icon pi pi-phone"></span>
                        </a>
                    </div>
                </template>
            </app-column>
            <app-column header="Stages completed">
                <template #body="slotProps">
                    <span v-if="!slotProps.data.stages">Not filled</span>
                    <div v-else class="interview-stages">
                        <app-badge
                            v-for="(stage, i) in slotProps.data.stages"
                            :key="i"
                            :value="i + 1"
                            v-tooltip.top="stage.name"
                        />
                    </div>
                </template>
            </app-column>
            <app-column header="Salary">
                <template #body="slotProps">
                    <span v-if="!slotProps.data.salaryFrom">Not filled</span>
                    <span v-else
                        >{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span
                    >
                </template>
            </app-column>
            <app-column header="Result">
                <template #body="slotProps">
                    <span v-if="!slotProps.data.result">Not filled</span>
                    <template v-else>
                        <app-badge
                            :severity="slotProps.data.result === 'Offer' ? 'success' : 'danger'"
                            :value="slotProps.data.result === 'Offer' ? 'Offer' : 'Refusal'"
                        />
                    </template>
                </template>
            </app-column>
            <app-column>
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <router-link :to="`/interview/${slotProps.data.id}`">
                            <app-button icon="pi pi-pencil" severity="info" />
                        </router-link>
                        <app-button
                            icon="pi pi-trash"
                            severity="danger"
                            @click="confirmRemoveInterview(slotProps.data.id)"
                        ></app-button>
                    </div>
                </template>
            </app-column>
        </app-data-table>
    </div>
</template>

<style scoped>
.contacts {
    display: flex;
    align-items: center;
    gap: 20px;
}

.contacts__telegram {
    color: #0088cc;
}

.contacts__whatsapp {
    color: #25d366;
}

.contacts__phone {
    color: #371777;
}

.contacts__icon {
    font-size: 20px;
}

.interview-stages {
    display: flex;
    gap: 5px;
}
</style>
