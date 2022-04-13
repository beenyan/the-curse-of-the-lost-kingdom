<template>
  <div class="login-box">
    <div class="col-lg-12 login-key d-flex justify-content-center align-items-center">
      <img class="big-logo" src="/src/assets/logo.png" alt="Logo" />
    </div>

    <div class="col-lg-12 login-title">登入系統</div>

    <div class="col-lg-12 login-form">
      <div class="col-lg-12 login-form">
        <div class="form-group">
          <label class="form-control-label">管理員帳號</label>
          <input type="text" class="form-control" maxlength="9" v-model.trim="account" @keyup.enter="loginHandler" />
        </div>

        <div class="col-lg-12 loginbttm">
          <button type="button" class="btn btn-outline-primary float-end" @click="loginHandler">登入</button>
        </div>
      </div>
    </div>
  </div>
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';
import router from '../routes';
const { proxy } = getCurrentInstance();

const loading = ref(false);
const account = ref('');
const alert = ref(null);

/**
 * 登入驗證
 */
const loginHandler = () => {
  if (account.value === '') {
    alert.value.showAlert('warning', '學號不能為空', '參數錯誤');
    return;
  }
  proxy.$axios
    .post('/manageapi/login', { account: account.value })
    .then((response) => {
      const { data } = response;
      const { msg } = data;
      if (msg === 'success') {
        alert.value.showAlert('success', '', '登入成功');
        router.push('manage');
        return;
      }
      alert.value.showAlert('error', '', 'unKnown error.');
    })
    .catch((error) => {
      const { response } = error;
      if (response === undefined) {
        // 連接伺服器錯誤
        alert.value.showAlert('error', '無法連上伺服器', '伺服器錯誤');
        return;
      }
      const { data } = response;
      const { msg } = data;
      if (msg === 'fail') {
        alert.value.showAlert('error', '', '學號錯誤');
      }
    });
};
</script>

<style scoped lang="scss">
body,
html {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 0;
  background: #222d32;
  font-family: 'Roboto', sans-serif;
}

.login-box {
  padding: 25px 48px 40px 48px;
  height: 100%;
  overflow: hidden;
  background: #1a2226;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.login-key {
  height: 200px;
  font-size: 80px;
  line-height: 100px;
}

.login-title {
  text-align: center;
  font-size: 30px;
  letter-spacing: 2px;
  font-weight: bold;
  color: #ecf0f5;
}

.login-form {
  overflow: hidden;
  margin-top: 25px;
  text-align: left;
}

input[type='text'] {
  background-color: #1a2226;
  border: none;
  border-bottom: 2px solid #0db8de;
  border-top: 0px;
  border-radius: 0px;
  font-weight: bold;
  outline: 0;
  margin-bottom: 20px;
  padding-left: 0px;
  color: #ecf0f5;
}

input[type='password'] {
  background-color: #1a2226;
  border: none;
  border-bottom: 2px solid #0db8de;
  border-top: 0px;
  border-radius: 0px;
  font-weight: bold;
  outline: 0;
  padding-left: 0px;
  margin-bottom: 20px;
  color: #ecf0f5;
}

.form-group {
  margin-bottom: 40px;
  outline: 0px;
}

.form-control:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none !important;
  border-bottom: 2px solid #0db8de;
  outline: 0;
  background-color: #1a2226 !important;
  color: #ecf0f5 !important;
}

input:focus {
  outline: none;
  background-color: #1a2226;
  box-shadow: 0 0 0;
}

label {
  margin-bottom: 0px;
}

.form-control-label {
  font-size: 10px;
  color: #6c6c6c;
  font-weight: bold;
  letter-spacing: 1px;
}

.btn-outline-primary {
  border-color: #0db8de;
  color: #0db8de;
  border-radius: 0px;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

  &hover hover {
    background-color: #0db8de;
    right: 0px;
  }
}

.login-btm {
  float: left;
}

.login-button {
  padding-right: 0px;
  text-align: right;
  margin-bottom: 25px;
}

.login-text {
  text-align: left;
  padding-left: 0px;
  color: #a2a4a4;
}

.loginbttm {
  padding: 0px;
}

.big-logo {
  height: 100%;
}

[v-cloak] {
  display: none;
}
</style>
