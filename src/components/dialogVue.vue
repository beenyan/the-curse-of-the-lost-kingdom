<template>
  <div class="dialog" ref="dialog" :class="{ active: isActive }">
    <div class="dialog-background">
      <div class="dialog-box" @click.self="close">
        <div class="dialog-content">
          <div class="dialog-header">
            <div class="dialog-title"><slot name="header"></slot></div>
          </div>
          <div class="dialog-body"><slot name="body"></slot></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { isActive: false };
  },
  methods: {
    open() {
      this.isActive = true;
    },
    close() {
      this.isActive = false;
    },
  },
};
</script>

<style scoped lang="scss">
$transition_duration: 300ms;
.dialog {
  z-index: 100000;
  pointer-events: none;
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  .dialog-background {
    width: inherit;
    height: inherit;
    transition: $transition_duration linear;
    .dialog-box {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 24px;
      width: inherit;
      height: inherit;
      .dialog-content {
        position: relative;
        width: inherit;
        max-height: calc(100vh - 48px);
        border-radius: 4px;
        background-color: #fff;
        overflow-y: auto;
        max-width: 560px;
        box-shadow: 0 2px 4px -1px #0003, 0 4px 5px #00000024, 0 1px 10px #0000001f;
        transition: transform $transition_duration;
        transform: scale(0) rotateZ(90deg);
        .dialog-header {
          padding: 16px;
          .dialog-title {
            font-size: 1.25rem;
            font-weight: 900;
            line-height: 2rem;
            letter-spacing: 0.0125em;
          }
        }
        .dialog-body {
          font-size: 14px;
          padding: 0 16px 16px;
        }
      }
    }
  }
  &.active {
    pointer-events: unset;
    .dialog-background {
      background-color: #00000066;
      .dialog-content {
        transform: scale(1) rotateZ(0);
      }
    }
  }
}
</style>
