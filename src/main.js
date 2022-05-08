import { createApp } from 'vue';
import Axios from 'axios';
import App from './App.vue';
import router from './routes';
import VueBasicAlert from 'vue-basic-alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueQrcodeReader from 'vue3-qrcode-reader';
const app = createApp(App);
Axios.defaults.timeout = 30 * 1000; // Max wait 30 secs
Axios.defaults.baseURL = '/manageapi';
app.config.globalProperties.$axios = Axios;

library.add(fas);

app.use(VueBasicAlert);
app.use(VueQrcodeReader);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.use(router);
app.mount('#app');
