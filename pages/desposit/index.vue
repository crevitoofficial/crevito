<template>
  <view class="page">
    <cus-header :title="($t('mine.desposit'))"></cus-header>
    <!-- 页面背景 -->
    <view class="page_bg" :style="{ backgroundColor: config['theme-bg-color'] }">
      <image
          v-if="config.homebg"
          style="width: 100%; height: 100%"
          :src="config.homebg"
      />
    </view>
    <view class="content">
      <view class="flex-center-col head">
        <view class="qrwrap flex-center">
          <image style="width: 100%; height: 100%" :src="info.qrcode"></image>
        </view>
        <text class="qrdes" :style="{ color: config['theme-text-color2'] }"
        >{{ $t('mine.address') }}
        </text
        >
        <uni-countdown
            v-if="showTime && !isTimeup"
            :color="config['theme-text-color2']"
            :splitorColor="config['theme-text-color2']"
            @timeup="countdownUp"
            :fontSize="40"
            :show-day="false"
            :hour="time[0]"
            :minute="time[1]"
            :second="time[2]"
        ></uni-countdown>
        <view v-if="isTimeup" class="timetip"
        >{{ $t('mine.refresh_tip') }}
        </view
        >
        <view style="font-size: 36rpx; font-weight:bold;">{{curType.name}}</view>
      </view>
      <view
          class="content"
          :style="{ backgroundColor: config['theme-bg-color2']}"
      >
        <view
            class="amount flex-center"
            :style="{ color: config['theme-text-color2'] }"
        >
          <text style="margin-right: 10rpx">{{$t('common.quantity')}}:</text>
          <text class="anum">{{ info.account }}</text>
          <text class="iconfont" style="font-size: 40rpx" @click="copyQuantity">&#xe615;</text>
        </view>
        <view class="wrap flex-row ai-center">
          <input
              :value="info.address"
              class="input flex-1"
              type="text"
              disabled
          />
          <view
              class="btn flex-center"
              :style="{color: config['theme-btn-color'],backgroundColor: config['theme-btn-bgcolor']}"
              @click="copyFn"
          >
            {{$t('share.copy')}}
          </view>
        </view>
        <view class="tips flex-col" :style="{color: config['theme-text-color2']}">
          <text v-for="(item, index) in info.text" :key="index">
            {{index+1}}. {{item }}
          </text>
          <!-- <text>
            {{ $t('mine.refresh_tip') }}
          </text> -->
        </view>
        <view v-if="record" class="record">
          <view class="list">
            <view class="item">
              <view class="flex-row ai-center" style="margin-bottom: 10rpx">
                {{$t('common.quantity')}}：{{ record.account }}
              </view>
              <view class="flex-row ai-center">
                {{$t('common.time')}}：{{ record.create_time }}
              </view>
            </view>
          </view>
        </view>
        <view
            v-if="info.iscompleted == 1"
            class="confirm flex-center"
            :style="{color: config['theme-btn-color'],backgroundColor: config['theme-btn-bgcolor']}"
            @click="submit"
        >
          {{ $t('mine.desposit_completed') }}
        </view>
      </view>
    </view>
    <view v-if="showAlert" class="alert flex-center">
      <view class="alert-content" :style="{backgroundColor: config['theme-bg-color2'], color:config['theme-text-color']}">
        <view class="title">{{$t('mine.desposit_quantity')}}</view>
        <view class="select flex-row ai-center" @click="showType">
          <view
              class="flex-1"
              :style="{
              color: params.coin_type ? config['theme-text-color'] : '#999',
            }"
          >{{ params.coin_type || $t('mine.select_type') }}
          </view>
          <uni-icons type="bottom" size="20" color="#999"></uni-icons>
          <view
              class="list"
              :style="{
              height: listHeight + 'rpx',
            }"
          >
            <view
                class="item flex-row ai-center"
                v-for="(item, index) in types"
                :key="index"
                @click.stop="chooseType(item)"
            >{{ item.value }}
            </view
            >
          </view>
        </view>
        <view v-if="curType.maket > 0" style="color: #999;padding-top: 10rpx;">{{curType.text}}</view>
        <input
            class="input"
            v-model="params.account"
            type="text"
            :style="{ color: config['theme-text-color'] }"
            placeholder-style="color: #999;"
            :placeholder="($t('mine.enter_recharge'))"
        />
        <view class="btns flex-row jc-around ai-center">
          <view
              class="btn"
              :style="{color: config['theme-btn-color'],backgroundColor: config['theme-btn-bgcolor']}"
              @click="submitQuantity"
          >
            {{$t('common.submit')}}
          </view>
        </view>
        <view class="back" @click="back">
          <uni-icons type="closeempty" size="20" color="#999"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import {index, neworder, getrecharge, completed} from "../../api/recharge";

