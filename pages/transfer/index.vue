<template>
  <view class="page">
    <cus-header :title="$t('mine.transfer')"></cus-header>
    <!-- 页面背景 -->
    <view
      class="page_bg"
      :style="{ backgroundColor: config['theme-bg-color'] }"
    >
      <image
        v-if="config.homebg"
        style="width: 100%; height: 100%"
        :src="config.homebg"
      />
    </view>
    <uni-card
      class="container"
      :border="false"
      shadow="0px 0px 3px 1px rgba(0, 0, 0, 0)"
      :style="{ backgroundColor: config['theme-bg-color2'] }"
    >
      <view class="flex-row ai-center jc-between">
        <view class="abox flex-col ai-center jc-center">
          <view class="rtx-title">{{ $t("transfer.promotion") }}</view>
          <view class="anum" :style="{ color: config['theme-text-color'] }">
            {{ info.commission && info.commission.account }}
          </view>
          <text>{{ config.unit }}</text>
        </view>
        <text class="iconfont" :style="{ color: config['theme-text-color'] }"
          >&#xe691;</text
        >
        <view class="abox flex-col ai-center jc-center">
          <view class="rtx-title">{{ $t("transfer.base") }}</view>
          <view class="anum" :style="{ color: config['theme-text-color'] }">
            {{ info.basic && info.basic.account }}
          </view>
          <text>{{ config.unit }}</text>
        </view>
      </view>
      <view class="form">
        <!-- 自定义表单校验 -->
        <view class="item flex-row ai-center">
          <input
            v-model="params.account"
            class="input flex-1"
            :style="{ color: config['theme-text-color'] }"
            type="number"
            placeholder-style="color: #bbb;"
            :placeholder="$t('transfer.placeholder1')"
          />
        </view>
        <view class="item flex-row ai-center">
          <input
            v-model="params.paypwd"
            class="input flex-1"
            :style="{ color: config['theme-text-color'] }"
            type="password"
            placeholder-style="color: #bbb;"
            :placeholder="$t('transfer.placeholder2')"
          />
        </view>
        <view
          class="btn flex-center"
          :style="{
            color: config['theme-btn-color'],
            backgroundColor: config['theme-btn-bgcolor'],
            marginTop: '100rpx',
          }"
          @click="confirmTransfer"
          >{{ $t("common.submit") }}</view
        >
      </view>
    </uni-card>
  </view>
</template>
<script>
import Validate from "../../utils/validate";
import { transfer } from "../../api/mine";
import { index } from "../../api/withdrawal";

export default {
  data() {
    return {
      config: {},
      info: {},
      params: {
        account: "",
        paypwd: "",
      },
    };
  },
  onLoad() {
    this.config = uni.getStorageSync("config");
    this.refreshAccount();
  },
  methods: {
    getIndex() {
      index({}).then((res) => {
        this.info = res.data;
      });
    },
    confirmTransfer() {
      let valid = new Validate();
      let validParams = {
        account: [
          {
            rule: "isRequired",
            value: this.params.account,
            message: this.$t("transfer.valid_quatity"),
          },
          {
            rule: "isNumber",
            value: this.params.account,
            message: this.$t("transfer.valid_quatity2"),
          },
        ],
        paypwd: [
          {
            rule: "isRequired",
            value: this.params.paypwd,
            message: this.$t("transfer.valid_paypwd"),
          },
        ],
      };

      let result = valid.test(validParams);
      if (result) {
        uni.showToast({
          title: result.errMsg,
          duration: 3000,
          icon: "none",
        });
      } else {
        transfer(this.params)
          .then((res) => {
            this.refreshAccount();
            uni.showToast({
              title: this.$t("common.set_success"),
            });
            this.params = {
              paypwd: "",
              account: "",
            };
          })

          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 刷新账户
    refreshAccount() {
      this.getIndex();
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
}
.container {
  border-radius: 50rpx;
  .abox {
    background-color: #fff;
    border-radius: 20rpx;
    width: 280rpx;
    height: 200rpx;
    .anum {
      font-weight: bold;
      font-size: 36rpx;
      margin: 10rpx 0;
    }
  }
  .rtx-wrapper {
    margin-top: 30rpx;
    position: relative;

    .icon-arrow {
      position: absolute;
      top: 90rpx;
      left: 285rpx;
      width: 70rpx;
      height: 70rpx;
      z-index: 100;
    }
    .uni-card {
      border-radius: 40rpx;
      margin: 0;
      text-align: center;

      .rtx-title {
        margin-bottom: 20rpx;
        font-size: 24rpx;
      }
      .text-rtx {
        font-size: 30rpx;
        margin-top: 20rpx;
        display: inline-block;
      }
    }
  }

  .form {
    margin-top: 40rpx;
    .item {
      width: 100%;
      height: 90rpx;
      background-color: rgba(170, 69, 69, 0.1);
      border-radius: 90rpx;
      padding: 20rpx 30rpx;
      margin-top: 26rpx;
      box-sizing: border-box;
      .input {
        height: 100%;
        color: #333;
      }
    }
    .btn {
      width: 100%;
      height: 90rpx;
      border-radius: 90rpx;
      background-color: #669288;
      color: #fff;
      font-weight: bold;
      margin-top: 26rpx;
    }
    .uni-forms-item__content {
      border-radius: 20rpx !important;
      background-color: #fff;
    }
    .btn {
      height: 70rpx;
      border-radius: 70rpx;
      margin: 60rpx 0;
      color: #fff;
    }
  }
}
</style>


