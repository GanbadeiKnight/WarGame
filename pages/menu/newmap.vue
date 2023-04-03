<template>
	<div class="hexmap">
		<div :class="rowIndex % 2 === 1 ? 'hex-row' : 'hex-row-vice'" v-for="(row, rowIndex) in rows" :key="rowIndex">
			<div class="hex-cell" v-for="(cell, cellIndex) in row" :key="cellIndex" :class="{ 
				selected: cell.selected ,
				}" @click="selectCell(rowIndex, cellIndex)" ref="cells">
				<span class="hex-label">{{ cell.label }}

				</span>
				<!-- image class="building_capital" v-if="cell.building === 1">
					</image> -->
			</div>
		</div>
		<!-- 遍历生成地图上的地形，建筑 -->
		<div class="building" v-for="(cell,unitIndex) in cellarr" v-if="cell.building"
			:class="getBuildingClass(cell.building)"
			:style="{top: cell.positionY+25 + 'px', left: cell.positionX-35 + 'px'}">
		</div>
		<!-- 遍历生成地图上的初始单位 -->
		<div class="unit" v-for="(unit,unitIndex) in unitarr" v-if="unit.hasUnit" :class="getUnitClass(unit.unitType)"
			:style="{top: unit.positionY + 'px', left: unit.positionX+ 'px'}" @click="selectUnit($event,unit,attackStatus)"
			:ref="'unit-'+unitIndex">
			<div class="effect_wrapper"></div>
			<div class="effect"></div>
			<div class="health-bar">
				<span class="current-health" :style="{width:unit.hp+'%'}"></span>
			</div>
			<!-- <span class="unit-tag">{{unit.unitInfo.name}}</span> -->

		</div>

	</div>
</template>

<script>
	import cloneDeep from 'lodash/cloneDeep' //引入深拷贝
	import doCombat from '../../my_modules/doCombat.js';
	import hexFun from '../../my_modules/hexFun.js' //引入六边形网格计算函数
	import showRange from '../../my_modules/showRange.js' //引入显示范围
	import getUnitInfo from '../../my_modules/unitInfo.js' //引入单位数据表
	import audio from '../../my_modules/audio.js' //引入音频文件
