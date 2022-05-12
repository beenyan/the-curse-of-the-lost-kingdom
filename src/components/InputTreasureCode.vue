<template>
  <div id="input">
    <div class="input-box">
      <div class="input-header">寶物代碼</div>
      <input type="text" class="input-body" v-model="code" />
    </div>

    <div class="btn-box">
      <button class="btn-body" @click="sendPost()">Get</button>
    </div>
  </div>
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
const successed = new Audio(new URL(`../assets/success.mp3`, import.meta.url).href);
const failed = new Audio(new URL(`../assets/fail.mp3`, import.meta.url).href);
const { proxy } = getCurrentInstance();
const axios = proxy.$axios;
const code = ref('');
const alert = ref();
axios.defaults.baseURL = '/api';

const sendPost = () => {
  const val = code.value.trim();
  if (val === '') {
    if (failed.paused) failed.play();
    else failed.currentTime = 0;
    alert.value.showAlert('error', '', '寶物代碼不能為空');
    return;
  }
  axios
    .post('/backpack', { code: val })
    .then((response) => {
      if (successed.paused) successed.play();
      else successed.currentTime = 0;
      const { data } = response;
      code.value = '';
      alert.value.showAlert('success', data.msg, '');
    })
    .catch((error) => {
      if (failed.paused) failed.play();
      else failed.currentTime = 0;
      const { data } = error.response;
      if (data.hasOwnProperty('msg')) {
        alert.value.showAlert('error', '', data.msg);
        return;
      }
      alert.value.showAlert('error', '', '未知錯誤');
    });
};
</script>

<style lang="scss">
#input {
  --margin-top: 20px;
  background-color: #caf6fa;
  overflow: hidden;
  width: 94%;
  border-radius: 5px;
  position: relative;
  height: 250px;
  margin-top: var(--margin-top);
  max-height: calc(100% - 2 * var(--margin-top));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 1px 1px 2px #00000030;
  .input-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: unset;
    width: 100%;
    row-gap: 8px;
    padding: 30px 25px 0;
    .input-header {
      font-size: 14px;
      width: 100%;
      color: #0d6efd;
    }
    .input-body {
      width: 100%;
      outline: none;
      border: unset;
      border-bottom: 1px solid #0d6efd;
      border-radius: 3px;
      padding: 5px;
      transition: 300ms;
      &:focus {
        border-bottom-width: 2px;
        box-shadow: 1px 1px 2px #00000030;
      }
    }
  }
  #hint {
    padding: 0 25px;
    color: #0d6efd;
    font-weight: bold;
    font-size: 12px;
  }
  .btn-box {
    padding: 15px 25px 30px 25px;
    text-align: right;
    .btn-body {
      padding: 3px 15px;
      border: 1px solid #0d6efd;
      background-color: #caf6fa;
      border-radius: 3px;
      box-shadow: 1px 1px 2px #00000030;
      color: #0d6efd;
      font-weight: bold;
    }
  }
}
</style>
