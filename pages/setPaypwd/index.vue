<template> 
  <view class="page">
    <!-- 页面背景 -->
    <cus-header :title="($t('mine.set_pay'))"></cus-header>
    <view
      class="page_bg"
      :style="{ backgroundColor: config['theme-bg-color'] }"
    >
      <image
        v-if="config.loginbg"
        style="width: 100%; height: 100%"
        :src="config.loginbg"
      />
    </view>
    <!-- 页面内容 -->
    <view class="content">
      <view class="form">
        <!-- 支付密码 -->
        <view class="item flex-row ai-center">
          <text class="iconfont">&#xe7f8;</text>
          <input
            v-model="params.paypwd"
            class="input flex-1"
            :style="{ color: config['theme-text-color'] }"
            type="password"
            placeholder-style="color: #bbb;"
            :placeholder="$t('register.placeholder8')"
          />
        </view>
        <view class="item flex-row ai-center">
          <text class="iconfont">&#xe7f8;</text>
          <input
            v-model="rePayPassword"
            class="input flex-1"
            :style="{ color: config['theme-text-color'] }"
            type="password"
            placeholder-style="color: #bbb;"
            :placeholder="$t('register.placeholder9')"
          />
        </view>
        <view class="item flex-row ai-center code">
          <text class="iconfont">&#xe6bf;</text>
          <input
            v-model="params.password"
            class="input flex-1"
            :style="{ color: config['theme-text-color'] }"
            type="password"
            placeholder-style="color: #bbb;"
            :placeholder="$t('login.placeholder2')"
          />
        </view>
        <view
          class="btn flex-center"
          :style="{
            color: config['theme-btn-color'],
            backgroundColor: config['theme-btn-bgcolor'],
            marginTop: '100rpx',
          }"
          @click="submit"
          >{{ $t("common.submit") }}</view
        >
      </view>
    </view>
  </view>
</template>
<script>
import Validate from "../../utils/validate";
import { setpaypass } from "../../api/mine";

export default {
  data() {
    return { 
      config: {},
      params: {
        paypwd: '',
        password: ''
      },
      rePayPassword: "", //确认支付密码
    }
  },
  onLoad() { 
    this.config = uni.getStorageSync("config");
  },
  methods: {
    submit() {
      let valid = new Validate();
      let validParams = {
        paypwd: [
          {
            rule: "isRequired",
            value: this.params.paypwd,
            message: this.$t("register.valid_pay_password"),
          },
          {
            rule: "minLength",
            value: [this.params.paypwd, 6],
            message: this.$t("register.valid_pay_password_num"),
          },
          {
            rule: "maxLength",
            value: [this.params.paypwd, 18],
            message: this.$t("register.valid_pay_password_num"),
          },
          {
            rule: "isEqual",
            value: [this.params.paypwd, this.rePayPassword],
            message: this.$t("register.valid_pay_password_same"),
          },
        ],
        password: [
          {
            rule: "isRequired",
            value: this.params.password,
            message: this.$t("register.valid_login_password"),
          },
        ],
      }

      let result = valid.test(validParams);
      if (result) {
        uni.showToast({
          title: result.errMsg,
          duration: 3000,
          icon: "none",
        });
      } else {
        setpaypass(this.params)
          .then((res) => {
            uni.showToast({
              title: this.$t("common.set_success"),
            });
            this.params = {
              paypwd: '',
              password: ''
            }
            this.rePayPassword = ''
          })
          .catch((err) => {
            console.log(err);
          });
      }
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
  .content {
    .form {
      padding: 0 30rpx;
      .item {
        width: 100%;
        height: 90rpx;
        background-color: rgba(170, 69, 69, 0.1);
        border-radius: 90rpx;
        padding: 20rpx 30rpx;
        margin-top: 26rpx;
        box-sizing: border-box;
        .iconfont {
          color: #fff;
        }
        .iconfont.right {
          padding-left: 30rpx;
        }
        .input {
          height: 100%;
          padding-left: 20rpx;
          margin-left: 20rpx;
          border-left: 1px solid #fff;
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
      .btn.register {
        background-color: #b78b62;
      }
    }
  }
}
</style>