let timer = null;

export default {
  data() {
    return {
      config: {},
      showAlert: true,
      info: {},
      showTime: false,
      time: [],
      isTimeup: false,
      record: null,
      types: [],
      params: {
        coin_type: "",
        account: "",
      },
      listHeight: 0,
      curType: {}
    };
  },
  onLoad() {
    this.config = uni.getStorageSync("config");
    this.getIndex();
  },
  onUnload() {
    clearInterval(timer);
  },
  onPullDownRefresh() {
    clearInterval(timer);
    this.getRecharge();
  },
  methods: {
    // 显示类型列表
    showType() {
      if (this.listHeight) {
        this.listHeight = 0;
      } else {
        this.listHeight = 80 * this.types.length;
      }
    },

    // 选择类型
    chooseType(item) {
      console.log(item);
      this.curType = item
      this.params.coin_type = item.value;
      this.showType();
    },

    // 返回
    back() {
      uni.navigateBack();
    },

    // 获取充值类型
    getIndex() {
      index({}).then((res) => {
        this.types = res.data;
      });
    },

    // 获取充值数据
    getRecharge() {
      neworder(this.params).then((res) => {
        if(res.code == 1) {
          this.showAlert = false;
          this.info = res.data;
          this.time = res.data.time.split(":").map((item) => Number(item));
          this.showTime = true;
          uni.stopPullDownRefresh();

          // 定时刷新记录
          this.getRechargeRecord(this.info.maketime);
          let _this = this;
          timer = setInterval(() => {
            _this.getRechargeRecord(_this.info.maketime);
          }, 2000);
        } else {
          uni.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none",
          })
        }
      });
    },

    // 获取充值记录
    getRechargeRecord(maketime) {
      getrecharge({maketime}).then((res) => {
        this.record = res.data;
      });
    },

    // 倒计时结束
    countdownUp() {
      this.isTimeup = true;
    },

    // 跳转tabbar页
    changeTabbar(index) {
      uni.reLaunch({
        url: `/pages/index/index?tab=${index}`,
      });
    },

    // 提交充值数量
    submitQuantity() {
      let reg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;
      if (this.params.coin_type) {
        uni.showToast({
          title: this.$t('mine.coin_type_check'),
          duration: 2000,
          icon: "none",
        });
      }
      if (reg.test(this.params.account)) {
        this.getRecharge();
      } else {
        uni.showToast({
          title: this.$t('mine.quantity_check'),
          duration: 2000,
          icon: "none",
        });
      }
    },

    // 提交充值
    submit() {
      let _this = this;
      uni.showModal({
        title: "Tips",
        content: this.$t('mine.submit_confirm'),
        cancelText: "Cancel",
        confirmText: "Confirm",
        success: function (res) {
          if (res.confirm) {
            completed({
              address: _this.info.address,
              account: _this.record.account,
              coin_type: _this.params.coin_type,
            }).then((ret) => {
              uni.showToast({
                title: ret.msg,
              });
            });
          }
        },
      });
    },

    // 复制数量
    copyQuantity() {
      let _this = this
      console.log(2233);
      uni.setClipboardData({
        data: this.info.account,
        success: function () {
          uni.showToast({
            icon: "none",
            title: _this.$t('mine.copy_quantity'),
          });
        },
      });
    },

    // 复制地址
    copyFn() {
      let _this = this
      uni.setClipboardData({
        data: this.info.address,
        success: function () {
          uni.showToast({
            icon: "none",
            title: _this.$t('share.copy_msg'),
          });
        },
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.page {
  padding-bottom: 40rpx;

  .page_bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
  }

  .content {
    padding: 0 30rpx;

    .head {
      margin-top: 50rpx;

      .qrwrap {
        width: 340rpx;
        height: 340rpx;
        padding: 20rpx;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 40rpx;
      }

      .qrdes {
        margin-top: 20rpx;
        margin-bottom: 30rpx;
      }

      .timetip {
        padding: 30rpx;
        font-size: 40rpx;
        color: #f00;
        text-align: center;
      }
    }

    .content {
      width: 100%;
      margin-top: 60rpx;
      color: #333;
      border-radius: 40rpx;
      padding: 30rpx 30rpx 80rpx;
      box-sizing: border-box;

      .amount {
        margin-bottom: 30rpx;
        .anum {
          margin-right: 10rpx;
          font-size: 40rpx;
          font-weight: bold;
        }
      }

      .wrap {
        height: 70rpx;
        border-radius: 70rpx;
        background-color: #fff;

        .input {
          height: 100%;
          padding: 0 20rpx;
          border: 1px solid #ddd;
          border-radius: 35rpx 0 0 35rpx;
          box-sizing: border-box;
          border-right: 0;
        }

        .btn {
          width: 140rpx;
          height: 100%;
          color: #fff;
          border-radius: 0 35rpx 35rpx 0;
        }
      }

      .tips {
        padding: 30rpx;
        background-color: #fff;
        border-radius: 40rpx;
        font-size: 28rpx;
        line-height: 40rpx;
        margin-top: 30rpx;
      }

      .record {
        margin-top: 40rpx;
        width: 100%;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 40rpx;

        .title {
          font-size: 40rpx;
          font-weight: bold;
          padding: 20rpx 0;
          border-bottom: 1px solid #eee;
        }

        .form {
          padding: 20rpx 0;
          border-bottom: 1px solid #eee;
          font-weight: bold;
        }

        .list {
          .item {
            font-size: 32rpx;
            color: #666;
            padding: 20rpx;
            border-bottom: 1px solid #eee;
          }

          .item:last-child {
            border-bottom: none;
          }
        }
      }

      .confirm {
        width: 100%;
        // background-color: $theme-color2;
        height: 70rpx;
        border-radius: 70rpx;
        margin-top: 60rpx;
        color: #fff;
      }
    }
  }

  .alert {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10;

    .alert-content {
      position: relative;
      width: 640rpx;
      padding: 10rpx 30rpx 30rpx;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 20rpx;

      .title {
        font-size: 32rpx;
        font-weight: bold;
        text-align: center;
        padding: 20rpx 0;
      }

      .select {
        position: relative;
        width: 100%;
        height: 80rpx;
        border: 1px solid #999;
        margin-top: 30rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        border-radius: 6rpx;

        .list {
          position: absolute;
          top: 84rpx;
          left: 0;
          width: 100%;
          border-radius: 10rpx;
          transition: all 0.3s;
          box-sizing: border-box;
          box-shadow: 0 0 10px #ddd;
          background-color: #fff;
          overflow: hidden;
          z-index: 10;

          .item {
            font-size: 30rpx;
            width: 100%;
            height: 80rpx;
            padding-left: 20rpx;
            border-bottom: 1px solid #eee;
            box-sizing: border-box;
          }

          .item:last-child {
            border: none;
          }
        }
      }

      .input {
        width: 100%;
        height: 80rpx;
        border: 1px solid #999;
        margin: 30rpx 0 50rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        border-radius: 6rpx;
      }

      .back {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
        color: #999;
      }

      .btns {
        padding: 10rpx;

        .btn {
          width: 300rpx;
          height: 70rpx;
          text-align: center;
          line-height: 70rpx;
          color: #fff;
          border-radius: 10rpx;
        }

        .grey {
          background-color: #eee;
        }
      }
    }
  }
}
</style>
