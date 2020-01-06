<template>
  <div class="wrap"  v-if="showWrap" :class="{'fadein':showContent,'fadeout':!showContent,'wrap-success':showType==='success','wrap-error':showType==='error','wrap-warning':showType==='warning','wrap-common':showType==='common'}">{{text}}</div>
</template>

<style scoped>
  .wrap{
    position: fixed;
    left: 50%;
    top:120px;
    background: rgba(0,0,0,.5);
    padding: 12px 60px;
    border-radius: 4px;
    transform: translate(-50%,-50%);
    z-index: 99999;
  }
  .wrap-success{
    background:rgba(47,155,80,0.2);
    color: #2F9B50;
  }
  .wrap-error{
    background:#fef0f0;
    color:#ff0000;
    border: 1px solid #ffcccc;
  }
  .wrap-warning{
    background:#fdf6ec;
    border: 1px solid #ffc281;
    color: #ff8400;
  }
  .wrap-common{
    background: rgba(0,0,0,.5);
    color:#fff;
  }
  @media only screen and(max-width: 768px) {
    .wrap {
      padding: 10px 20px;
    }
  }
  .fadein {
    animation: animate_in 0.25s;
    display: inline-block;
  }
  .fadeout {
    animation: animate_out 0.25s;
    display: none;
  }
  @keyframes animate_in {
    0% {
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
  @keyframes animate_out {
    0% {
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
  }
</style>
