<template>
  <view class="page">
    <cus-header :title="$t('mine.withdraw')"></cus-header>
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

    <!-- 页面内容 -->
    <view
      class="content"
      :style="{ backgroundColor: config['theme-bg-color2'] }"
    >
      <view class="head flex-col ai-center">
        <view class="title">{{ curAccount.title }}</view>
        <view style="color: red" v-for="(item, index) in text" :key="index">{{
          item
        }}</view>
        <view
          class="num flex-center"
          :style="{ color: config['theme-text-color'], backgroundColor: config['theme-bg-color1'] }"
          >{{ curAccount.account }}</view
        >
        <view>
          <text>{{ $t("mine.withdrawal_limit") }}：</text>
          <text :style="{ color: config['theme-text-color'] }">
            {{ curAccount.account_limit }}
          </text>
        </view>
      </view>
      <view class="form">
        <view class="item">
          <view class="input flex-row ai-center" @click="open">
            <text class="flex-1" :style="{ color: config['theme-text-color'] }">{{ curAccount.title }}</text>
            <text
              class="iconfont flex-center"
              :style="{ backgroundColor: config['theme-btn-bgcolor'] }"
            >
              <uni-icons
                type="bottom"
                size="17"
                :color="config['theme-btn-color']"
              ></uni-icons>
            </text>
          </view>
        </view>
        <view class="item">
          <input
            class="input"
            :value="params.account"
            @input="inputAmount"
            :style="{ color: config['theme-text-color'] }"
            type="number"
            :placeholder="amountPlaceholder"
          />
        </view>
        <view>
          <text style="color: red; font-size: 26rpx; margin-left: 30rpx">
            {{
              `${$t("mine.fee")} ${curAccount.withdraw_sxf}, ${$t(
                "mine.to_account"
              )} ${toAccount}`
            }}
          </text>
        </view>
        <view class="textarea">
          <textarea
            class="input"
            cols="30"
            rows="10"
            v-model="params.address"
            :style="{ color: config['theme-text-color'] }"
            :placeholder="$t('mine.text_desc')"
          ></textarea>
        </view>
        <view class="item">
          <input
            class="input"
            v-model="params.paypwd"
            :style="{ color: config['theme-text-color'] }"
            type="paypwd"
            :placeholder="$t('common.enter_password')"
          />
        </view>
      </view>
      <view v-if="countdown" class="flex-center" style="margin-top: 30rpx">
        <text style="margin-right: 10rpx">{{ $t("mine.resubmit") }}</text>
        <uni-countdown
          color="#D28C31"
          splitorColor="#D28C31"
          @timeup="countdownUp"
          :fontSize="20"
          :show-day="false"
          :show-hour="false"
          :show-min="false"
          :second="countdown"
        ></uni-countdown>
        <text style="margin-left: 10rpx">seconds</text>
      </view>
      <view
        v-else
        class="confirm flex-center"
        :style="{
          color: config['theme-btn-color'],
          backgroundColor: config['theme-btn-bgcolor'],
        }"
        @click="submit"
      >
        {{ $t("common.confirm") }}
      </view>
    </view>
    <uni-popup ref="popup" type="bottom">
      <view class="pop">
        <view
          class="item flex-center"
          :style="{
            color:
              curAccount.title == item.title
                ? config['theme-text-color2']
                : '#333',
          }"
          v-for="(item, index) in [basic, commission]"
          :key="index"
          @click="changeAccount(item)"
          >{{ item.title }}</view
        >
        <view class="item flex-center cancel" @click="close">
          {{ $t("common.cancel") }}
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import { index, completed } from "../../api/withdrawal";

