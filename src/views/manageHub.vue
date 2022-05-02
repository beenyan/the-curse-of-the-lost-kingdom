<template>
  <NavbarVue />

  <div class="d-flex flex-wrap mb-4 content-box" style="justify-content: space-around">
    <router-link
      class="block mb-3 link-box"
      v-for="linkBox of linkBoxList"
      :disabled="linkBox.href === ''"
      :key="linkBox.name"
      :to="linkBox.href"
    >
      <div class="link-body" v-if="linkBox.icon">
        <div class="font-icon">
          <font-awesome-icon :icon="linkBox.icon" />
        </div>
        <p class="m-0">{{ linkBox.name }}</p>
      </div>
    </router-link>
  </div>

  <!-- <div class="tool-box" :class="{ active: isOpen }" id="tool">
    <div class="tool-header">
      <div class="tool" @click="change('qrcode')"><font-awesome-icon icon="video" /></div>
    </div>
    <div class="tool-content-box">
      <div class="tool-content">
        <div class="tool-title">Qrcode</div>

        <div class="tool-qrcode">
          <qrcode-stream ref="qrcode" @decode="onDecode"></qrcode-stream>
        </div>

        <div class="tool-data"></div>
      </div>
    </div>
  </div> -->
</template>

<script setup>
import { RouterLink } from 'vue-router';

import { ref } from 'vue';
import NavbarVue from '../components/navbarVue.vue';

const linkBoxList = ref([
  {
    href: '/manage/user',
    icon: 'users',
    name: '人員管理',
  },
  {
    href: '/manage/team',
    icon: 'flag',
    name: '隊伍管理',
  },
  {
    href: '/manage/progress',
    icon: 'chart-simple',
    name: '進度',
  },
  {
    href: '',
    icon: '',
    name: '',
  },
  {
    href: '',
    icon: '',
    name: '',
  },
  {
    href: '',
    icon: '',
    name: '',
  },
]);
</script>

<style lang="scss">
:root {
  --block-bgc1: #da4452;
  --block-bgc2: #4a8add;
  --block-bgc3: #8cc051;
  --block-bgc4: #967bdd;
  --block-bgc5: #ab8f68;
  --block-bgc6: #f7bb42;
}

$norm-height: 56px;

@mixin size($w, $h: $w) {
  width: $w;
  height: $h;
}

body,
html {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  // overflow-y: hidden;
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

body {
  padding-top: $norm-height + 16px;
}

.block {
  display: inline-block;
  width: 46%;
  height: 95px;
  border-radius: 15px;
}

.font-icon {
  padding: 0;
}

.link-box {
  text-decoration: none;

  .link-body {
    width: 100%;
    height: 100%;
    padding: 20px 20px 10px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    p {
      font-weight: bold;
    }
  }

  * {
    color: #212529;
  }
}

.tool-box {
  $tool-margin: 5px;
  $content-height: calc(100vh - #{$norm-height} - #{$tool-margin});

  bottom: calc(#{$content-height} * -1);
  width: 100%;
  position: fixed;
  transition: 300ms;
  padding: 5px;

  &.active {
    background-color: #21252945;
    bottom: calc(#{$norm-height} * -2);

    .tool-content-box {
      padding-top: 0;
    }

    .tool-header .tool::before {
      border: none;
      background: linear-gradient(to right, red, orange);
      animation-play-state: running;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(360deg);
    }
  }

  .tool-header {
    height: $norm-height;
    display: flex;
    justify-content: center;
    align-items: center;

    .tool {
      position: relative;
      box-sizing: border-box;
      @include size($norm-height - 10);
      transition: 200ms;
      font-size: 24px;
      margin: $tool-margin;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #98d0f1;
      border-radius: 50%;
      background-clip: padding-box;
      border: solid 2px transparent;
      cursor: pointer;

      &:hover {
        background-color: #57bbf5;

        &::before {
          border-color: #609eee;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        @include size($norm-height - 10);
        border-radius: inherit;
        z-index: -1;
        margin: -2px;
        border: 3px solid #82b8ff;
        animation: rotate 1s linear forwards infinite;
        animation-play-state: paused;
      }
    }
  }

  .tool-content-box {
    height: $content-height;
    transition: 300ms;

    .tool-content {
      font-family: arial;
      text-align: center;
      font-weight: bold;
      font-size: 36px;
      border-radius: 5px;
      padding: 48px 10px 5px 10px;
      height: 90%;
      background-color: #fff;
    }

    .tool-qrcode {
      width: 100%;
      height: 250px;
    }
  }
}

.qrcode-stream-camera {
  border-radius: 8px;
}

@for $i from 1 through 6 {
  .link-box:nth-child(#{$i}) {
    background-color: var(--block-bgc + $i);
  }
}

[disabled='true'] {
  pointer-events: none;
  opacity: 0.5;
}
</style>
