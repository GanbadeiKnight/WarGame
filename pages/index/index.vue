<template>
	<view class="container">
		<view class="header">前线</view>
		<view class="tab-menu">
			<view class="tab-item" @click="navigateTo('/pages/login')">
				<view class="tab-title">登录</view>
			</view>
			<view class="tab-item" @click="navigateTo('/pages/compagin/compagin_1')">
				<view class="tab-title">新的战役</view>
			</view>
			<view class="tab-item" @click="navigateTo('/pages/compagin/compagin_1')">
				<view class="tab-title">设置</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		EventBus
	} from '../../my_modules/eventBus.js'
	import axios from 'axios'
	export default {
		data() {
			return {
				isLogin: false,
				username: undefined
			}
		},
		mounted() {
			EventBus.$on('login-success', isLogin => {
					this.isLogin = isLogin;
				}),
				EventBus.$on('get-username', username => {
					this.username = username
					console.log("当前的用户是：" + this.username)
					setTimeout(() => {
						uni.showToast({
							title: '欢迎回来，' + username + '！',
							icon: 'none',
							duration: 3000
						}, 3000)
					})
				})
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				})
			},
			loadGame(username) {
				axios.get(`/loadgame/${username}`)
					.then(response => {
						const saveData = response.data;
						console.log(saveData)
						// 将存档数据传递给下一个页面
						EventBus.$emit('saveData', saveData);
						// 跳转到游戏主进程页面
						console.log(EventBus)
						uni.navigateTo({
							url: '/pages/compagin/compagin_1'
						});
					})
					.catch(error => {
						console.log(error);
					});
			}
		}
	}
</script>

<style>
	.container {
		background-image: url('../../static/UI/heavy.jpg');
		background-size: cover;
		padding: 20rpx 60rpx 20rpx 60rpx;
		height: 622px;
	}

	.header {
		font-size: 48rpx;
		font-weight: bold;
		text-align: center;
		color: #ffffff;
		margin-top: 50rpx;
	}

	.tab-menu {
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
		margin-top: 300rpx;
		margin-left: 1500rpx;
	}

	.tab-item {
		display: flex;
		margin: 20rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 400rpx;
		height: 120rpx;
		background-color: rgba(70, 70, 70, 0.8);
		border-radius: 20rpx;
		box-shadow: 0px 8rpx 20rpx rgba(0, 0, 0, 0.15);
		color: #ffffff;
		font-size: 32rpx;
		text-align: center;
	}

	.tab-icon {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 20rpx;
	}

	.tab-title {
		line-height: 48rpx;
	}
</style>
