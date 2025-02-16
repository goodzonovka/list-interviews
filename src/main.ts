import './assets/main.css'
import 'primeicons/primeicons.css'
import '/node_modules/primeflex/primeflex.css'
import '/node_modules/primeflex/themes/primeone-light.css'

import { initializeApp } from "firebase/app";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';


import Menubar from 'primevue/menubar';
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import Message from 'primevue/message';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';
import RadioButton from 'primevue/radiobutton';
import Badge from 'primevue/badge';
import Tooltip from 'primevue/tooltip';
import Chart from 'primevue/chart';



import App from './App.vue'
import router from './router'

const firebaseConfig = {
    apiKey: "AIzaSyA-AIs0mh5Lx_usan-SuC0NbNWxgRs-hRg",
    authDomain: "interviews-2ed03.firebaseapp.com",
    projectId: "interviews-2ed03",
    storageBucket: "interviews-2ed03.firebasestorage.app",
    messagingSenderId: "1052341014965",
    appId: "1:1052341014965:web:8e530f233df5f41edec9fc"
};

initializeApp(firebaseConfig);

const app = createApp(App)


app.use(ToastService)
app.use(ConfirmationService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.directive('tooltip', Tooltip);
app.component('app-menubar', Menubar)
app.component('app-ifta-label', IftaLabel)
app.component('app-input-text', InputText)
app.component('app-input-number', InputNumber)
app.component('app-button', Button)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-data-table', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', Message)
app.component('app-textarea', Textarea)
app.component('app-datepicker', DatePicker)
app.component('app-radio', RadioButton)
app.component('app-badge', Badge)
app.component('app-chart', Chart)

app.mount('#app')
