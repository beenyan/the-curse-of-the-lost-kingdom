import { createApp } from 'vue';
import Axios from 'axios';
import App from './App.vue';
import router from './routes';
import VueBasicAlert from 'vue-basic-alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const app = createApp(App);
Axios.defaults.timeout = 3 * 1000; // Max wait 3 secs
Axios.defaults.baseURL = '/manageapi';
app.config.globalProperties.$axios = Axios;

library.add(fas);

app.use(VueBasicAlert);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.use(router);
app.mount('#app');
