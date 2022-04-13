<template>
  <NavbarVue />
  <div class="container h-100">
    <div class="row h-100 justify-content-center">
      <div class="px-3 col-lg-6 col-md-8 login-box">
        <div class="col-lg-12 login-title">{{ title }}</div>

        <div class="col-lg-12 login-form">
          <div class="col-lg-12 login-form" v-if="step === 'list'">
            <table class="table table-light">
              <thead>
                <tr>
                  <th scope="col">學號</th>
                  <th scope="col">職位</th>
                  <th scope="col t-center">刪除</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user of userList" :key="user.id">
                  <th scope="row">{{ user.id }}</th>
                  <td>{{ user.role }}</td>
                  <td class="t-center">
                    <button type="button" class="btn btn-danger" @click="deleteHandler(user.id)">
                      <font-awesome-icon icon="trash-alt" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-lg-12 login-form" v-else-if="step === 'insert'">
            <div class="form-group">
              <label class="form-control-label">學號</label>
              <input type="text" class="form-control" maxlength="9" v-model.trim="user.id" />
            </div>

            <div class="form-group">
              <label class="form-control-label">職位</label>
              <input type="text" class="form-control" maxlength="50" v-model.trim="user.role" />
            </div>

            <div class="col-lg-12">
              <button type="button" class="btn btn-outline-primary float-end" @click="insertHandler">新增</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FooterVue :tool-list="toolList" v-model:step="step" />
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';
import NavbarVue from '../components/navbarVue.vue';
import FooterVue from '../components/footerVue.vue';
const { proxy } = getCurrentInstance();

const alert = ref(null);
const userList = ref([]);
onMounted(() => {
  proxy.$axios
    .get('/manageapi/user_list')
    .then((response) => {
      const { data } = response;
      userList.value = data;
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
});

const toolList = [
  {
    step: 'list',
    icon: 'address-book',
    name: '人員列表',
  },
  {
    step: 'insert',
    icon: 'user-plus',
    name: '新增人員',
  },
];
const step = ref(localStorage.getItem('user-step') || 'list');
const title = computed(() => {
  return toolList.find((tool) => tool.step === step.value).name;
});
watch(step, (newVal) => {
  localStorage.setItem('user-step', newVal);
});
const user = ref({ id: '', role: '' });
const insertHandler = () => {
  for (const [key, val] of Object.entries(user.value)) {
    if (user.value[key] === '') {
      alert.value.showAlert('warning', `${key} can't empty`, '參數錯誤');
      return;
    } else if (key === 'id' && userList.value.find((user) => user.id === val)) {
      alert.value.showAlert('warning', `id repeat`, '參數錯誤');
      return;
    }
  }
  proxy.$axios
    .post('/manageapi/user', user.value)
    .then(() => {
      userList.value.push(JSON.parse(JSON.stringify(user.value)));
      user.value.id = '';
      user.value.role = '';
      alert.value.showAlert('success', ``, '新增成功');
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
};

const deleteHandler = (id) => {
  if (!confirm('確認刪除，刪除後無法復原。')) return;
  proxy.$axios
    .delete(`/manageapi/user/${id}`)
    .then((response) => {
      const { msg } = response.data;
      if (msg === 'success') {
        const index = userList.value.findIndex((user) => user.id === id);
        userList.value.splice(index, 1);
        alert.value.showAlert('success', '', '刪除成功');
      }
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
};
</script>

<style lang="scss">
@import '../assets/css/basic.scss';
</style>
