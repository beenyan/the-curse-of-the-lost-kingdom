<template>
  <nav class="navbar navbar-light fixed-top border-bottom shadow-sm" style="background-color: #e3f2fd">
    <div class="container">
      <router-link to="/manage" class="rounter-link">遺落國度·金資塔的詛咒</router-link>
      <a href="/manageapi/logout" class="btn btn-outline-success my-1 btn-sm">登出</a>
    </div>
  </nav>
</template>

<style lang="scss">
.rounter-link {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  font-size: 14px;
  color: black;
  text-decoration: none;
  &:hover {
    color: initial;
  }
}
</style>
