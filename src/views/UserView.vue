<template>
  <router-view />
  <div id="router-list">
    <router-link v-for="router of routerList" :to="router.url" :key="router.url" class="router-box">
      <div class="router-icon"><font-awesome-icon :icon="router.icon" /></div>

      <div class="router-text">{{ router.name }}</div>
    </router-link>
  </div>
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script setup>
import { ref } from 'vue';
const routerList = ref([
  { url: '/iframe/', name: 'QRCode', icon: 'qrcode' },
  { url: '/iframe/input', name: 'Input', icon: 'pen-to-square' },
]);
</script>

<style lang="scss">
#router-list {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  width: 80%;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
  height: 60px;
  .router-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: inherit;
    flex-direction: column;
    text-decoration: none;
    border-radius: 12px;
    &.router-link-exact-active {
      background-color: rgb(155, 254, 221);
      box-shadow: 1px 1px 2px #00000030;
    }

    .router-text {
      font-size: 12px;
      font-weight: 600;
    }
  }
}
</style>
