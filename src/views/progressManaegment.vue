<template>
  <NavbarVue />

  <div class="container h-100">
    <div class="row h-100 justify-content-center">
      <div class="px-3 col-lg-6 col-md-8 login-box">
        <div class="col-lg-12 login-title">進度統計</div>
        <div class="col-lg-12 login-form">
          <div v-for="team of teamList" class="teambox" :key="team.id">
            <div class="team-list team-title">{{ team.name }}</div>
            <div class="team-progress-list">
              <div class="team-text">寶物數量</div>
              <div class="team-progress">
                <div class="progress">
                  <div
                    class="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                    role="progressbar"
                    :style="{ width: team.data.used + '%' }"
                  ></div>
                  <div
                    class="progress-bar progress-bar-striped progress-bar-animated bg-striped"
                    role="progressbar"
                    :style="{ width: team.data.treasure + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="team-progress-list">
              <div class="team-text">善值</div>
              <div class="team-progress">
                <div class="progress">
                  <div
                    class="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    :style="{ width: team.data.kind + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import NavbarVue from '../components/navbarVue.vue';
const { proxy } = getCurrentInstance();
const alert = ref(null);
const teamList = ref([]);
const refreshTime = 10 * 1000;
const totalTreasureCount = 74;

function preprocessing(teams) {
  for (const team of teams) {
    team.data = {};
    team.data.kind = team.kind;
    team.data.used = (team.treasureList.filter((treasure) => treasure.is_used === 1).length / totalTreasureCount) * 100;
    team.data.treasure = (team.treasureList.length / totalTreasureCount) * 100 - team.data.used;
  }
  teamList.value = teams;
}

(function init() {
  proxy.$axios
    .get('/team_progress')
    .then((response) => {
      const { data } = response;
      preprocessing(data);
    })
    .catch((error) => {
      const { response } = error;
      if (response === undefined) {
        // 連接伺服器錯誤
        alert.value.showAlert('error', '無法連上伺服器', '伺服器錯誤');
        return;
      }
      alert.value.showAlert('error', '', '未知錯誤');
    })
    .then(() => setTimeout(init, refreshTime));
})();
</script>

<style scoped lang="scss">
@import '../assets/css/basic.scss';

.teambox {
  .team-title {
    font-weight: bold;
    font-size: 18px;
    margin-left: -5px;
    margin-bottom: 5px;
  }
  background-color: rgb(193, 237, 255);
  padding: 10px 15px;
  margin: 0 0 20px;
  border-radius: 5px;
  .team-progress-list {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    .team-text {
      white-space: nowrap;
      margin-right: 10px;
    }
  }
}
</style>
