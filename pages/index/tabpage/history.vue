<template>
	<view class="page">
		<cus-header :showBack="false" title="History"></cus-header>
		<view class="content plr30">
			<v-tabs v-model="current" :tabs="tabs" @change="changeTab" lineHeight="4rpx" field="name" color="#ddd"
				:bold="false" :bgColor="config['theme-bg-color2']" :activeColor="config['theme-text-color']"
				:lineColor="config['theme-text-color']">
			</v-tabs>
			<uni-card class="item-list" v-for="item in historyList" :key="item.id">
				<uni-row class="item-margin">
					<uni-col :span="12" :style="{color:config['theme-text-color']}" style="font-size: 28rpx;">
						{{item.expect}}
					</uni-col>
					<uni-col :span="12" class="text-right" style="color: #888;">{{item.create_time}}</uni-col>
				</uni-row>
				<uni-row class="item-margin">
					<uni-col :span="12">{{item.close}}</uni-col>
					<uni-col :span="12" class="text-right">{{item.no1}}+{{item.no2}}+{{item.no3}}={{item.total}}
					</uni-col>
				</uni-row>
				<uni-row class="item-margin">
					<view class="tag-list ">
						<view class="item-tag green">
							{{item.ds}}
						</view>
						<view class="item-tag blue">
							{{item.dx}}
						</view>
						<view class="item-tag purple">
							{{item.dxds}}
						</view>
					</view>

				</uni-row>
			</uni-card>
			<view class="flex-center" style="margin-top: 30rpx;color: #999;">
				{{isHasMore ? $t('common.loadmore') : $t('common.nomore')}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		historyList
	} from "../../../api/history.js"
	import vTabs from "@/components/v-tabs/v-tabs";
	export default {
		component: {
			vTabs,
		},
		props: {
			reachBottomSign: {
				type: Number,
			},
		},
		data() {
			return {
				historyList: [],
				isHasMore: true,
				config: {},
				page: 1,
				tabs: [{
						id: 1,
						name: "1Min"
					},
					{
						id: 3,
						name: "5Min"
					}
				],
				minute_id: 1
			}
		},
		mounted() {
			let that = this;
			uni.$on('onReachBottomHistory', function(data) {
				if (that.isHasMore) {
					that.page = Number(that.page) + 1;
					that.getHistoryList();
				}
			});
		},
		created() {
			this.config = uni.getStorageSync("config");
			this.getHistoryList()
		},
		methods: {
			// tab切换
			changeTab(index) {
				console.log("当前选中的项：" + index);
				this.minute_id = this.tabs[index].id;
				this.page = 1
				this.getHistoryList();
			},
			// 获取产品列表
			getHistoryList() {
				historyList({
					page: this.page,
					game_id: this.minute_id
				}).then((res) => {
					// this.historyList = res.data.list;
					console.log(res.data.list)
					if(this.page == 1){
						this.historyList = []
					}
					this.historyList = this.historyList.concat(res.data.list)
					if (this.page == res.data.pages) {
						this.isHasMore = false;
					}
				});
			},
		}
	}
</script>

<style lang='scss' scoped>
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

					.tag-list {
						display: flex;

						.item-tag {
							color: white;
							margin-right: 16rpx;
							padding: 2rpx 20rpx;
							border-radius: 8rpx;
						}

						.green {
							background-color: #31cf34;
						}

						.blue {
							background-color: #03c0ff;
						}

						.purple {
							background-color: #b43168;
						}
					}
				}



			}
		}

	}
</style>
