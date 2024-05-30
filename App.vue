<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
    let systemInfo = uni.getSystemInfoSync();
    // #ifdef APP-PLUS
    let statusBarHeight = systemInfo.statusBarHeight;
    uni.setStorageSync("statusBarHeight", statusBarHeight);
    // #endif
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@font-face {
  font-family: 'iconfont';  /* Project id 3279054 */
  src: url('https://at.alicdn.com/t/font_3279054_xi3fvaefrp.woff2?t=1649039404929') format('woff2'),
       url('https://at.alicdn.com/t/font_3279054_xi3fvaefrp.woff?t=1649039404929') format('woff'),
       url('https://at.alicdn.com/t/font_3279054_xi3fvaefrp.ttf?t=1649039404929') format('truetype');
}
.iconfont {
  font-family: "iconfont";
  font-size: 36rpx;
}

page {
  font-size: 28rpx;
}

.flex-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.flex-center-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-1 {
  flex: 1;
}

.flex-wrap {
  flex-wrap: wrap;
}

.jc-start {
  justify-content: flex-start;
}

.jc-end {
  justify-content: flex-end;
}

.jc-center {
  justify-content: center;
}

.jc-around {
  justify-content: space-around;
}

.jc-between {
  justify-content: space-between;
}

.ai-start {
  align-items: flex-start;
}

.ai-end {
  align-items: flex-end;
}

.ai-center {
  align-items: center;
}
.plr30 {
  padding: 0 30rpx;
}
.ml20 {
  margin-left: 20rpx;
}
.mr20 {
  margin-right: 20rpx;
}
.ml10 {
  margin-left: 10rpx;
}
.mr10 {
  margin-right: 10rpx;
}

.cursor{
  &:hover {
    cursor: pointer;
  }
}

/* 文字溢出 */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