import { indexOf } from 'lodash';
	const HexMapMixin = {
		data() {
			return {
				// 存储六边形地图数据
				rows: [],
			};
		},
		mounted() {
			this.generateHexMap(10, 10); // 默认生成 10x10 的地图
			this.cellPositions = []; // 存储所有 hex-cell 元素的位置信息
			this.cellarr = JSON.parse(JSON.stringify(this.rows.flat())) //将rows中的数据扁平化后放进cellarr中,注意必须采用深拷贝的形式
			//初始地图含有建筑，单位的初始化
			this.cellarr[14].hasUnit = true
			this.cellarr[44].hasUnit = true
			this.cellarr[65].hasUnit = true
			this.cellarr[48].building = 1
			this.cellarr[49].building = 4
			this.cellarr[47].building = 6
			this.cellarr[68].building = 9
			this.cellarr[34].building = 9

			let filteredArr = this.cellarr.filter(item => item.hasUnit)
			let newUnitArr = cloneDeep(filteredArr) //深拷贝的形式进行对象赋值避免带来的连锁效应
			this.indexMap = new Map()//创建一个新的哈希映射表，使我们两个数组之间后续可以利用下标进行联系
			filteredArr.forEach((item,index) => {
				this.indexMap.set(this.cellarr.indexOf(item),index) //这个哈希表前者为unitarr的下标，后者为cellarr的下标
			})
			newUnitArr.forEach((item,index) => {
				//赋值到我们的数组当中
				this.unitarr.push(item);
			})
			console.log(this.indexMap)//打印检查我们的哈希表
			console.log(this.unitarr[0])
			//进行地图上单位的初始化
			this.unitarr[0].unitType = 1
			this.unitarr[0].unitInfo = getUnitInfo(this.unitarr[0].unitType)
			this.unitarr[1].unitType = 2
			this.unitarr[1].unitInfo = getUnitInfo(this.unitarr[1].unitType)
			this.unitarr[2].unitType = 2
			this.unitarr[2].unitInfo = getUnitInfo(this.unitarr[2].unitType)
			this.unitarr[0].team = 0
			this.unitarr[1].team = 1
			this.unitarr[2].team = 1

			console.log(this.unitarr)
			//建立一个二维坐标映射表用于优化遍历算法
			this.coordinateMap = {};
			// 构建地图坐标与索引的映射对象
			for (let i = 0; i < this.rows.length; i++) {
				for (let j = 0; j < this.rows[i].length; j++) {
					this.coordinateMap[`${j-Math.ceil(i/2)},${i}`] = i * this.rows[0].length + j;
				}
			}
			console.log(this.coordinateMap)
			setTimeout(() => {
				this.cells = this.$refs.cells
				for (let i = 0; i < this.cells.length; i++) {
					const cell = this.cells[i];
					const rect = cell.getBoundingClientRect()
					this.cellPositions.push({
						left: parseInt(rect.left + window.pageXOffset),
						top: parseInt(rect.top + window.pageYOffset)
					})
				}

				for (let i = 0; i < this.unitarr.length; i++) {
					//单位坐标的初始化
					const unit = this.unitarr[i];
					this.$set(unit, 'positionX', this.cellPositions[unit.id].left)
					this.$set(unit, 'positionY', this.cellPositions[unit.id].top - 35)
					// unit.positionX = this.cellPositions[i].left;
					// unit.positionY = this.cellPositions[i].top - 35;
				}
				//单元格数组的初始化
				for (let i = 0; i < this.cellarr.length; i++) {
					const cell = this.cellarr[i]
					this.$set(cell, 'positionX', this.cellPositions[i].left)
					this.$set(cell, 'positionY', this.cellPositions[i].top - 35)
				}
			}, 0)
		},
		methods: {
			generateHexMap(rows, cols) {
				// 生成蜂窝状地图数据
				const data = [];
				for (let i = 0; i < rows; i++) {
					const row = [];
					if (i % 2) {
						for (let j = 0; j < cols; j++) {
							row.push({
								id: j + i * 10,
								label: `${j-Math.ceil(i/2)},${i}`, // 显示位置坐标信息
								x: j - Math.ceil(i / 2),
								y: i,
								selected: false, //是否被选中
								hasUnit: false, //是否存在单位
								positionX: j * 77 + 77,
								positionY: i * 60 + 10, //渲染单位初始状态，后续在mounted函数调用后这个坐标数据会被覆盖
								building: 'default',
								unitType: 'default',
								hp: 100,
								unitInfo: getUnitInfo('default'),
							});
						}
					} else {
						for (let j = 0; j < cols; j++) {
							row.push({
								id: j + i * 10,
								label: `${j-Math.ceil(i/2)},${i}`, // 显示位置坐标信息
								x: j - Math.ceil(i / 2),
								y: i,
								selected: false, //是否被选中
								hasUnit: false, //是否存在单位
								positionX: j * 77 + 115,
								positionY: i * 60 + 10, //渲染单位初始状态，后续在mounted函数调用后这个坐标数据会被覆盖
								building: 'default',
								unitType: 'default',
								hp: 100,
								unitInfo: getUnitInfo('default')
							})
						}
					}

					data.push(row);
				}
				//我们这么做的目的能够有序渲染出这么多个六边形网格
				this.rows = data; //将以上所有数据放进rows中
				console.log(this.rows)
			},
			selectCell(rowIndex, cellIndex) {
				// 更新选中格子的状态
				this.rows[rowIndex][cellIndex].selected = !this.rows[rowIndex][cellIndex].selected
				
				if (this.rows[rowIndex][cellIndex].selected) {
					console.log(`选中了(${rowIndex},${cellIndex-Math.ceil(rowIndex/2)})`)
					console.log(rowIndex * 10 + cellIndex)
				}
			},
			//这个异步函数用于清除移动面板中的高亮格子,异步函数比较占用内存所以就不使用异步了
			// async clearMoveCell(){
			//     const moveCells = document.querySelectorAll(".hex-cell.move")
			//     for(let i=0; i<moveCells.length; i++){
			//         const cell = moveCells[i];
			//         await new Promise((resolve) => {
			//             cell.style.backgroundColor = "";
			//             cell.classList.remove("move");
			//             setTimeout(resolve, 12)
			//         })
			//     }
			// },
			//使用同步方法移除
			clearMoveCell(distanceArr) {
				for (let i = 0; i < distanceArr.length; i++) {
					for (let j = 0; j < this.rows.flat().length; j++) {
						if (distanceArr[i].x == this.rows.flat()[j].x && distanceArr[i].y == this.rows.flat()[j].y) {
							setTimeout(() => { // 使用 setTimeout 函数延迟执行代码
								const moveCell = document.getElementsByClassName("hex-cell")[j];
								moveCell.style.backgroundColor = "";
								moveCell.classList.remove("move");
							}, i * 20); // 根据需要设置不同的延迟时间
						}
					}
				}
			},
			//这个函数用于清除移动面板中的绑定点击函数
			clearMoveClick(distanceArr) {
				for (let i = 0; i < distanceArr.length; i++) {
					for (let j = 0; j < this.rows.flat().length; j++) {
						if (distanceArr[i].x == this.rows.flat()[j].x && distanceArr[i].y == this.rows.flat()[j].y) {
							const moveCell = document.getElementsByClassName("hex-cell")[j]
							// console.log(moveCell.hasOwnProperty('click'))
							moveCell.removeEventListener("click", this.clickHandlerWrapper[j])
						}
					}
				}
			},
			selectUnit(event,unit, attackStatus) {
				//如果判定接收到的是一个attack值，则触发攻击判定
				for(let i = 0;i<attackStatus.length;i++){
					if (attackStatus[i] === unit.id) {
						console.log("触发了攻击事件")
						//这个循环只是用来消除背景颜色
						for(let i = 0;i<attackStatus.length;i++){
							let index=attackStatus[i]
							let moveCell = document.getElementsByClassName("hex-cell")[index]
							moveCell.style.backgroundColor = ''
						}
						//使用ref的方式绑定每一个单位的唯一标识符，并且能够随时用JS访问到这个单位
						const currentUnit = this.$refs['unit-' + this.unitarr.indexOf(unit)]
						console.log(currentUnit[0])
						
						//进行战斗计算
						this.currentAttacker.hp = this.currentAttacker.hp - doCombat(unit, this.currentAttacker).result1
						unit.hp = unit.hp - doCombat(unit, this.currentAttacker).result2
						console.log("进攻者与防御者的生命值剩余：" + this.currentAttacker.hp, unit.hp)
						if (unit.hp <= 0) {
							unit.hasUnit=false
							// this.unitarr.splice(this.unitarr.indexOf(unit),1)
							this.cellarr[unit.id].hasUnit = false
							console.log("防御者已被消灭")
						}
						if (this.currentAttacker.hp <= 0) {
							this.currentAttacker.hasUnit=false
							// this.unitarr.splice(this.unitarr.indexOf(this.currentAttacker),1)
							this.cellarr[this.currentAttacker.id].hasUnit = false
							console.log("进攻者已被消灭")
						}
						this.attackStatus = []
						//播放进攻音效
						audio.panzerAttackAudio.volume = 0.1
						audio.panzerAttackAudio.play()
						//实现攻击特效
						const effect_open = currentUnit[0].querySelectorAll('.effect')
						const effect_close = currentUnit[0].querySelectorAll('.effect_wrapper')
						console.log(effect_open)
						effect_open.forEach((item) => {
							console.log("执行了内部")
							item.style.display = 'block';
						})
						effect_close.forEach((item) => {
							item.style.display = 'none';
						})
						let timer=setTimeout(()=>{
							effect_open.forEach((item) => {
							  item.style.display = 'none';
							})
							effect_close.forEach((item) => {
							  item.style.display = 'block';
							})
							clearTimeout(timer)
						},500)
						return
					}
				}
				//通常状态下的触发
				this.selectedUnit = !this.selectedUnit
				console.log("选中了单位")
				console.log("现在单位的单元格标签" + unit.x + unit.y)
				let dist = unit.unitInfo.speed
				const distanceArr = showRange(unit.x, unit.y, dist)
				if (this.selectedUnit) {
					console.log("打开移动范围")
					// console.log(this.rows.flat())
					// this.rows.flat().forEach((unit) => unit.showMove = null)
					for (let i = 0; i < distanceArr.length; i++) {
						// console.log(`${distanceArr[i].x},${distanceArr[i].y}`)
						let index = this.coordinateMap[`${distanceArr[i].x},${distanceArr[i].y}`]
						if (!index) {
							continue
						}
						this.showMove(index, unit, distanceArr)
					}
				} else {
					console.log("关闭移动范围")
					this.clearMoveCell(distanceArr)
					this.clearMoveClick(distanceArr)
					this.showAttack(unit)
				}

			},
			showMove(index, unit, distanceArr) {
				const moveCell = document.getElementsByClassName("hex-cell")[index] //赋值范围内的六边形元素
				moveCell.style.backgroundColor = "rgba(192, 192, 192, 0.5)"
				// var pseudo = window.getComputedStyle(moveCell, '::before')
				// var visibility = pseudo.getPropertyValue('visibility')
				// console.log(visibility)
				// moveCell.style.setProperty('visibility', 'visible', '::before');
				moveCell.classList.add("move")
				if (!this.clickHandlerWrapper) {
					this.clickHandlerWrapper = [];
				}
				this.clickHandlerWrapper[index] = this.clickHandler.bind(this, unit, index, distanceArr)
				moveCell.addEventListener("click", this.clickHandlerWrapper[index])
			},
			clickHandler(unit, index, distanceArr) {
				//清除目前单位的单元格有单位的标记
				console.log(this.cellarr[unit.id])
				this.cellarr[unit.id].hasUnit = false
				//判定该单元格是否有单位，如果有则不进行移动
				if (this.cellarr[index].hasUnit) {
					this.clearMoveCell(distanceArr)
					this.clearMoveClick(distanceArr)
					return
				}
				console.log("进行移动")
				// const rect = moveCell.getBoundingClientRect()
				// const positionX = parseInt(rect.left + window.scrollX)
				// const positionY = parseInt(rect.top + window.scrollY-35)
				//深拷贝JSON.parse(JSON.stringify(this.rows.flat()))
				this.selectedUnit = !this.selectedUnit
				this.indexMap.delete(unit.id)
				unit.id = JSON.parse(JSON.stringify(this.cellarr[index].id))
				this.indexMap.set(unit.id,this.unitarr.indexOf(unit))
				unit.positionX = JSON.parse(JSON.stringify(this.cellarr[index].positionX))
				unit.positionY = JSON.parse(JSON.stringify(this.cellarr[index].positionY))
				unit.x = JSON.parse(JSON.stringify(this.cellarr[index].x))
				unit.y = JSON.parse(JSON.stringify(this.cellarr[index].y))
				console.log("标记" + unit.x + unit.y)
				//将当前单元格标记为有单位存在
				this.cellarr[index].hasUnit = true
				console.log(unit)
				//播放移动音效
				// const audio = new Audio('../static/audio/tank.wav')
				audio.getAudioByUnitType(unit.unitType).volume = 0.02
				audio.getAudioByUnitType(unit.unitType).play()
				//数组中的数据发生改变需要我们手动进行刷新
				// this.$set(this.cellarr, index, cell)
				//使用异步函数清除所有已经标记的六边形
				this.clearMoveCell(distanceArr)
				this.clearMoveClick(distanceArr)
				this.showAttack(unit)
			},
			showAttack(unit) {
				console.log("进行周围是否有敌人的判定")
				console.log("现在单位的对应的地块ID是：" + unit.id)
				//获取周围一圈的地块，判断地块上是否存在单位
				const distanceArr = showRange(unit.x, unit.y, 1)
				// 此处的原理是我们新建了一个二维哈希表，输入我们所要的方格的二维坐标即可返回索引值，这个算法用于优化出现移动范围，攻击范围的性能。
				//下面的index即六边形网格范围寻索功能的网格所在cellarr数组中的索引对应
				for (let i = 0; i < distanceArr.length; i++) {
					let index = this.coordinateMap[`${distanceArr[i].x},${distanceArr[i].y}`]
					if (!index || index === unit.id) {
						continue
					}
					if (this.cellarr[index].hasUnit&&this.unitarr[this.indexMap.get(index)].team!==unit.team) {
						console.log(this.indexMap)
						console.log(this.unitarr[this.indexMap.get(index)]+"这里这里这里")
						console.log("攻击范围内有敌人")
						//搜寻到此网格并且使这个网格染成红色
						const moveCell = document.getElementsByClassName("hex-cell")[index]
						const timerRed=setTimeout(() => {
							moveCell.style.backgroundColor = "rgba(192, 32, 35, 0.5)"
							// clearTimeout(timerRed)
						}, 300)
						//index是我们即将指向的单位的索引，我们将其赋给全局变量this.attackStatus用于与点击攻击的动作进行通信
						this.attackStatus.push(index)
						console.log(this.attackStatus)
						//currentAttacker是我们当前正在触发攻击事件的具体单位，也是一个全局变量，原则上我们不允许同时选定多个攻击对象
						this.currentAttacker = unit
					}
				}

			},
			getBuildingClass(building) {
				switch (building) {
					case 1:
						return 'building_capital'
					case 2:
						return 'buidling_midcity'
					case 3:
						return 'buidling_urban_1'
					case 4:
						return 'buidling_urban_2'
					case 5:
						return 'buidling_urban_3'
					case 6:
						return 'buidling_urban_4'
					case 7:
						return 'buidling_urban_5'
					case 8:
						return 'buidling_urban_6'
					case 9:
						return 'buidling_countryside'
					default:
						return ''
				}
			},

			getUnitClass(unitType) {
				switch (unitType) {
					case 1:
						return 'panzer_1'
					case 2:
						return 'panzer_2'
					case 3:
						return 'panzer_3'
					case 4:
						return 'panzer_4'
					default:
						return ''
				}
			}
		}
	};

	export default {
		name: "HexMap",
		mixins: [HexMapMixin],
		data() {
			return {
				cellarr: [], //地图列表
				unitarr: [], //单位列表
				selectedUnit: false, //是否选择了单位
				coordinateMap: {},
				attackStatus: [],
				currentAttacker: {},
				effect: false,
				indexMap:null
			}
		}
	}
