<template>
  <NavbarVue />

  <div class="container h-100">
    <div class="row h-100 justify-content-center">
      <div class="px-3 col-lg-6 col-md-8 login-box"></div>
    </div>
  </div>
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';
import NavbarVue from '../components/navbarVue.vue';
const { proxy } = getCurrentInstance();
const alert = ref(null);
const refreshTime = 5 * 1000;

function init() {
  proxy.$axios
    .get('/team_progress')
    .then((response) => {
      const { data } = response;
      console.log(data);
    })
    .catch((error) => {
      const { response } = error;
      if (response === undefined) {
        // 連接伺服器錯誤
        alert.value.showAlert('error', '無法連上伺服器', '伺服器錯誤');
        return;
      }
      alert.value.showAlert('error', '', '未知錯誤');
    });
}

setInterval(init, refreshTime);
</script>

<style lang="scss"></style>
