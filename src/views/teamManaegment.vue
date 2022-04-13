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
                  <th scope="col" class="t-center">資訊</th>
                  <th scope="col">編號</th>
                  <th scope="col" class="t-center">
                    <!-- 刪除 -->
                    <select class="form-select border-0" v-model="select">
                      <option value="name">名稱</option>
                      <option value="kind">善值</option>
                      <option value="money">金幣</option>
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(team, index) of teamList" :key="team.id">
                  <th class="t-center">
                    <button type="button" class="btn btn-primary" @click="dialogOpen(team.id)">
                      <font-awesome-icon icon="info-circle" />
                    </button>
                  </th>
                  <th scope="row">{{ team.id }}</th>
                  <th scope="row">{{ selectList[index] }}</th>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-lg-12 login-form" v-else-if="step === 'insert'">
            <div class="form-group">
              <label class="form-control-label">隊伍編號</label>
              <input
                type="text"
                class="form-control"
                maxlength="50"
                v-model.trim="team.id"
                @keyup.enter.prevent="insertHandler"
              />
            </div>

            <div class="col-lg-12 loginbttm">
              <button type="button" class="btn btn-outline-primary float-end" @click="insertHandler">新增</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FooterVue :tool-list="toolList" v-model:step="step" />
  <DialogVue ref="dialog">
    <template #header v-if="selectTeam"> {{ selectTeam.id }} </template>
    <template #body v-if="selectTeam">
      <ul>
        <li>名稱：{{ selectTeam.name }}</li>
        <li>善值：{{ selectTeam.kind }}</li>
        <li>金錢：{{ selectTeam.money }}$</li>
      </ul>
    </template>
  </DialogVue>
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';
import NavbarVue from '../components/navbarVue.vue';
import FooterVue from '../components/footerVue.vue';
import DialogVue from '../components/dialogVue.vue';
const { proxy } = getCurrentInstance();
const select = ref(localStorage.getItem('team-select') || 'name');
const step = ref(localStorage.getItem('team-step') || 'list');
const selectedTeamID = ref(null);
const alert = ref(null);
const toolList = [
  {
    step: 'list',
    icon: 'list-ul',
    name: '隊伍列表',
  },
  {
    step: 'insert',
    icon: 'flag',
    name: '新增隊伍',
  },
];
const teamList = ref([]);
onMounted(() => {
  proxy.$axios
    .get('/manageapi/team_list')
    .then((response) => {
      const { data } = response;
      teamList.value = data;
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
const title = computed(() => {
  return toolList.find((tool) => tool.step === step.value).name;
});
const selectList = computed(() => {
  return teamList.value.map((team) => team[select.value]);
});
const selectTeam = computed(() => {
  return teamList.value.find((team) => team.id === selectedTeamID.value);
});
watch(step, (newVal) => {
  localStorage.setItem('team-step', newVal);
});
watch(select, (newVal) => {
  localStorage.setItem('team-select', newVal);
});
const team = ref({ id: '' });
const insertHandler = () => {
  for (const [key, val] of Object.entries(team.value)) {
    if (team.value[key] === '') {
      alert.value.showAlert('warning', `${key} can't empty`, '參數錯誤');
      return;
    } else if (key === 'id' && teamList.value.find((team) => team.id === val)) {
      alert.value.showAlert('warning', `id repeat`, '參數錯誤');
      return;
    }
  }
  proxy.$axios
    .post('/manageapi/team', team.value)
    .then(() => {
      teamList.value.push(JSON.parse(JSON.stringify(team.value)));
      team.value.id = '';
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

/**
 * dialog
 */
const dialog = ref(null);
const dialogOpen = (teamID) => {
  selectedTeamID.value = teamID;
  dialog.value.open();
};
</script>

<style lang="scss">
@import '../assets/css/basic.scss';
.login-form {
  line-height: 36px;
}
</style>
