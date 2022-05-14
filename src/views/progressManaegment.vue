<template>
  <NavbarVue />

  <div class="container h-100">
    <div class="row h-100 justify-content-center">
      <div class="px-3 col-lg-6 col-md-8 login-box">
        <div class="col-lg-12 login-title">進度統計</div>
        <div class="col-lg-12 login-form" v-for="team of teamList" :key="team.id" @click="team.show = !team.show">
          <div class="team-box">
            <div class="team-content">
              <div class="team-list team-header">
                <div class="team-title">{{ team.name }}</div>
                <div class="team-choose">{{ team.data.choose }}</div>
              </div>

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

            <div class="team-horus">
              <font-awesome-icon icon="circle-dot" v-for="n of team.data.horus" :key="n" />
            </div>
          </div>

          <div class="team-box-content" :class="{ active: team.show }" @click.stop>
            <span class="image-introduce">
              背包道具 <span class="sub"> x {{ team.data.backpack.unUsed.length }}</span>
            </span>
            <div class="image-box">
              <img
                width="80px"
                class="img un-used"
                :src="imgUrl(img)"
                v-for="img of team.data.backpack.unUsed"
                :key="img"
              />
            </div>
            <span class="image-introduce">
              已用道具 <span class="sub"> x {{ team.data.backpack.used.length }}</span>
            </span>
            <div class="image-box used">
              <img
                width="40px"
                class="img used"
                :src="imgMiniUrl(img)"
                v-for="img of team.data.backpack.used"
                :key="img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <vue-basic-alert :close-in="3000" :duration="300" ref="alert" />
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';
import NavbarVue from '../components/navbarVue.vue';
const { proxy } = getCurrentInstance();
const alert = ref(null);
const teamList = ref([]);
const refreshTime = 10 * 1000;
const totalTreasureCount = 55;
const chooseObj = {
  0: '遊玩中',
  1: '法老線',
  2: '現實線',
};
let interval;

function imgUrl(imgName) {
  return new URL(`../assets/img/${imgName}.png`, import.meta.url).href;
}

function imgMiniUrl(imgName) {
  return new URL(`../assets/img/miniSize/${imgName}.png`, import.meta.url).href;
}

function preprocessing(teams) {
  let index = 0;
  for (const team of teams) {
    team.data = {};
    team.show = false || teamList.value[index]?.show;
    team.data.horus = team.horus;
    team.data.choose = chooseObj[team.choose];
    team.data.kind = team.kind;
    team.data.backpack = {
      name: team.treasure_name ? team.treasure_name.split(',') : [],
      label: team.treasure_label ? team.treasure_label.split(',').map((strInt) => Number(strInt)) : [],
    };
    team.data.backpack.used = team.data.backpack.name.filter(
      (name, index) => team.data.backpack.label[index] === 1 && !name.startsWith('kind')
    );
    team.data.backpack.unUsed = team.data.backpack.name.filter(
      (name, index) => team.data.backpack.label[index] === 0 && !name.startsWith('kind')
    );
    team.data.used = (team.data.backpack.used.length / totalTreasureCount) * 100;
    team.data.treasure = (team.data.backpack.unUsed.length / totalTreasureCount) * 100;
    ++index;
  }
  teamList.value = teams;
}
const route = useRoute();
function init() {
  proxy.$axios
    .get('/team_progress')
    .then((response) => {
      const { data } = response;
      preprocessing(data);
    })
    .catch((error) => {
      alert.value.showAlert('error', '', '未知錯誤');
    });
}

onMounted(() => {
  init();
  interval = setInterval(init, refreshTime);
});

watch(
  () => route.path,
  () => clearInterval(interval)
);
</script>

<style scoped lang="scss">
@import '../assets/css/basic.scss';

.login-form {
  display: grid;
  grid-auto-flow: row;
  cursor: pointer;
  background-color: rgb(193, 237, 255);
  padding: 10px 15px;
  margin: 0 0 15px;
  border-radius: 5px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.26);
  transition: 300ms;
  grid-template-rows: 1fr auto;
  overflow: hidden;

  &:hover {
    background-color: rgb(177, 229, 250);
  }
  .team-box {
    display: grid;
    grid-template-columns: 1fr 16px;
    column-gap: 10px;
    grid-auto-flow: column;
    .team-content {
      .team-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: -5px;
        margin-bottom: 5px;
        .team-title {
          font-weight: bold;
          font-size: 18px;
        }
      }
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
    .team-horus {
      color: rgb(30, 0, 255);
      font-size: 12px;
      display: flex;
      row-gap: 5px;
      flex-direction: column;
    }
  }
  .team-box-content {
    background-color: rgb(231, 248, 255);
    transition: 300ms;
    border-radius: inherit;
    margin: 15px 0 5px;
    padding: 0 10px;
    height: 0;
    overflow-y: hidden;
    &.active {
      overflow-y: auto;
      padding: 5px 10px;
      height: 260px;
    }
    .image-box {
      display: flex;
      flex-wrap: wrap;
      gap: 5px 10px;
      .img {
        width: 40px;
        border-radius: 5px;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.097);
        padding: 5px;
        &.un-used {
          width: 80px;
          background-color: #6db3f2;
        }
        &.used {
          background-color: rgba(128, 128, 128, 0.274);
          opacity: 0.5;
        }
      }
      &.used {
        justify-content: space-between;
      }
    }
    .image-introduce {
      font-size: 14px;
      .sub {
        font-size: 0.6rem;
      }
    }
  }
}
</style>
