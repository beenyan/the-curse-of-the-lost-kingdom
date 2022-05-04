<template>
  <div id="QRCODE">
    <qrcode-stream @init="logErrors" @decode="onDecode" />
  </div>
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script>
import { QrcodeStream } from 'vue3-qrcode-reader';
export default {
  components: { QrcodeStream },
  methods: {
    onDecode(decodedString) {
      const code = decodedString.trim();
      const axios = this.$axios;
      axios.defaults.baseURL = '/api';
      axios
        .post('/backpack', { code })
        .then((response) => {
          this.$refs.alert.showAlert('error', '', '寶物成功取得');
        })
        .catch((error) => {
          const { data } = error.response;
          if (data.hasOwnProperty('msg')) {
            this.$refs.alert.showAlert('error', '', data.msg);
            return;
          }
          this.$refs.alert.showAlert('error', '', '未知錯誤');
        });
    },
    logErrors(promise) {
      promise.catch((e) => {
        this.$refs.alert.showAlert('error', '', '無法開啟相機');
      });
    },
  },
};
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
