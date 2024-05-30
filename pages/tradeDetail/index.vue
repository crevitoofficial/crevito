<template>
  <view class="page">
    <cus-header :title="($t('trades.detail'))"></cus-header>
    <!-- 页面背景 -->
    <view class="page_bg" :style="{ backgroundColor: config['theme-bg-color'] }">
      <image
        v-if="config.homebg"
        style="width: 100%; height: 100%"
        :src="config.homebg"
      />
    </view>
    <!-- 页面内容 -->
    <view class="content">
      <image class="banner" :src="goods.logo" mode="widthFix" />
      <view class="info" :style="{backgroundColor: config['theme-bg-color2'],color:config['theme-text-color']}">
        <view class="item"
          >{{ $t('trades.product_name') }}：{{ goods.title }}</view
        >
        <view class="item"
          >{{ $t('trades.min_investment') }}：{{ goods.play_price }}</view
        >
        <view class="item"
          >{{ $t('trades.max_investment') }}：{{ goods.max_price }}</view
        >
        <view class="item"
          >{{ $t('trades.total_investment') }}：{{ goods.pro_amount }}</view
        >
        <view class="item"
          >{{ $t('trades.daily_dividend') }}：{{ goods.play_rate}}</view
        >
        <view class="item"
          >{{ $t('trades.dividend_duration') }}：{{ goods.play_time }}</view
        >
        <view class="item"
          >{{ $t('trades.purchase_restrictions') }}：{{goods.can_buy}}</view
        >
        <view class="item"
          >{{ $t('trades.project_progress') }}：{{ goods.pro_gress }}%</view
        >
        <view class="progress" :style="{borderColor: config['theme-text-color']}">
          <view
            class="percent"
            :style="{ width: `${goods.pro_gress}%`, backgroundColor: config['theme-text-color']}"
          ></view>
        </view>
      </view>
      <view class="info" :style="{backgroundColor: config['theme-bg-color2'],color:config['theme-text-color']}">
        <view class="title" :style="{color:config['theme-text-color']}">{{$t('trades.project_content')}}</view>
        <rich-text :nodes="goods.content"></rich-text>
      </view>
      <view class="logbtn flex-center" :style="{color: config['theme-btn-color'],backgroundColor: config['theme-btn-bgcolor']}" @click="showBuy">{{
        isLogin ? $t('trades.purchase') : $t('common.login_tip')
      }}</view>
    </view>
    <uni-popup ref="popup" type="center">
      <view class="area" :style="{backgroundColor: config['theme-bg-color2'],color:config['theme-text-color']}">
        <view class="title flex-center">{{$t('trades.purchase')}}</view>
        <view class="param">
          <view class="label">{{$t('trades.purchase_quantity')}}</view>
          <input
            class="input"
            :style="{color:config['theme-text-color']}"
            v-model="params.buy_account"
            type="text"
            :placeholder="($t('trades.enter_purchase'))"
          />
        </view>
        <view class="param">
          <view class="label">{{$t('common.payment_password')}}</view>
          <input
            class="input"
            :style="{color:config['theme-text-color']}"
            type="password"
            v-model="params.paypwd"
            :placeholder="($t('common.enter_password'))"
          />
        </view>
        <view class="confirm flex-center" :style="{color: config['theme-btn-color'],backgroundColor: config['theme-btn-bgcolor']}" @click="submit">
          {{$t('trades.confirm')}}
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import { info } from "../../api/good";
import { good_dobuy } from "../../api/mine";
import Validate from "../../utils/validate";

export default {
  data() {
    return {
      config: {},
      id: "",
      isLogin: false,
      params: {
        good_id: "",
        buy_account: "",
        paypwd: "",
      },
      goods: []
    };
  },
  onLoad(option) {
    this.config = uni.getStorageSync("config");
    this.isLogin = uni.getStorageSync('token') ? true : false;
    this.id = option.id;
    this.getGoodInfo()
  },
  methods: {
    // 获取产品信息
    getGoodInfo() {
      info({id: this.id}).then((res) => {
        this.goods = res.data
      });
    },
    // 显示购买弹窗
    showBuy() {
      if(this.isLogin) {
        this.$refs.popup.open();
      } else {
        uni.reLaunch({
           url: '/pages/login/index'
        });
      }
    },
    // 提交申购
    submit() {
      this.params.good_id = this.id;
      let valid = new Validate();
      let result = valid.test({
        buy_account: [
          {
            rule: "isRequired",
            value: this.params.buy_account,
            message: this.$t("trades.valid_quatity"),
          },
          {
            rule: "isNumber",
            value: this.params.buy_account,
            message: this.$t("trades.valid_quatity2"),
          },
        ],
        paypwd: [
          {
            rule: "isRequired",
            value: this.params.paypwd,
            message: this.$t("trades.valid_paypwd"),
          },
        ],
      });
      if (result) {
        uni.showToast({
          title: result.errMsg,
          duration: 3000,
          icon: "none",
        });
      } else {
        good_dobuy(this.params).then((res) => {
          if (res.code == 1) {
            uni.showToast({
              title: res.msg,
              duration: 2000,
            });
            this.$refs.popup.close();
          }
        });
      }
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
    padding-bottom: 280rpx;
    .banner {
      width: 100%;
    }
    .info {
      margin: 60rpx 20rpx 0;
      font-size: 30rpx;
      padding: 30rpx 20rpx;
      border-radius: 14rpx;
      .title {
        font-size: 34rpx;
        margin-bottom: 30rpx;
      }
      .item {
        margin-bottom: 20rpx;
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
    }
    .logbtn {
      position: fixed;
      bottom: 120rpx;
      left: 3%;
      border-radius: 14rpx;
      font-size: 30rpx;
      width: 94%;
      height: 90rpx;
      z-index: 10;
    }
  }
  .area {
    width: 600rpx;
    overflow: hidden;
    padding: 20rpx;
    border-radius: 20rpx;
    box-sizing: border-box;
    .title {
      font-size: 32rpx;
      font-weight: bold;
      padding: 10rpx 0;
      margin-bottom: 30rpx;
    }
    .param {
      margin-bottom: 50rpx;
      .label {
        margin-bottom: 10rpx;
      }
      .input {
        width: 100%;
        height: 100rpx;
        border-radius: 10rpx;
        border: 1px solid #eee;
        margin-bottom: 20rpx;
        padding: 0 30rpx;
        box-sizing: border-box;
      }
    }
    .confirm {
      border-radius: 14rpx;
      font-size: 30rpx;
      width: 300rpx;
      height: 70rpx;
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
