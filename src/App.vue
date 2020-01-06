<template>
  <div id="app" :class="[theme_class==='simplicity-white'?'simplicity-wrapper':theme_class==='fall-wrapper'?'fall-wrapper':theme_class==='eye_care_wrapper'?'eye_care_wrapper':'']">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import store from './store/index'
import vueToast from './components/vueToast/vueToast'
import {addClass, removeClass} from '@/utils'
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {vueToast},
  data () {
    return {
      isRouterAlive: true,
      theme_class: 'simplicity-black'
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    }
  },
  computed: {
    getTheme () {
      return this.$store.state.theme
    }
  },
  created () {
    if (window.localStorage.getItem('theme')) {
      this.theme_class = window.localStorage.getItem('theme')
    }
  },
  watch: {
    $route (to, from) {
      if (to.query.go) {
        store.commit('flagActive', to.query.go)
      }
      if (this.Cookies.get('info') === '' || !this.Cookies.get('info')) {
        if (to.path === '/userInfo' || to.path === '/yunManage' || to.path === '/userSet' || to.path === '/integralRank' || to.path === '/integralDetailed' || to.path === '/coinDetailed' || to.path === '/moderator' || to.path === '/inviteFriends') {
          store.commit('flagLogin', true)
        }
      } else {
        if (to.path === '/moderator') {
          if (!JSON.parse(this.Cookies.get('info')).is_moderator) {
            this.$router.push('/home')
          }
        }
      }
    },
    getTheme (val) {
      if (val) {
        this.theme_class = val === 'simplicity-white' ? 'simplicity-white' : val === 'fall-wrapper' ? 'fall-wrapper' : val === 'eye_care_wrapper' ? 'eye_care_wrapper' : val === 'sidebar_wrapper' ? 'simplicity-white' : ''
        if (val === 'fall-wrapper') {
          addClass(document.body, 'fall-body')
        } else {
          removeClass(document.body, 'fall-body')
        }
        if (val === 'simplicity-white' || val === 'simplicity-black') {
          addClass(document.body, 'simplicity-body')
        } else {
          removeClass(document.body, 'simplicity-body')
        }
        if (val === 'eye_care_wrapper') {
          addClass(document.body, 'eye_care_body')
        } else {
          removeClass(document.body, 'eye_care_body')
        }
      } else {
        this.theme_class = 'simplicity-black'
      }
    }

  }

}
</script>
