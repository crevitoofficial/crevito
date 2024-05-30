<template>
  <view class="page">
    <cus-header :title="($t('common.customer'))"></cus-header>
    <!-- 页面背景 -->
    <view class="page_bg" :style="{ backgroundColor: config['theme-bgcolor'] }">
      <image
        v-if="config.homebg"
        style="width: 100%; height: 100%"
        :src="config.homebg"
      />
    </view>
    <view
      class="flex-row jc-between ai-center list"
      v-for="item in customerList"
      :key="item.id"
      @click="() => goToUrl(item.url)"
    >
      <image :src="item.header" mode="aspectFill" class="kefu-img" />
      <view class="flex-col jc-around ai-center" style="width: 480rpx">
        <view class="flex-row jc-between ai-center" style="width: 100%">
          <text class="kefu-name">{{ item.username }}</text>
          <text class="kefu-time">{{ item.btime }}-{{ item.etime }}</text>
        </view>
        <view
          :class="[
            'flex-row',
            'jc-between',
            'ai-center',
            'kefu-status',
            item.status == 1 ? 'online' : '',
          ]"
          :style="{ color: item.status == 1 ? config['theme-color1'] : '' }"
        >
          <view class="flex-row jc-start ai-center">
            <image
              src="/static/images/kefu.png"
              mode="aspectFill"
              class="kefu-img2"
            />
            <text style="font-size: 34rpx; color: #666">{{
              item.telegram
            }}</text>
          </view>
          <text>{{ item.status == 1 ? "on-line" : "off-line" }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      config: {},
      customerList: [],
    };
  },
  onLoad() {
    this.config = uni.getStorageSync("config");
  },
  onShow() {},
  methods: {
    getCustomerFn() {
      // getKefu({}).then((res) => {
      //   if (res.code == 1) {
      //     this.customerList = res.data;
      //   }
      // });
    },
    goToUrl(url) {
      if (url == "") {
        uni.showToast({
          icon: "none",
          title: "Customer service link not found",
        });
        return;
      }
      // #ifdef H5
      location.href = url;
      // #endif
      // #ifdef APP-PLUS
      uni.navigateTo({
        url: `/pages/other/index?url=${url}`,
      });
      // #endif
    },
  },
};
</script>
<style lang='scss' scoped>
.page {
  .page_bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }
  .kefu-img {
    width: 130rpx;
    height: 130rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
  }
  .kefu-img2 {
    width: 40rpx;
    height: 40rpx;
    margin-right: 12rpx;
  }
  .kefu-icon {
    font-size: 48rpx;
    color: #000000;
    padding-right: 10px;
  }
  .kefu-name {
    font-size: 32rpx;
    color: #000000;
    font-weight: 600;
  }
  .kefu-time {
    font-size: 34rpx;
    color: #000000;
  }
  .kefu-status {
    width: 100%;
    margin-top: 20rpx;
    font-size: 38rpx;
    color: #666;
  }
  .kefu-status.online {
    // color: $theme-color2;
    font-weight: 600;
  }
}
</style>
