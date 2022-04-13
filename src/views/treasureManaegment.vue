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
                  <!-- <th scope="col" class="t-center">資訊</th> -->
                  <th scope="col">名稱</th>
                  <th scope="col">種類</th>
                  <th scope="col" class="t-center">刪除</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(treasure, index) of treasureList" :key="treasure.id">
                  <!-- <th class="t-center">
                    <button type="button" class="btn btn-primary" @click="infoOpen(index)">
                      <font-awesome-icon icon="info-circle" />
                    </button>
                  </th> -->
                  <th scope="row">{{ treasure.name }}</th>
                  <td>{{ treasure.type }}</td>
                  <td class="t-center">
                    <button type="button" class="btn btn-danger" @click="deleteHandler(index)">
                      <font-awesome-icon icon="trash-alt" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-lg-12 login-form" v-else-if="step === 'insert'">
            <div class="form-group">
              <label class="form-control-label">名稱</label>
              <input type="text" class="form-control" maxlength="10" v-model.trim="treasure.name" />
            </div>

            <div class="form-group">
              <label class="form-control-label">代碼</label>
              <input type="text" class="form-control" maxlength="20" v-model.trim="treasure.code" />
            </div>

            <div class="form-group">
              <label class="form-control-label">內容</label>
              <textarea
                class="form-control"
                cols="30"
                rows="3"
                maxlength="200"
                v-model.trim="treasure.content"
              ></textarea>
            </div>

            <div class="form-group d-flex align-items-center">
              <label class="form-control-label w-25">種類</label>
              <select class="form-select border-0" v-model.trim="treasure.type">
                <option value="主線">主線</option>
                <option value="支線">支線</option>
              </select>
            </div>

            <div class="form-group d-flex align-items-center">
              <input
                class="me-1"
                type="checkbox"
                name="expendables"
                id="expendables"
                v-model.trim="treasure.expendables"
              />
              <label class="form-control-label" for="expendables">消耗品</label>
            </div>

            <div class="form-group d-flex align-items-center">
              <input class="me-1" type="checkbox" name="qrcode" id="qrcode" v-model.trim="treasure.qrcode" />
              <label class="form-control-label" for="qrcode">僅限 QR CODE 生成</label>
            </div>

            <div class="form-group d-flex align-items-center">
              <input class="me-1" type="checkbox" name="depend" id="depend" v-model.trim="treasure.depend" />
              <label class="form-control-label" for="depend">需要前置條件</label>
            </div>

            <div class="form-group d-flex align-items-center flex-wrap" v-if="treasure.depend">
              <label class="form-control-label w-100">需擁有</label>
              <div class="checkbox-group mb-1" v-for="treasure of treasureList" :key="treasure.id">
                <input type="checkbox" :value="treasure.id" :id="treasure.id" v-model.trim="treasure.need" />
                <label :for="treasure.id">{{ treasure.name }}</label>
              </div>
            </div>

            <div class="col-lg-12 loginbttm">
              <button type="button" class="btn btn-outline-primary float-end" @click="insertHandler">新增</button>
            </div>
          </div>

          <div class="col-lg-12 login-form" v-if="step === 'qrcode'">
            <table class="table table-light">
              <thead>
                <tr>
                  <th scope="col">名稱</th>
                  <th scope="col">種類</th>
                  <th scope="col" class="t-center">QRCODE</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="treasure of treasureQrcodeList" :key="treasure.id">
                  <th scope="row">{{ treasure.name }}</th>
                  <td>{{ treasure.type }}</td>
                  <td class="t-center">
                    <button type="button" class="btn btn-primary" @click="showQrcode(treasure.id)">
                      <font-awesome-icon icon="qrcode" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FooterVue :tool-list="toolList" v-model:step="step" />
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
  <DialogVue ref="dialog">
    <template #header v-if="qrcodeTreasure">{{ qrcodeTreasure.name }}</template>
    <template #body>
      <select class="team-id" v-model="selectedTeamID">
        <option v-for="team of teamList" :key="team.id" :value="team.id">{{ team.id }}</option>
      </select>
      <div class="team-name">{{ selectedTeamName }}</div>
      <qrcode-vue v-if="qrcodeVal" :value="qrcodeVal" :size="280" level="H" />
    </template>
  </DialogVue>
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';
import NavbarVue from '../components/navbarVue.vue';
import FooterVue from '../components/footerVue.vue';
import DialogVue from '../components/dialogVue.vue';
import AES from 'crypto-js/aes';
import QrcodeVue from 'qrcode.vue';
const { proxy } = getCurrentInstance();
const step = ref(localStorage.getItem('treasure-step') || 'list');
const alert = ref(null);
const toolList = [
  {
    step: 'list',
    icon: 'ankh',
    name: '寶物列表',
  },
  {
    step: 'insert',
    icon: 'book-medical',
    name: '新增寶物',
  },
  {
    step: 'qrcode',
    icon: 'qrcode',
    name: '寶物條碼',
  },
];
const treasureList = ref([]);
onMounted(() => {
  proxy.$axios
    .get('/manageapi/treasure_list')
    .then((response) => {
      const { data } = response;
      treasureList.value = data;
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
const treasureQrcodeList = computed(() => {
  return treasureList.value.filter((treasure) => treasure.qrcode);
});
watch(step, (newVal) => {
  localStorage.setItem('treasure-step', newVal);
});
const treasure = ref({
  name: '',
  code: '',
  content: '',
  type: '主線',
  expendables: false,
  qrcode: false,
  depend: false,
  need: [],
});
const insertHandler = () => {
  const requiredList = ['name', 'code', 'content'];

  for (const key of requiredList) {
    if (treasure.value[key] === '') {
      alert.value.showAlert('warning', `${key} can't empty`, '參數錯誤');
      return;
    }
  }
  proxy.$axios
    .post('/manageapi/treasure', treasure.value)
    .then(() => {
      treasureList.value.push(JSON.parse(JSON.stringify(treasure.value)));
      treasure.value.name = '';
      treasure.value.code = '';
      treasure.value.content = '';
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

const key = 'secret';
/**
 * qrcode
 */
const qrcodeVal = computed(() => {
  if (qrcodeTreasure.value === undefined) return null;
  const val = JSON.stringify({
    team: selectedTeamID.value,
    treasure: qrcodeTreasure.value.code,
  });
  return AES.encrypt(val, key).toString();
});

/**
 * dialog
 */
const selectQrcodeTreasureID = ref(null);
const dialog = ref(null);
const showQrcode = (id) => {
  selectQrcodeTreasureID.value = id;
  dialog.value.open();
};
const qrcodeTreasure = computed(() => {
  return treasureList.value.find((treasure) => treasure.id === selectQrcodeTreasureID.value);
});
const teamList = ref([]);
const selectedTeamID = ref(null);
const selectedTeamName = ref('');
onMounted(() => {
  proxy.$axios
    .get('/manageapi/team_list')
    .then((response) => {
      const { data } = response;
      teamList.value = data;
      selectedTeamID.value = teamList.value[0].id;
      selectedTeamName.value = teamList.value[0].name;
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
</script>

<style lang="scss">
@import '../assets/css/basic.scss';
.dialog-body {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  row-gap: 5px;

  .team-id {
    font-size: 14px;
    padding: 2px 10px;
  }

  .team-name {
    font-size: 24px;
    font-weight: 800;
  }
}
</style>