export default {
  data() {
    return {
      config: {},
      info: {},
      amountPlaceholder: "",
      curAccount: {},
      toAccount: 0, // 到账金额
      params: {
        coin_types: "",
        account: "",
        address: "",
        paypwd: "",
      },
      countdown: 0,
      basic: {}, // 基本账户
      commission: {}, // 营销账户
      text: [], // 描述
    };
  },
  onLoad() {
    this.config = uni.getStorageSync("config");
    this.getCountDown();
    this.getIndex();
  },
  onShow() {},
  methods: {
    // 获取提现信息
    getIndex() {
      index({}).then((res) => {
        this.curAccount = res.data.basic;
        this.basic = res.data.basic;
        this.commission = res.data.commission;
        this.text = res.data.text;
        this.amountPlaceholder = `quota ${this.curAccount.withdraw_min_num}-${this.curAccount.withdraw_max_num}`;
        this.params.address = this.curAccount.withdraw_address;
        this.params.coin_types = this.curAccount.coin_types;
      });
    },

    // 输入数量
    inputAmount(e) {
      this.params.account = e.detail.value;
      this.toAccount = Number(
        this.params.account - this.params.account * this.curAccount.withdraw_sxf
      ).toFixed(2);
    },

    // 切换账户
    changeAccount(item) {
      this.curAccount = item;
      this.amountPlaceholder = `quota ${this.curAccount.withdraw_min_num}-${this.curAccount.withdraw_max_num}`;
      this.params.address = this.curAccount.withdraw_address;
      this.params.coin_types = this.curAccount.coin_types;
      this.close();
    },

    // 提交
    submit() {
      if (!this.params.account) {
        uni.showToast({
          title: this.$t("ruleCheck.input_account"),
          duration: 2000,
          icon: "none",
        });
        return;
      }
      if (isNaN(this.params.account)) {
        uni.showToast({
          title: this.$t("ruleCheck.number"),
          duration: 2000,
          icon: "none",
        });
        return;
      }
      // 限制账户提现超出最大
      if (
        this.params.account > Number(this.curAccount.withdraw_max_num) ||
        this.params.account > Number(this.curAccount.account_limit)
      ) {
        uni.showToast({
          title: this.$t("ruleCheck.max_limit"),
          duration: 2000,
          icon: "none",
        });
        return;
      }
      // 限制账户提现低于最小
      if (this.params.account < Number(this.curAccount.withdraw_min_num)) {
        uni.showToast({
          title: this.$t("ruleCheck.min_limit"),
          duration: 2000,
          icon: "none",
        });
        return;
      }
      if (this.params.account <= 0) {
        uni.showToast({
          title: this.$t("ruleCheck.gt0"),
          duration: 3000,
          icon: "none",
        });
        return;
      }
      if (!this.params.address) {
        uni.showToast({
          title: this.$t("ruleCheck.input_address"),
          duration: 2000,
          icon: "none",
        });
        return;
      }
      if (!this.params.paypwd) {
        uni.showToast({
          title: this.$t("common.enter_password"),
          duration: 2000,
          icon: "none",
        });
        return;
      }
      // 设置倒计时，1分钟后才能再点击，防止重复提交
      this.setCountDown();
      completed(this.params).then((res) => {
        uni.showToast({
          title: this.$t("mine.widthdrawal_succ"),
        });
        this.getIndex();
        this.params = {
          account: "",
          paypwd: "",
        };
      });
    },

    // 计算倒计时剩余时间
    getCountDown() {
      let time = uni.getStorageSync("withdrawal_countdown_time");
      if (time) {
        let end = new Date(time).getTime();
        let now = new Date().getTime();
        let left = end - now;
        if (left > 0) {
          this.countdown = Math.floor(left / 1000);
        } else {
          this.countdown = 0;
        }
      }
    },

    // 倒计时结束
    countdownUp() {
      this.countdown = 0;
    },

    // 设置1分钟倒计时
    setCountDown() {
      var date = new Date(); //1. js获取当前时间
      var min = date.getMinutes(); //2. 获取当前分钟
      date.setMinutes(min + 1); //3. 设置当前时间+1分钟：把当前分钟数+1后的值重新设置为date对象的分钟数
      var y = date.getFullYear();
      var m =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var f =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var s =
        date.getSeconds() < 10 ? "0" + date.getseconds() : date.getSeconds();
      var formatdate = y + "-" + m + "-" + d + " " + h + ":" + f + ":" + s;
      uni.setStorageSync("withdrawal_countdown_time", formatdate);
      this.getCountDown();
    },

    // 打开账户选择
    open() {
      // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
      this.$refs.popup.open();
    },

    // 关闭账户选择
    close() {
      // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
      this.$refs.popup.close();
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
    padding: 60rpx 30rpx 100rpx;
    margin: 30rpx;
    border-radius: 40rpx;
    color: #ddd;
    .head {
      .title {
        font-size: 36rpx;
        font-weight: bold;
      }
      .num {
        width: 100%;
        font-size: 70rpx;
        padding: 40rpx 0;
        border-radius: 40rpx;
        background-color: #fff;
        margin: 20rpx 0;
      }
    }
    .form {
      margin-top: 40rpx;
      .item {
        width: 100%;
        height: 90rpx;
        background-color: rgba(170, 69, 69, 0.1);
        border-radius: 90rpx;
        padding: 0 30rpx;
        margin-top: 26rpx;
        box-sizing: border-box;
        overflow: hidden;
        .input {
          height: 100%;
          position: relative;
          color: #333;
          .iconfont {
            position: absolute;
            right: -30rpx;
            top: 0;
            width: 80rpx;
            height: 100%;
          }
        }
      }
      .textarea {
        height: 160rpx;
        width: 100%;
        margin-top: 26rpx;
        background-color: rgba(170, 69, 69, 0.1);
        border-radius: 20rpx;
        padding: 20rpx;
        box-sizing: border-box;
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
    // .input {
    //   border: 1px solid #ddd;
    //   background-color: #fff;
    //   height: 70rpx;
    //   border-radius: 70rpx;
    //   line-height: 70rpx;
    //   padding-left: 20rpx;
    //   margin-top: 30rpx;
    //   color: #777;
    //   box-sizing: border-box;
    //   overflow: hidden;
    //   .iconfont {
    //     padding: 0 20rpx;
    //   }
    // }
    .confirm {
      height: 70rpx;
      border-radius: 70rpx;
      margin-top: 60rpx;
      color: #fff;
    }
  }
  .pop {
    background-color: #fff;
    border-radius: 30rpx 30rpx 0 0;
    .item {
      width: 100%;
      height: 90rpx;
      border-bottom: 1px solid #eee;
    }
    .cancel {
      color: #999;
    }
  }
}
</style>


