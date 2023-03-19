<!-- <template>
	<div class="hex-container">
		<div class="hexagon">
			
		</div>
		<div class="hexagon">
			
		</div>
		<div class="hexagon">
			
		</div>
	</div>
</template>
<style>
	.hex-container {
	  display: grid;
	  grid-template-columns: repeat(3, 75px);
	  grid-auto-rows: 75px;
	}
	.hexagon {
	  width: 75px;
	  height: 75px; 
	  background-color: #ccc;
	  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
	}
</style> -->
<template>
	<div class="hexmap">
		<div :class="rowIndex % 2 === 1 ? 'hex-row' : 'hex-row-vice'" v-for="(row, rowIndex) in rows" :key="rowIndex">
			<div class="hex-cell" v-for="(cell, cellIndex) in row" :key="cellIndex" :class="{ selected: cell.selected }"
				@click="selectCell(rowIndex, cellIndex)">
				<span class="hex-label">{{ cell.label }}</span>
				<div class="unit_panze_1" v-if="cell.hasUnit"
					:style="{ top: cell.positionY + 'px', left: cell.positionX + 'px' }"></div>
			</div>
		</div>

	</div>
</template>

<script>
	const HexMapMixin = {
		data() {
			return {
				// 存储六边形地图数据
				rows: [],
			};
		},
		mounted() {
			this.generateHexMap(10, 10); // 默认生成 10x10 的地图
		},
		methods: {
			generateHexMap(rows, cols) {
				// 生成蜂窝状地图数据
				const data = [];
				for (let i = 0; i < rows; i++) {
					const row = [];
					for (let j = 0; j < cols; j++) {
						row.push({
							label: `${j-Math.ceil(i/2)},${i}`, // 显示位置坐标信息
							selected: false, //是否被选中
							positionX: i * 75 + "px", //横坐标
							positionY: j * 75 + "px", //纵坐标
							hasUnit: false //是否存在单位
						});
					}
					data.push(row);
				}
				//我们这么做的目的能够有序渲染出这么多个六边形网格
				this.rows = data; //将以上所有数据放进rows中
				console.log(this.rows)
			},
			selectCell(rowIndex, cellIndex) {
				// 更新选中格子的状态
				this.rows[rowIndex][cellIndex].selected = !this.rows[rowIndex][cellIndex].selected;
				if (this.rows[rowIndex][cellIndex].selected) {
					console.log(`选中了(${rowIndex},${cellIndex})`);
					// 在当前格子上显示坦克
					this.rows[rowIndex][cellIndex].hasUnit = true;
					// 清除其他格子上的坦克
					for (let i = 0; i < this.rows.length; i++) {
						for (let j = 0; j < this.rows[i].length; j++) {
							if (!(i === rowIndex && j === cellIndex)) {
								this.rows[i][j].hasUnit = false;
								this.rows[i][j].selected = false;
							}
						}
					}
				} else {
					// 隐藏坦克
					this.rows[rowIndex][cellIndex].hasUnit = false;
				}
			},
		},
	};

	export default {
		name: "HexMap",
		mixins: [HexMapMixin],
	};
</script>

<style>
	.hexmap {
		padding-top: 18px;
		margin-left: -40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: scroll;
	}

	.hex-row {
		display: flex;
		flex-direction: row;
		margin-top: -18px;
		/* 每一行的属性 */
	}

	.hex-row-vice {
		display: flex;
		flex-direction: row;
		margin-top: -18px;
		margin-left: 75px;
	}

	.hex-cell {
		width: 75px;
		height: 75px;
		background-color: #eee;
		border: 1px solid #aaa;
		position: relative;
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
	}

	.hex-cell.selected {
		background-color: rgba(192, 192, 192, 0.5);
	}

	.hex-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.unit_panze_1 {
		width: 75px;
		height: 50px;
		background-image: url('../../static/unit/tank_de_hd.png');
		background-position: 1px 1px;
		display: block;
		position: absolute;
		transform: scaleX(-1);
	}
</style>
