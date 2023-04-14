<template>
	<div class="panel" v-if="isShowPanel">
		<div class="tabs">
			<span class="tab" :class="{'active': activeTab===0}" @click="switchTab(0)">单位生产</span>
			<span class="tab" :class="{'active': activeTab===1}" @click="switchTab(1)">战时政策</span>
			<span class="tab" :class="{'active': activeTab===2}" @click="switchTab(2)">作战学说</span>
		</div>
		<div class="close-btn" @click="updatePanel">X</div>
		<div class="content">
			<div class="tab-content" :class="{'active': activeTab===0}">
				<div class="unit_card_container">
					<div class="unit_card" @click="productFun(1)">
						<img src="../../static/UI/cards/infantry.jpg">
						<h3>步兵师</h3>
						<span>组成部队的最基本单位，广泛用于执行防守作战和街巷作战</span>
					</div>
					<div class="unit_card" @click="productFun(2)">
						<img src="../../static/UI/cards/infantry_s.jpg">
						<h3>机动步兵连</h3>
						<span>装备了机动载具的步兵，适合用于突击行动</span>
					</div>
					<div class="unit_card" @click="productFun(3)">
						<img src="../../static/UI/cards/cannon.jpg">
						<h3>炮兵团</h3>
						<span>大口径火炮能够有效对敌方进行打击</span>
					</div>
					<div class="unit_card" @click="productFun(4)">
						<img src="../../static/UI/cards/Armored_Division.jpg">
						<h3>装甲部队</h3>
						<span>装甲部队是进攻作战中的矛头，拥有极高的机动性和攻击性</span>
					</div>
					<div class="unit_card" @click="productFun(5)">
						<img src="../../static/UI/cards/heavy.jpg">
						<h3>重型装甲部队</h3>
						<span>造价昂贵的战争机器，无论是在进攻作战还是在防守作战都是强大的力量</span>
					</div>
				</div>
			</div>
			<div class="tab-content" :class="{'active': activeTab===1}">
				<h2>战时政策</h2>
				<p>这是战时政策的内容。</p>
				<button @click="customFunc">触发自定义功能</button>
			</div>
			<div class="tab-content" :class="{'active': activeTab===2}">
				<h2>作战学说</h2>
				<p>这是作战学说的内容。</p>
				<button @click="customFunc">触发自定义功能</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'MyPanel',
		props: {
			isShowPanel: {
				type: Boolean,
				required: true
			}
		},
		data() {
			return {
				activeTab: 0, // 默认选中第一个标签
				tabs: ['单位生产', '战时政策', '作战学说']
			}
		},
		methods: {
			switchTab(tabIndex) {
				this.activeTab = tabIndex;
			},
			//隐藏单元格面板
			updatePanel() {
				// 触发自定义事件 update:is-show-panel，传递修改后的值
				const newValue = false
				this.$emit('update:is-show-panel', newValue)
			},
			customFunc() {
				// 执行自定义功能
			},
			productFun(val){
				this.updatePanel()
				this.$emit('product-unit', val)
			}
		},
		
	}
</script>

<style scoped>
	.panel {
		position: fixed;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(99, 30, 24, 0.3);
		width: 90%;
		height: 50%;
		padding: 20px;
		border-radius: 10px;
		/* background-color: #fff; */
	}

	.panel .content {}

	.panel .content button {
		width: 20px;
		height: 10px;
	}

	.tabs {
		display: flex;
		justify-content: flex-start;
	}

	.tabs .tab {
		width: 100px;
		margin: 20px;
		font-size: 18px;
		transition: all 0.7s ease-out;
	}

	.tabs .tab:hover {
		cursor: pointer;
		color: aliceblue;
	}

	.tabs .tab.active {
		width: 100px;
		margin: 20px;
		color: aliceblue;
	}

	.close-btn {
		margin-left: 90%;
		margin-top: -7%;
		position: fixed;
		/* position: absolute; */
		font-size: 24px;
		color: #000000;
		cursor: pointer;
		transition: all 0.7s ease-out;
	}
	
	.close-btn:hover {
	  color: #ffffff;
	}

	.content .tab-content {
		display: none;
		
	}

	.content .tab-content.active {
		display: block;
		
	}
	.content .tab-content .unit_card_container{
		display: flex;
		flex-direction: row;
		overflow: auto;
	}
	
	.content .tab-content .unit_card_container .unit_card{
		background-color: rgba(255, 255, 255, 0.3);
		width: 200px;
		height: 300px;
		margin: 10px;
	}
	
	.content .tab-content .unit_card_container .unit_card img{
		width: 160px;
		height: 180px;
		margin: 10px 10px;
		transition: transform 0.2s ease-in-out;
	}
	
	.content .tab-content .unit_card_container .unit_card img:hover{
		transform: scale(1.1);
	}
	
	
	.content .tab-content .unit_card_container .unit_card h3{
		font-size: 16px;
		font-weight: bold;
		text-align: center;
	}
	.content .tab-content .unit_card_container .unit_card span{
		margin: 10px;
		font-size: 12px;
		line-height: 12px;
		display: block;
		font-weight: bold;
	}
	
	.content .tab-content .unit_card_container::-webkit-scrollbar{
		width: 5px;
		height: 5px;
		background: transparent;
	}
	
	.content .tab-content .unit_card_container::-webkit-scrollbar-thumb{
		border-radius: 10px;
		background-color: rgba(0, 0, 0, 0.1);
	}
</style>
