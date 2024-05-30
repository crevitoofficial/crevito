<template>
  <view class="page">
    <cus-header :showBack="false" :title="($t('tabbar.coin'))"></cus-header>
    <view class="content plr30">
      <view class="balance flex-col jc-between ai-center">
        <view class="title">{{$t('common.balance')}}</view>
        <view class="num"
          >{{ info.balance }}
          <text style="font-size: 30rpx; margin-left: 10rpx">{{ config.unit }}</text></view
        >
        <image
          style="width: 620rpx; margin-top: 60rpx"
          src="/static/images/coins.png"
          mode="widthFix"
        />
        <view class="income">
          <text style="margin-right: 10rpx">{{$t('coins.earn')}}: </text>
          <text>{{ info.today }} {{config.unit}} </text>
        </view>
        <view class="into flex-center cursor" :style="{ color: config['theme-btn-color'],backgroundColor: config['theme-btn-bgcolor'] }" @click="showTransfer">{{$t('coins.transfer_btn')}}</view>
      </view>
      <view class="record" :style="{ backgroundColor: config['theme-bg-color2'] }">
        <view class="title flex-center">{{$t('coins.table_title')}}</view>
        <view class="head flex-row">
            <view class="flex-1 flex-center">{{$t('coins.time')}}</view>
            <view class="flex-1 flex-center">{{$t('coins.quantity')}}</view>
            <view class="flex-1 flex-center">{{$t('coins.rate')}}</view>
        </view>
        <view v-if="info.list" class="list">
          <view
            class="item flex-row"
            v-for="(item, index) in info.list"
            :key="index"
          >
            <view class="flex-1 flex-center">{{item.create_time}}</view>
            <view class="flex-1 flex-center">{{item.account}}</view>
            <view class="flex-1 flex-center">{{item.rate}}</view>
          </view>
        </view>
        <view v-else class="flex-center" style="height: 400rpx;">
          {{$t('common.noData')}}
        </view>
      </view>
    </view>
     <uni-popup ref="popup" type="center">
      <view class="area" :style="{backgroundColor: config['theme-bg-color2'], color:config['theme-text-color']}">
        <view class="title flex-center">{{$t('coins.transfer')}}</view>
        <view class="param">
          <view class="label">{{`${$t('coins.transfer')} ${$t('coins.quantity')}` }}</view>
          <input
            class="input"
            :style="{color:config['theme-text-color']}"
            v-model="params.account"
            type="text"
            :placeholder="($t('common.enter_quantity'))"
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
        <view
            class="confirm flex-center"
            :style="{color: config['theme-btn-color'],backgroundColor:config['theme-btn-bgcolor']}"
            @click="submit"
        >{{$t('coins.confirm')}}</view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import { index, into } from "../../../api/coins";
import Validate from "../../../utils/validate";

export default {
  data() {
    return {
      config: {},
      info: {},
      params: {
        account: '',
        paypwd:''
      },
    };
  },
  created() {
    this.config = uni.getStorageSync("config");
    this.getIndex();
  },
  methods: {
    // 获取赚币信息
    getIndex() {
      index({}).then((res) => {
        this.info = res.data
      });
    },
    // 显示转入弹窗
    showTransfer() {
      this.$refs.popup.open();
    },
    // 提交申购
    submit() {
      let valid = new Validate();
      let result = valid.test({
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
      });
      if (result) {
        uni.showToast({
          title: result.errMsg,
          duration: 3000,
          icon: "none",
        });
      } else {
        into(this.params).then((res) => {
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
  padding-bottom: 180rpx;
  .content {
    margin-top: 30rpx;
    color: #ddd;
    .balance {
      width: 100%;
      color: #ddd;
      box-sizing: border-box;
      .title {
        font-size: 40rpx;
      }
      .num {
        margin-top: 10rpx;
        font-size: 60rpx;
        font-weight: bold;
      }
      .into {
        width: 400rpx;
        height: 70rpx;
        border-radius: 50rpx;
        color: #fff;
        margin-top: 30rpx;
      }
    }
    .record {
      width: 100%;
      margin-top: 40rpx;
      padding: 0 30rpx 20rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 40rpx;
      .title {
        font-size: 40rpx;
        font-weight: bold;
        padding: 20rpx 0;
        border-bottom: 1px solid #999;
      }
      .head {
        padding: 20rpx 0;
        border-bottom: 1px solid #999;
        font-weight: bold;
      }
      .num {
        width: 240rpx;
      }
      .rate {
        width: 140rpx;
      }
      .yuji {
        width: 200rpx;
      }
      .list {
        .item {
          font-size: 32rpx;
          color: #999;
          padding: 20rpx 0;
          border-bottom: 1px solid #999;
        }
        .item:last-child {
          border-bottom: none;
        }
      }
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
        border: 1px solid #999;
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
