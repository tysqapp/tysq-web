<template>
  <div class="container main-container">
    <div class="no_passage">
      <p><img src="../../../static/images/diushi.png" height="70" width="70" alt=""></p>
      <p class="fs-16 text-999">文章不存在,在看看别的吧!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style scoped>
  .no_passage{
    background: #ffffff;
    height: calc(100vh - 150px);
    padding-top: 100px;
    margin-top: 0;
    width: 100%;
    text-align: center;
  }
</style>
