<template>
	<view class="container">
		<view class="form">
			<view class="form-title">用户登录</view>
			<view class="form-item">
				<input type="text" placeholder="请输入用户名" v-model="username" />
			</view>
			<view class="form-item">
				<input type="password" placeholder="请输入密码" v-model="password" />
			</view>
			<view class="form-item">
				<button type="primary" @click="onSubmit">登录</button>
			</view>
			<view class="form-item">
				<button type="primary" @click="onSign">注册</button>
			</view>
		</view>
	</view>
</template>

<script>
	import axios from 'axios'
	import {
		EventBus
	} from '../my_modules/eventBus.js'
	axios.defaults.baseURL = 'http://localhost:3000'
	export default {
		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			onSubmit() {
				// 发送登录请求
				axios.post('/login', {
						username: this.username,
						password: this.password
					})
					.then(res => {
						// 登录成功，返回上一页
						uni.showToast({
							icon: 'success',
							title: '登录成功！',
							duration: 500,
							success: () => { 
								setTimeout(() => {
									sessionStorage.setItem('username', this.username)
									EventBus.$emit('login-success', true)
									EventBus.$emit('get-username', this.username) // 此处使用 this.username
						  	uni.navigateBack();
								}, 1500);
							}
						})
					})
					.catch(err => {
						console.log(err);
						// 登录失败，弹出错误提示
						uni.showToast({
							icon: 'none',
							title: '登录失败，请检查用户名和密码是否正确',
						});
					});
			},
			onSign() {
				// 发送注册请求
				axios.post('/register', {
						username: this.username,
						password: this.password
					})
					.then(res => {
						console.log('注册成功！');

						// 注册成功，弹出成功提示，并返回上一页
						uni.showToast({
							icon: 'success',
							title: '注册成功！',
							duration: 1500, // 设置提示框的显示时间，单位为毫秒
							success: function() {
								setTimeout(function() {
									uni.navigateBack();
								}, 1500); // 等待提示框消失后再返回上一页
							}
						});
					})
					.catch(err => {
						console.log(err);

						// 注册失败，弹出错误提示
						uni.showToast({
							icon: 'none',
							title: err.response.data || '注册失败，请重试！',
						});
					});
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		background-image: url('../static/UI/heavy.jpg');
		height: 622px;
		background-size: cover;
		padding: 20rpx 60rpx 20rpx 60rpx;
	}

	.form {
		width: 80vw;
		max-width: 400px;
		border: 1px solid #ccc;
		padding: 20px;
		background-color: rgba(185, 185, 185, 0.6);
	}

	.form-title {
		font-size: 18px;
		font-weight: bold;
		text-align: center;
		margin-bottom: 20px;
	}

	.form-item {
		margin-bottom: 16px;
	}

	.input {
		width: 100%;
		border: 1px solid #ccc;
		padding: 6px 12px;
	}

	button {
		width: 100%;
		background-color: #007aff;
		color: #fff;
		border: none;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
	}

	button:active {
		background-color: #0062cc;
	}
</style>
