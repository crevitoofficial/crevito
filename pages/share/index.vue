<template>
  <view class="page">
    <cus-header :title="($t('mine.share'))"></cus-header>
    <!-- 页面背景 -->
    <view class="page_bg" :style="{ backgroundColor: config['theme-bg-color'] }">
      <image
        v-if="config.homebg"
        style="width: 100%; height: 100%"
        :src="config.homebg"
      />
    </view>
    <view class="flex-center-col">
      <view class="share-wrapper flex-center-col">
        <view class="img-wrapper">
          <image v-if="shareInfo.invite_code_img" mode="aspectFill" :src="shareInfo.invite_code_img" />
        </view>
        <view class="desc">
          <view class="title">{{ $t('share.share_title') }}</view>
          <view class="content">{{ $t('share.share_content') }}</view>
        </view>
      </view>
      <view class="section flex-1" :style="{ backgroundColor: config['theme-bg-color2']}">
        <view class="share">
          <view class="wrap flex-row ai-center">
            <input
                v-model="shareInfo.invite_code_url"
                class="input flex-1"
                type="text"
                disabled=""
            />
            <view class="btn flex-center" :style="{color: config['theme-btn-color'],backgroundColor: config['theme-btn-bgcolor']}" @click="copyFn">{{ $t('share.copy') }}</view>
          </view>
          <view
              class="tips flex-row ai-center jc-between"
              @click="goToPage('Team')"
          >
            <view class="left">
              <view style="font-size: 32rpx; font-weight: bold">
                {{ $t('share.desc_title') }}
              </view>
              <view style="font-size: 24rpx; color: #999">
                {{ $t('share.desc_content') }}
              </view>
            </view>
            <view class="right flex-center" :style="{color: config['theme-btn-color'],backgroundColor: config['theme-btn-bgcolor']}">
              <text class="iconfont">&#xe6c0;</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import * as share from '../../api/share'


export default {
  data() {
    return {
      config: {},
      shareInfo: {
        invite_code_url: ''
      }
    }
  },
  onLoad() {
    this.config = uni.getStorageSync('config')
    this.getShareFn();
  },
  onShow() {

  },
  methods: {
    getShareFn() {
      share.index({}).then((res) => {
        if (res.code == 1) {
          this.shareInfo = res.data;
        }
      });
    },
    goToPage(page) {
      let pages = {
        Notification: "/pages/notification/index",
        customer: "/pages/customer/index",
        Team: "/pages/team/index",
      };
      uni.navigateTo({
        url: pages[page],
      });
    },
    copyFn() {
      let _this = this
      uni.setClipboardData({
        data: this.shareInfo.invite_code_url,
        success: function () {
          uni.showToast({
            icon: "none",
            title: _this.$t('share.copy_msg'),
          });
        },
      });
    }
  }
}
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
}

.share-wrapper{
  .img-wrapper{
    width: 360rpx;
    height: 360rpx;
    padding: 30rpx;

    image{
      width: 100%;
      height: 100%;
    }
  }
  .desc{
    width: 100vw;
    text-align: center;
    color: #ddd;
    .title{
      font-size: 60rpx;
      font-weight: bold;
    }
  }
}

.section {
  width: calc(100vw - 50rpx);
  margin-top: 100rpx;
  padding: 60rpx 30rpx;
  border-radius: 40rpx;
  box-sizing: border-box;
  .share {
    width: 100%;
    background-color: #fff;
    color: #333;
    border-radius: 40rpx;
    padding: 30rpx;
    box-sizing: border-box;
    .wrap {
      height: 70rpx;
      border-radius: 70rpx;
      .input {
        height: 100%;
        padding: 0 20rpx;
        border: 1px solid #ddd;
        border-radius: 35rpx 0 0 35rpx;
        box-sizing: border-box;
        border-right: 0;
      }
      .btn {
        width: 160rpx;
        height: 100%;
        // background-color: $theme-btn-color;
        color: #fff;
        border-radius: 0 35rpx 35rpx 0;
      }
    }
    .tips {
      margin-top: 20rpx;
      .right {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        // background-color: #f6e4e5;
        // color: $theme-color2;
        font-size: 40rpx;
      }
    }
  }
}
</style>


