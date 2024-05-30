<template>
  <view class="page">
    <!-- 进入加载动画 -->
    <cus-loading v-if="showLoading"></cus-loading>
    <!-- 页面背景 -->
    <view class="page_bg" :style="{ backgroundColor: config['theme-bg-color'] }">
      <image
        v-if="config.homebg"
        style="width: 100%; height: 100%"
        :src="config.homebg"
      />
    </view>

    <home v-if="curTab == 0" @changeLang="changeLang" @getHomeDataFinish="hideLoading" @getConfig="getConfig" :key="key"></home>
    <game v-if="curTab == 1"></game>
   <!-- <trade v-if="curTab == 2" :reachBottomSign="reachBottomSign"></trade> -->
   <histroy v-if=" curTab == 2"></histroy>
   <record v-if="curTab == 3"></record>
   <!-- <coins v-if="curTab == 3"></coins> -->
    <mine v-if="curTab == 4" @changeLang="changeLangMine" :key="key"></mine>
    <cus-tabbar @change="changeTabbar" :currentTab="curTab" :key="key2"></cus-tabbar>
  </view>
</template>

<script>
import home from "./tabpage/home";
import game from "./tabpage/game";
import trade from "./tabpage/trade";
import coins from "./tabpage/coins";
import mine from "./tabpage/mine";
import histroy from "./tabpage/history";
import record from "./tabpage/record";

export default {
  components: {
    home,
    coins,
    game,
    trade,
    mine,
	histroy,
	record
  },
  data() {
    return {
      curTab: 0,
      config: {},
      langs: [],
      listHeight: 0,
      curLang: {},
      key: new Date().getTime(),
      key2: new Date().getTime()+'tab',
      reachBottomSign: 0,
      showLoading: true
    };
  },
  onLoad() {
    // 3秒后关闭加载动画
    setTimeout(() => {
      this.showLoading = false
    }, 3000)
  },
  onReachBottom() {
    this.reachBottomSign = new Date().getTime();
	if(this.curTab == 2){
		 uni.$emit('onReachBottomHistory');
	}
	if(this.curTab == 3){
		 uni.$emit('onReachBottomRecord');
	}
  },
  methods: {
    // 首页触发关闭加载动画
    hideLoading() {
      // this.showLoading = false
    },

    // 获取网站配置
    getConfig(config) {
      this.config = config
    },

    // 首页触发切换语言
    changeLang(lang) {
      this._i18n.locale = lang;
      this.key2 = new Date().getTime()+'tab'
      uni.setStorageSync("lang", lang);
    },

    // 我的页面哦触发切换语言
    changeLangMine(lang) {
      console.log(lang);
      this._i18n.locale = lang;
      this.key2 = new Date().getTime()+'tab'
      uni.setStorageSync("lang", lang);
    },

    // 切换tabbar
    changeTabbar(tab) {
      this.curTab = tab;
      this.$forceUpdate();
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  .page_bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }
}
</style>
