<template>
  <!-- 自定义导航栏，参考：https://uniapp.dcloud.io/component/uniui/uni-nav-bar.html#%E4%BB%8B%E7%BB%8D -->
  <uni-nav-bar
    backgroundColor="transparent"
    color="#ddd"
    :border="false"
    leftWidth="400rpx"
    rightWidth="180rpx"
  >
    <view slot="left">
      <view class="flex-row ai-center">
        <text v-if="showBack" class="iconfont" @click="goBack">&#xe6e1;</text>
        <text class="title">{{ title }}</text>
      </view>
    </view>
    <view slot="right">
      <view class="btn flex-row ai-center">
        <view class="icon flex-center" :style="{ backgroundColor: config['theme-bg-color1'] }" @click="() => goToPage('notification')"
          ><text class="iconfont">&#xe8bd;</text></view
        >
        <view class="icon flex-center" :style="{ backgroundColor: config['theme-bg-color1'] }" @click="() => goToPage('customer')"
          ><text class="iconfont">&#xe61b;</text></view
        >
      </view>
    </view>
  </uni-nav-bar>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    showBack: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      config: {}
    };
  },
  created() {
    this.config = uni.getStorageSync('config');
  },
  methods: {
    goBack() {
			uni.navigateBack()
		},
		goToPage(page) {
			if(page == 'customer') {
				window.open(this.config.kefu)
				return false
			}
		  let pages = {
		    notification: "/pages/notification/index",
		    customer: `/pages/customer/index`,
		  };
		  uni.navigateTo({
		    url: pages[page],
		  });
		},
  },
};
</script>
<style lang='scss' scoped>
.title {
  font-size: 30rpx;
  font-weight: 600;
  margin-left: 10rpx;
}
.btn {
  position: absolute;
  top: 20rpx;
  right: 30rpx;
  .icon {
    font-size: 36rpx;
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 10rpx;
    box-shadow: 0 0 4px #ddd;
  }
}
</style>