</script>

<style>
	@import url('../../static/CSS/building.css');
	@import url('../../static/CSS/unit.css');

	.hexmap {
		padding-top: 18px;
		margin-left: -40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: scroll;
		background-image: url("../../static/map/map_cell_2.webp");
	}

	.hex-row {
		display: flex;
		flex-direction: row;
		margin-top: -19px;
		/* 每一行的属性 */
	}

	.hex-row-vice {
		display: flex;
		flex-direction: row;
		margin-top: -19px;
		margin-left: 75px;
	}

	.hex-cell {
		width: 75px;
		height: 75px;
		/* background-color: #eee; */
		/* border: 1px solid #aaa; */
		position: relative;
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
		overflow: visible;

	}

	.hex-cell::before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 1;
		visibility: hidden;
	}


	.hex-cell.selected {
		/* background-color: rgba(192, 192, 192, 0.5); */
	}

	.hex-label {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: beige;
		overflow: visible;
	}

	.unit {
		width: 75px;
		height: 50px;
		background-position: 1px 1px;
		display: block;
		position: absolute;
		transition: all 0.8s ease-in;
	}

	.building {
		width: 90px;
		height: 90px;
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 100%;
		overflow: visible;
		position: absolute;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	.health-bar {
		width: 55px;
		height: 4px;
		display: block;
		background-color: #DC143C;
		margin-top: 10px;
		margin-left: 10px;
		border: 2px solid #837b76;
		border-radius: 10px;
	}

	.health-bar .current-health {
		width: 100%;
		height: 100%;
		display: block;
		background-color: yellowgreen;
		transition: all 0.7s ease
	}

	.unit .unit-tag {
		font-size: 12px;
		margin-left: 10px;
		color: #d1cac5;
		font-family: '微软雅黑';
	}

	.unit .effect {
		background-image: url('../../static/effect/explore.gif');
		width: 50%;
		height: 80%;
		background-position: center;
		background-size: cover;
		margin-left: 20px;
		display: none;
	}

	.unit .effect_wrapper {
		width: 50%;
		height: 80%;
		background-position: center;
		background-size: cover;
		margin-left: 10px;
	}
</style>
