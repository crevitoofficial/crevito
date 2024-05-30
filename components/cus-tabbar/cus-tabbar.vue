<template>
  <view
    class="tabbar"
    :style="{ paddingBottom: paddingBottomHeight + 'rpx', backgroundColor: config['theme-bg-color'], boxShadow: `0 0 10px ${config['theme-box-shadow']}` }"
  >
    <view
      class="tabbar-item flex-center"
      v-for="item in list"
      :key="item.tab"
      @click="tabbarChange(item.tab)"
    >
      <text :class="['cursor', 'icon', 'iconfont', current == item.tab ?'hide': '']" :style="{color: config['theme-menu-iconcolor']}">{{item.icon}}</text>
      <view :class="['name',current == item.tab ?'show': '']" :style="{color: config['theme-menu-color'], backgroundColor: config['theme-menu-bgcolor']}">{{item.text}}</view>
    </view>
  </view>
</template>

<script>
export default {
	props: ['currentTab'],
  data() {
    return {
      config: {},
      current: 0,
      paddingBottomHeight: 0, //苹果X以上手机底部适配高度
      list: [
        {
          tab: 0,
          text: this.$t('tabbar.home'),
          icon: "\ue6b8", //未选中图标
        },
        {
          tab: 1,
          text: this.$t('tabbar.game'),
          icon: "\ue6df", //未选中图标
        },
        {
          tab: 2,
          text: this.$t('tabbar.history'),
          icon: "\ue61d",
        },
        {
          tab: 3,
          text: this.$t('tabbar.record'),
          icon: "\ue614", //未选中图标
        },
        {
          tab: 4,
          text: this.$t('tabbar.mine'),
          icon: "\ue6bd",
        },
      ],
    };
  },
  created() {
		this.current = this.currentTab || 0;
    this.config = uni.getStorageSync('config');
    let that = this;
    uni.getSystemInfo({
      success: function (res) {
        let model = ["X", "XR", "XS", "11", "12", "13", "14", "15"];
        model.forEach((item) => {
          //适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
          if (
            res.model.indexOf(item) != -1 &&
            res.model.indexOf("iPhone") != -1
          ) {
            that.paddingBottomHeight = 40;
          }
        });
      },
    });
  },
  watch: {
		'currentTab': function() {
			this.current = this.currentTab || 0;
		},
	},
  methods: {
    tabbarChange(tab) {
      this.current = tab;
      this.$emit("change", tab);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  box-shadow: 0 0 20rpx #ddd;
  .tabbar-item {
    flex: 1;
    position: relative;
    height: 100rpx;
    .icon {
      transform: translateX(-50%,-50%);
      color: #666;
      font-size: 50rpx;
      transition: all .3s;
      transform: scale(1);
    }
    .icon.hide {
      transform: scale(0);
    }
    .name {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 0;
      height: 60rpx;
      text-align: center;
      line-height: 60rpx;
      border-radius: 60rpx;
      font-weight: 600;
      color: #659386;
      background-color: #e6eeee;
      overflow: hidden;
      transition: all .3s;
    }
    .name.show {
      width: 70%;
    }
  }
}
</style>
