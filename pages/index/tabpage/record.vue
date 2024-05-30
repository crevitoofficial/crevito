<template>
	<view class="page">
		<cus-header :showBack="false" :title="($t('mine.bill_list'))"></cus-header>
		<!-- 页面背景 -->
		<view class="content plr30">
			<uni-card is-shadow class="item-list" v-for="item in billList" :key="item.id">
				<uni-row class="item-margin">
					<uni-col :span="12" style="font-size: 28rpx;">
						{{item.expect}}
					</uni-col>
					<uni-col :span="12" class="text-right">{{item.create_time}}</uni-col>
				</uni-row>
				<uni-row class="item-margin" v-if="item.no1+item.no2+item.no3 != 0">
					<!-- <uni-col :span="12">{{item.buy_account}}</uni-col> -->
					<!-- <uni-col :span="12" class="text-right">{{item.sel_odd}} -->
					<uni-col :span="12">{{item.close}}</uni-col>
					<uni-col :span="12" class="text-right">{{item.no1}}+{{item.no2}}+{{item.no3}}={{item.no1+item.no2+item.no3}}
					</uni-col>
				</uni-row>
				<uni-row class="item-margin">
					<!-- <uni-col :span="12">{{item.isdraw}}</uni-col> -->
					<uni-col :span="12">0%</uni-col>
					<uni-col :span="12" class="text-right">{{item.buy_account}}
					</uni-col>
				</uni-row>
				<uni-row class="item-margin" >
					<uni-col :span="12" style="display: flex;">
						<!-- <view class="item-tag pink">
							{{item.sel_name}}
						</view> -->
						<view class="item-tag pink">
							{{item.game_id === 3 ? 5 : item.game_id}}minute
						</view>
						<view class="item-tag orange">
							{{item.sel_name}}
						</view>
						<view class="item-tag green" v-if="item.isdraw=='3'">
							{{item.result}}
						</view>
						<view class="item-tag red" v-if="item.isdraw=='2'">
							{{item.result}}
						</view>
						<view class="item-tag bigred" v-if="item.isdraw=='1'">
							{{item.result}}
						</view>
					</uni-col>
					<uni-col :span="12" class="text-right">
						<view style="font-size: 27rpx;" v-html="item.all_account"></view>
					</uni-col>
				</uni-row>
			</uni-card>

			<view class="flex-center" style="margin-top: 30rpx;color: #999;">
				{{isHasMore ? $t('common.loadmore') : $t('common.nomore')}}
			</view>
		</view>
		<!-- 页面内容 -->
		<!--  <view class="content-wrapper">
      <uni-card is-shadow v-for="item in billList" :key="item.id">
        <uni-collapse>
          <uni-collapse-item titleBorder="none">
            <template v-slot:title>
              <uni-row>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.expect')}}:</span>
                  {{ item.expect }}
                </uni-col>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.status')}}:</span>
                  {{ item.status }}
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.time')}}:</span>
                  {{item.sel_name}}
                </uni-col>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.rate')}}:</span>
                  {{item.sel_odd}}
                </uni-col>
              </uni-row>
            </template>
            <view class="content">
              <uni-row>
                <uni-col :span="12">
                  <span class="title">{{$t('mine.draw')}}:</span>
                  {{item.isdraw}}
                </uni-col>
                <uni-col :span="12" class="flex-row" style="margin-left: -30rpx;">
                  <span class="title">{{$t('mine.all_account')}}:</span>
                  <view v-html="item.all_account"></view>
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="24">
                  <span class="title">{{$t('mine.buy_account')}}:</span>
                  {{item.buy_account}}
                </uni-col>
              </uni-row>
              <uni-row>
                <uni-col :span="24">
                  <span class="title">{{$t('mine.table_type')}}:</span>
                  {{item.create_time}}
                </uni-col>
              </uni-row>
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </uni-card>
      <view class="flex-center" style="margin-top: 30rpx;color: #999;">{{isHasMore ? $t('common.loadmore') : $t('common.nomore')}}</view>
    </view> -->
	</view>
</template>

<script>
	import {
		gameorder
	} from '../../../api/mine.js'

	export default {
		data() {
			return {
				config: {},
				billList: [],
				page: 1,
				isHasMore: true
			}
		},
		mounted() {
			let that = this;
			uni.$on('onReachBottomRecord', function(data) {
				if (that.isHasMore) {
					that.page = Number(that.page) + 1;
					that.getList();
				}
			});
		},
		created() {
			this.config = uni.getStorageSync('config')
			this.getList()
		},
		methods: {
			getList() {
				gameorder({
					page: this.page
				}).then((res) => {
					this.billList = this.billList.concat(res.data.list)
					if (this.page == res.data.pages) {
						this.isHasMore = false
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding-bottom: 180rpx;

		.content {
			margin-top: 30rpx;
			color: #ddd;

			.item-list {
				padding: 10rpx;
				background-color: #20232c;
				border: 1px solid #20232c;

				.item-margin {
					margin: 12rpx;
					color: rgb(221, 221, 221);
					font-size: 26rpx;

					.text-right {
						text-align: right;
					}

					.item-tag {
						color: white;
						margin-right: 16rpx;
						padding: 2rpx 20rpx;
						border-radius: 8rpx;
					}

					.pink {
						background-color: #ea5566;
					}

					.orange{
						background-color: chocolate;
					}
					.green{
						background-color: green;
					}
					.red{
						background-color: #EE473E;
					}
					.bigred{
						background-color: red;
					}
				}
			}
		}

	}
</style>
