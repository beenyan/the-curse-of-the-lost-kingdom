<template>
  <div id="QRCODE">
    <qrcode-stream @init="logErrors" @decode="onDecode" />
  </div>
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
const successed = new Audio(new URL(`../assets/success.mp3`, import.meta.url).href);
const failed = new Audio(new URL(`../assets/fail.mp3`, import.meta.url).href);
const { proxy } = getCurrentInstance();
const axios = proxy.$axios;
const alert = ref();

axios.defaults.baseURL = '/api';

function logErrors(promise) {
  promise.catch((error) => {
    alert.value.showAlert('error', error.message, '無法開啟相機');
  });
}

function onDecode(decodedString) {
  const code = decodedString.trim();
  axios
    .post('/backpack', { code })
    .then((response) => {
      if (successed.paused) successed.play();
      else successed.currentTime = 0;
      const { data } = response;
      code.value = '';
      alert.value.showAlert('success', data.msg, '');
    })
    .catch((error) => {
      console.log(error);
      if (failed.paused) failed.play();
      else failed.currentTime = 0;
      if (!error.response.hasOwnProperty('data')) {
        alert.value.showAlert('error', '', '未知錯誤');
        return;
      }
      const { data } = error.response;
      if (data.hasOwnProperty('msg')) {
        alert.value.showAlert('error', '', data.msg);
        return;
      }
    });
}
</script>
<style scoped lang="scss">
#QRCODE {
  overflow: hidden;
  background-color: black;
  height: 250px;
  width: 94%;
  border-radius: 5px;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
