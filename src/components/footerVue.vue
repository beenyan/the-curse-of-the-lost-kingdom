<template>
  <footer class="text-center text-lg-start bg-light text-muted fixed-bottom footer">
    <div
      class="text-center foot-box d-flex justify-content-around align-items-center"
      style="background-color: #ebeced"
    >
      <div
        class="pivot-bar-item-tab"
        v-for="tool of toolList"
        :class="{ active: step === tool.step }"
        @click="$emit('update:step', tool.step)"
        :key="tool.step"
      >
        <button class="icon-state-filled">
          <font-awesome-icon :icon="tool.icon" />
        </button>
        <div class="pivot-bar-item-title">{{ tool.name }}</div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  toolList: Array,
  step: String,
});
defineEmits(['update:step']);
</script>

<style scoped lang="scss">
.pivot-bar-item-tab {
  padding: 2px 0;
  &.active {
    color: var(--bs-blue);

    .icon-state-filled {
      color: var(--bs-blue);
    }
  }

  .icon-state-filled {
    font-size: 18px;
    outline: none;
    border: none;
  }

  .pivot-bar-item-title {
    font-size: 12px;
  }
}
</style>
