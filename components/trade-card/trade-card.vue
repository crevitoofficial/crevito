<template>
  <view class="card" :style="{ backgroundColor: config['theme-bg-color1'], boxShadow: `0 0 10px ${config['theme-box-shadow']}` }">
    <view class="top flex-row ai-center jc-between">
      <view class="left flex-row ai-center">
        <image
          :src="info.logo"
          style="width: 50rpx; height: 50rpx; border-radius: 50%"
        />
        <text class="ml10" style="font-size: 30rpx; font-weight: bold">{{
          info.title
        }}</text>
      </view>
      <text class="right" :style="{ color: config['theme-text-color'] }">{{
        info.play_rate
      }}</text>
    </view>
    <view class="desc">
      <text
        >Investment range：{{ info.play_price }} - {{ info.max_price }}</text
      >
    </view>
    <view
      class="progress"
      :style="{
        backgroundColor: config['theme-bg-color2'],
      }"
    >
      <view
        class="percent"
        :style="{
          width: `${info.pro_gress}%`,
          backgroundColor: config['theme-text-color'],
        }"
      ></view>
    </view>
    <view class="bottom">
      <view class="type">
        <text class="title">Type：</text>
        <text>{{ info.play_type }}</text>
      </view>
      <view v-if="info.content" class="content">
        <rich-text :nodes="info.content"></rich-text>
      </view>
      <view class="circle">
        <view class="flex-row">
          <view
            class="time"
            :style="{
              backgroundColor: config['theme-btn2-bgcolor'],
              color: config['theme-btn2-color'],
            }"
            >{{ info.play_time }}</view
          >
        </view>
      </view>
    </view>
    <view
      class="btn flex-center"
      :style="{
        backgroundColor: config['theme-btn-bgcolor'],
        color: config['theme-btn-color'],
      }"
      @click="purchase(info)"
      >{{ $t("trades.purchase") }}</view
    >
  </view>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      config: {},
    };
  },
  created() {
    this.config = uni.getStorageSync("config");
  },
  methods: {
    purchase(info) {
      this.$emit('purchase', info)
    }
  },
};
</script>
<style lang='scss' scoped>
.card {
  color: #eee;
  background-color: #fff;
  margin-bottom: 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 0 10rpx #eee;
  .top {
    .right {
      font-size: 34rpx;
    }
  }
  .desc {
    margin-top: 20rpx;
    color: #999;
    font-size: 26rpx;
  }
  .progress {
    width: 100%;
    height: 18rpx;
    margin-top: 20rpx;
    border: 1px solid transparent;
    border-radius: 20rpx;
    .percent {
      width: 0;
      height: 100%;
      border-radius: 20rpx;
      transition: all 1s;
    }
  }
  .bottom {
    .title {
      font-weight: bold;
      color: #999;
      margin-bottom: 10rpx;
    }
    .type {
      color: #999;
      margin-top: 20rpx;
    }
    .content {
      margin-top: 20rpx;
    }
    .circle {
      margin-top: 20rpx;
      .time {
        padding: 14rpx 20rpx;
        background-color: #f00;
        border-radius: 6rpx;
      }
    }
  }
  .btn {
    width: 100%;
    height: 90rpx;
    border-radius: 10rpx;
    font-size: 32rpx;
    margin-top: 30rpx;
  }
}
</style>
