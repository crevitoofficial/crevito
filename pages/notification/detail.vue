<template>
  <view class="page">
    <cus-header :title="$t('mine.note_detail')"></cus-header>
    <!-- 页面背景 -->
    <view class="page_bg" :style="{ backgroundColor: config['theme-bg-color'] }">
      <image
        v-if="config.homebg"
        style="width: 100%; height: 100%"
        :src="config.homebg"
      />
    </view>
    <view class="content plr30">
      <view
        class="body flex-col ai-start"
         :style="{ backgroundColor: config['theme-bg-color2'] }"
      >
        <text style="font-size: 44rpx; color: #ddd; font-weight: 600">
          {{ detailInfo.title }}
        </text>
<!--        <text v-if="detailInfo.name" style="font-size: 26rpx; color: #ddd;margin-top: 20rpx;">-->
<!--          发布者：{{ detailInfo.name }}-->
<!--        </text>-->
        <text v-if="detailInfo.create_time" style="font-size: 26rpx; color: #ddd;margin-top: 20rpx;">
          创建时间：{{ detailInfo.create_time }}
        </text>
        <view style="margin-top: 20rpx;">
          <rich-text :nodes="detailInfo.content"></rich-text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { info } from "../../api/show";
export default {
  data() {
    return {
      config: {},
      id: "",
      detailInfo: {},
    };
  },
  onLoad(option) {
    this.config = uni.getStorageSync("config");
    this.id = option.id;
    this.getDetail();
  },
  methods: {
    getDetail() {
      info({ id: this.id }).then((res) => {
        this.detailInfo = res.data;
      });
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
  .content {
    margin-top: 30rpx;
    color: #999;
    .body {
      width: 100%;
      padding: 30rpx;
      box-sizing: border-box;
      border-radius: 20rpx;
    }
  }
}
</style>


