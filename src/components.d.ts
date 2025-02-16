import DatePicker from 'primevue/datepicker';

declare module 'vue' {
    export interface GlobalComponents {
        'app-datepicker': typeof DatePicker
    }
}
