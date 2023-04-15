<template>
	<div class="hexmap">
		<div class="UI">
			<div class="economy">
				<img src="../../static/UI/economy.png" />
				<span>{{ economy }}</span>
			</div>
			<div class="industry">
				<img src="../../static/UI/industry.png" />
				<span>{{ industry }}</span>
			</div>
			<div class="date">
				<span>{{date.year}}年{{date.month}}月{{date.date}}日</span>
			</div>
		</div>
		<div :class="rowIndex % 2 === 1 ? 'hex-row' : 'hex-row-vice'" v-for="(row, rowIndex) in rows" :key="rowIndex">
			<div class="hex-cell" v-for="(cell, cellIndex) in row" :key="cellIndex" :class="{ 
				selected: cell.selected ,
				}" @click="selectCell(rowIndex, cellIndex) " ref="cells">
				<!-- <span class="hex-label">{{ cell.label }}

				</span> -->
				<!-- image class="building_capital" v-if="cell.building === 1">
					</image> -->
			</div>
		</div>
		<!-- 遍历生成地图上的地形，建筑 -->
		<div class="building" v-for="(cell,unitIndex) in cellarr" v-show="cell.building>0"
			:class="getBuildingClass(cell.building)"
			:style="{top: cell.positionY+25 + 'px', left: cell.positionX+42 + 'px'}">

		</div>
		<!-- 遍历生成地图上的初始单位 -->
		<transition-group name="fade" tag="div">
			<div class="unit" v-for="(unit,unitIndex) in unitarr" v-if="unit.hasUnit" :key="unitIndex"
				:class="getUnitClass(unit.unitType,unit.headEast)"
				:style="{top: unit.positionY + 'px', left: unit.positionX+ 'px'}"
				@click="selectUnit($event,unit,attackStatus)" :ref="'unit-'+unitIndex">
				<div class="effect_wrapper"></div>
				<div class="effect">
					<span class="damage">-{{damage}}</span>
				</div>
				<div class="hasMove_tag" v-show="unit.hasMove">
					<img src="../../static/UI/hasMove.png">
				</div>
				<div class="health-bar">
					<span class="current-health" :style="{width:unit.hp+'%'}"></span>
				</div>
				<!-- <span class="unit-tag">{{unit.unitInfo.name}}</span> -->
				<div class="unit_detail">
					<div class="image" :class="getUnitDetail(unit.unitType)">
					</div>
					<span>
						<a>{{getUnitInfo(unit.unitType).name}}</a>
						<a>编制剩余：{{unit.hp}}%</a>
						<a>{{ unit.hasMove ? '已行动' : '未行动' }}</a>
						<a>战斗力：{{getUnitInfo(unit.unitType).combat}}</a>
					</span>
				</div>
				
			</div>
		</transition-group>
		<!-- 浮动的计划面板 -->
		<div class="panel_btn" @click="showPanel()">
			计划
		</div>
		<div class="next_turn" @click="throttledNextTurn">
			下一回合
		</div>

		<!-- 单元格详情面板 -->
		<MyPanel :isShowPanel="this.isShowPanel" @update:is-show-panel="updateIsShowPanel" @product-unit="productUnit">
		</MyPanel>
		<div class="turn_pannel" v-show="this.showTurnPannel">
			<span class="close_tag" @click="closeTurnPannel">
				X
			</span>
			<span>
				当前是第{{this.turn}}回合
			</span>
			<span>
				半个月产值： 
			</span>
			<span>
				经济：+{{this.economyIncrease}}
			</span>
			<span>
				工业：+{{this.industryIncrease}}
			</span>
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
	import {
		debounce,
		indexOf
	} from 'lodash';
	import MyPanel from './pannel.vue'
	import getUnitClass from '../../my_modules/getUnitClass.js'
	import getUnitDetail from '../../my_modules/getUnitDetail.js'
	import _ from 'lodash'
	const HexMapMixin = {
		components: {
			MyPanel
		},
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

			let filteredArr = this.cellarr.filter(item => item.hasUnit) //筛选出含有单位的数组
			let cityArr = this.cellarr.filter(item => item.building == 1) //筛选出含有建筑的数组
			let newUnitArr = cloneDeep(filteredArr) //深拷贝的形式进行对象赋值避免带来的连锁效应
			let newCityArr = cloneDeep(cityArr) //深拷贝城市列表
			this.indexMap = new Map() //创建一个新的哈希映射表，使我们两个数组之间后续可以利用下标进行联系
			//将单位加入到哈希表当中
			filteredArr.forEach((item, index) => {
				this.indexMap.set(this.cellarr.indexOf(item), index) //这个哈希表前者为unitarr的下标，后者为cellarr的下标
			})
			//创建一个能够响应的单位列表
			newUnitArr.forEach((item, index) => {
				//赋值到我们的数组当中
				this.unitarr.push(item);
			})
			//创建一个能够响应的城市、工厂列表
			newCityArr.forEach((item, index) => {
				//赋值到我们的数组当中
				this.cityarr.push(item);
			})
			console.log(this.indexMap) //打印检查我们的哈希表
			console.log(this.unitarr[0])
			//进行地图上单位的初始化
			this.unitarr[0].unitType = 'tank_heavy_de'
			this.unitarr[0].unitInfo = getUnitInfo(this.unitarr[0].unitType)
			this.unitarr[1].unitType = 'tank_su'
			this.unitarr[1].unitInfo = getUnitInfo(this.unitarr[1].unitType)
			this.unitarr[2].unitType = 'tank_su'
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
								building: 0,
								unitType: 'default',
								hp: 100,
								unitInfo: getUnitInfo('default'),
								headEast: false,
								hasMove: false
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
								building: 0,
								unitType: 'default',
								hp: 100,
								unitInfo: getUnitInfo('default'),
								headEast: false,
								hasMove: false
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
				if (this.cellarr[rowIndex * 10 + cellIndex].building >= 0) {
					console.log("此处有建筑一座")
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
			selectUnit(event, unit, attackStatus) {
				//如果判定接收到的是一个attack值，则触发攻击判定
				for (let i = 0; i < attackStatus.length; i++) {
					if (attackStatus[i] !== unit.id) continue
					if (attackStatus[i] === unit.id) {
						console.log(attackStatus)
						console.log("触发了攻击事件")
						//这个循环只是用来消除背景颜色
						for (let i = 0; i < attackStatus.length; i++) {
							let index = attackStatus[i]
							let moveCell = document.getElementsByClassName("hex-cell")[index]
							moveCell.style.backgroundColor = ''
						}
						//使用ref的方式绑定每一个单位的唯一标识符，并且能够随时用JS访问到这个单位
						const currentUnit = this.$refs['unit-' + this.unitarr.indexOf(unit)]
						console.log(currentUnit[0])

						//进行战斗计算
						this.damage = doCombat(unit, this.currentAttacker).result1
						this.currentAttacker.hp = this.currentAttacker.hp - doCombat(unit, this.currentAttacker)
							.result1
						unit.hp = unit.hp - doCombat(unit, this.currentAttacker).result2
						this.currentAttacker.hasMove = true
						console.log("进攻者与防御者的生命值剩余：" + this.currentAttacker.hp, unit.hp)
						if (unit.hp <= 0) {
							unit.hasUnit = false
							// this.unitarr.splice(this.unitarr.indexOf(unit),1)
							this.cellarr[unit.id].hasUnit = false
							console.log("防御者已被消灭")
						}
						if (this.currentAttacker.hp <= 0) {
							this.currentAttacker.hasUnit = false
							// this.unitarr.splice(this.unitarr.indexOf(this.currentAttacker),1)
							this.cellarr[this.currentAttacker.id].hasUnit = false
							console.log("进攻者已被消灭")
						}
						this.attackStatus = []
						//播放进攻音效
						audio.panzerAttackAudio.volume = 0.5
						audio.panzerAttackAudio.play()
						//实现攻击特效
						const effect_open = currentUnit[0].querySelectorAll('.effect')
						const effect_close = currentUnit[0].querySelectorAll('.effect_wrapper')
						effect_open.forEach((item) => {
							console.log("执行了内部")
							item.style.display = 'block';
						})
						effect_close.forEach((item) => {
							item.style.display = 'none';
						})
						let timer = setTimeout(() => {
							effect_open.forEach((item) => {
								item.style.display = 'none';
							})
							effect_close.forEach((item) => {
								item.style.display = 'block';
							})
							clearTimeout(timer)
						}, 500)
						if (unit.positionX > this.currentAttacker.positionX) {
							this.currentAttacker.headEast = true
						} else if (unit.positionX < this.currentAttacker.positionX) {
							this.currentAttacker.headEast = false
						}
					}

					return
				}


				//分割线
				//通常状态下的触发
				//倘若单位已经在本回合移动，则不允许单位再次进行移动
				if (unit.hasMove) {
					return
				}
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
				const preventUnitX = JSON.parse(JSON.stringify(unit.positionX))
				unit.id = JSON.parse(JSON.stringify(this.cellarr[index].id))
				this.indexMap.set(unit.id, this.unitarr.indexOf(unit))
				unit.positionX = JSON.parse(JSON.stringify(this.cellarr[index].positionX))
				unit.positionY = JSON.parse(JSON.stringify(this.cellarr[index].positionY))
				unit.x = JSON.parse(JSON.stringify(this.cellarr[index].x))
				unit.y = JSON.parse(JSON.stringify(this.cellarr[index].y))
				console.log("标记" + unit.x + unit.y)
				//将当前单元格标记为有单位存在
				this.cellarr[index].hasUnit = true
				console.log(unit)
				//清空单位当前移动状态
				unit.hasMove = true
				//判断单位是否向东
				if (unit.positionX > preventUnitX) {
					unit.headEast = true
					console.log("单位现在向东")
					console.log()
				} else if (unit.positionX < preventUnitX) {
					unit.headEast = false
				}
				//播放移动音效
				// const audio = new Audio('../static/audio/tank.wav')
				audio.getAudioByUnitType(unit.unitType).volume = 0.2
				audio.getAudioByUnitType(unit.unitType).play()
				//禁用对应的单元格的cell.building的点击事件使我们的单位能够进去

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
					if (this.cellarr[index].hasUnit && this.unitarr[this.indexMap.get(index)].team !== unit.team) {
						console.log(this.indexMap)
						console.log(this.unitarr[this.indexMap.get(index)] + "这里这里这里")
						console.log("攻击范围内有敌人")
						//搜寻到此网格并且使这个网格染成红色
						const moveCell = document.getElementsByClassName("hex-cell")[index]
						const timerRed = setTimeout(() => {
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
			getUnitClass(unitType, headEast) {
				return getUnitClass(unitType, headEast)
			},
			getUnitDetail(unitType) {
				return getUnitDetail(unitType)
			},
			getUnitInfo(unitType) {
				return getUnitInfo(unitType)
			},

			//显示单元格面板
			showPanel() {
				this.isShowPanel = true
				console.log("显示面板")
				const nextTurnAudio = new Audio('../../../static/audio/btn.wav')
				nextTurnAudio.play()
			},
			//接收来自子组件的数据
			updateIsShowPanel(value) {
				this.isShowPanel = value
			},
			//执行生产单位的操作
			productUnit(unitType) {
				console.log("执行生产" + unitType + "操作")
				this.cityarr.forEach((item, index) => {
					console.log(item)
					const moveCell = document.getElementsByClassName("building")[item.id]
					// moveCell.style.backgroundColor="rgba(255, 132, 25, 0.4)"
					// 创建新的 img 元素
					const productImg = document.createElement("img")
					productImg.src = "../../static/UI/cards/product.gif"

					// 设置 .product_img 元素的样式
					const cellStyle = window.getComputedStyle(moveCell)
					productImg.style.opacity = "0.6"
					productImg.style.position = "absolute"
					productImg.style.width = cellStyle.width
					productImg.style.height = cellStyle.height
					productImg.style.transform = "scale(0.7)"
					productImg.style.pointerEvents = 'auto'
					//为其添加点击事件
					productImg.addEventListener('click', function() {
						this.clickProduct(unitType, item.id, productImg);
					}.bind(this))

					// 将 .product_img 元素插入到 moveCell 中
					moveCell.appendChild(productImg)
				})
			},
			//实现根据坐标位置生产单位
			clickProduct(unitType, id, productImg) {
				//防止重复生产
				if (this.cellarr[id].hasUnit === true) {
					productImg.remove()
					return
				}
				//在资源不够时执行
				if(this.economy<getUnitInfo(unitType).costE||this.industry<getUnitInfo(unitType).costI){
					const cancelAudio = new Audio('../../../static/audio/cancel.wav')
					cancelAudio.play()
					productImg.remove()
					return
				}
				this.economy-=getUnitInfo(unitType).costE
				this.industry-=getUnitInfo(unitType).costI
				console.log("生产了单位！" + unitType + id)
				this.cellarr[id].hasUnit = true
				let newUnit = cloneDeep(this.cellarr[id])
				this.unitarr.push(newUnit)
				// console.log(this.unitarr)
				//将新单位加入哈希表
				this.indexMap.set(id, this.unitarr.length - 1)
				console.log(this.indexMap)
				this.unitarr[this.unitarr.length - 1].team = 1
				this.unitarr[this.unitarr.length - 1].hasMove = true
				this.unitarr[this.unitarr.length - 1].unitType = unitType
				this.unitarr[this.unitarr.length - 1].unitInfo = getUnitInfo(this.unitarr[this.unitarr.length - 1].unitType)
				productImg.remove()
				//播放生产单位的音效
				const draftAudio = new Audio('../../../static/audio/draft.wav')
				setTimeout((draftAudio) => {
					draftAudio.play()
				}, 450, draftAudio)
			},
			closeTurnPannel(){
				this.showTurnPannel = false
				const nextTurnAudio = new Audio('../../../static/audio/btn.wav')
				nextTurnAudio.play()
			},
			//进行下一回合的功能
			nextTurn() {
				//更新资源
				this.economy = this.economy + this.economyIncrease
				this.industry = this.industry + this.industryIncrease
				this.turn++
				//使所有单位能够行动
				for (let i = 0; i < this.unitarr.length; i++) {
					this.unitarr[i].hasMove = false
				}
				//执行AI功能
				//AIfun()
				//更新日期
				addNumberEveryShortTime.call(this, this.date.date)
				function addNumberEveryShortTime(num, endNum) {
					let count = 0;
					const intervalId = setInterval(() => {
						num++
						count++
						// 触发Vue2的响应式更新，并将data.data设置为num的值
						this.$set(this.date, 'date', num)
						if (count >= 15) {
							clearInterval(intervalId)
							if (num >= 30) {
								this.date.date = 1
								this.date.month = this.date.month + 1
							}
						}
						
					}, 100); // 间隔为100ms
					
				}
				const that = this
				setTimeout(function(that){
					that.showTurnPannel = true
					const popAudio = new Audio('../../../static/audio/pop.wav')
					popAudio.play()
				},1500,that)

				
				if (this.date.month >= 12) {
					this.date.month = 1
					this.date.year = this.date.year + 1
				}
				//播放音效
				const nextTurnAudio = new Audio('../../../static/audio/btn.wav')
				nextTurnAudio.play()
			},
			//对我们下一个回合这个函数进行一次优化，使其在1.5秒内最多执行一次，防止抖动
			throttledNextTurn: _.throttle(function(){
				this.nextTurn()
			},1500)
		}
	}

	export default {
		name: "HexMap",
		mixins: [HexMapMixin],
		data() {
			return {
				cellarr: [], //地图列表
				unitarr: [], //单位列表
				cityarr: [], //城市列表
				selectedUnit: false, //是否选择了单位
				coordinateMap: {},
				attackStatus: [],
				currentAttacker: {},
				effect: false, //特效状态的打开与否
				indexMap: null, //设定单元格数组到单位数组之间的联系
				economy: 350, //现有经济
				industry: 200, //现有工业物资积攒
				economyIncrease: 100,//经济产值
				industryIncrease: 75,//工业产值
				date: {
					year: 1942,
					month: 9,
					date: 1
				},
				turn: 1, //当前回合数
				damage: 0, //当前攻击造成的伤害值
				isShowPanel: false,//是否显示计划面板
				showTurnPannel: false//是否显示回合面板

			}
		}
	}
</script>

<style>
	@import url('../../static/CSS/building.css');
	@import url('../../static/CSS/unit.css');
	@import url('../../static/CSS/detail.css');

	.hexmap {
		/* padding-top: 18px; */
		/* margin-left: -40px; */
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


	/* .hex-cell.selected {
		background-color: rgba(192, 192, 192, 0.5);
	} */

	/* .hex-cell:hover {
		background-color: rgba(223, 223, 223, 0.2);
	}
 */
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
		transition: left 0.8s ease-in, top 0.8s ease-in, opacity;
		background-repeat: no-repeat;
	}

	.unit:hover .unit_detail {
		display: block;
		opacity: 1;
	}

	.fade-enter {
		transform: translateY(-50%);
	}

	.fade-enter-active {
		transition: transform 1s cubic-bezier(1, -0.02, 0.24, 0.98);
	}

	.fade-enter-to {
		transform: translateY(0);
	}

	.fade-leave-active {
		transition: opacity 1s;
	}

	.fade-leave-to {
		opacity: 0;
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
		color: #ffffff;
		font-size: 30px;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.damage {
		margin-left: 30px;
		display: inline-block;
		position: relative;
		font-family: '方正综艺简体';
	}

	.unit .effect_wrapper {
		width: 50%;
		height: 80%;
		background-position: center;
		background-size: cover;
		margin-left: 10px;
	}

	.unit_detail {
		width: 135px;
		height: 220px;
		background-color: rgba(223, 223, 223, 0.5);
		position: fixed;
		top: 10%;
		left: 1%;
		/* display: none; */
		transition: opacity 0.3s ease-in-out, max-height 0.3s ease-in-out;
		opacity: 0;
		font-family: '方正综艺简体';
		color: #000000;
	}

	.unit_detail .image {
		position: absolute;
		top: 10px;
		left: 18px;
		width: 95px;
		margin: auto;
		height: 100px;
	}

	.unit_detail span {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 120px;
		left: 20px;
	}

	.UI {
		width: 100%;
		height: 30px;
		line-height: 30px;
		/* display: flex;
		justify-content: center; */
		/* align-items: center; */
		font-size: 15px;
		/* background-color: rgba(243, 219, 255, 0.3) */
	}

	.economy {
		margin-left: 30px;
		margin-right: 50px;
		display: inline-block;
		font-family: '方正综艺简体';
		font-size: 20px;
	}

	.industry {
		display: inline-block;
		font-family: '方正综艺简体';
		font-size: 20px;
	}

	.date {
		margin-left: 500px;
		display: inline-block;
		color: white;
		font-family: '方正综艺简体';
		font-size: 16px;
	}

	.economy img,
	.industry img {
		width: 15px;
		height: 15px;
		margin-right: 5px;
	}

	.panel_btn {
		position: fixed;
		margin-left: 450px;
		margin-top: -245px;
		font-size: 18px;
		font-family: '方正综艺简体';
	}

	.panel_btn:hover {
		color: aliceblue;
		transition: all 0.7s ease-out;
		cursor: pointer;
		font-size: 20px;
	}

	.next_turn {
		position: fixed;
		margin-left: 420px;
		margin-top: 250px;
		font-size: 18px;
		font-family: '方正综艺简体';
	}

	.next_turn:hover {
		color: aliceblue;
		transition: all 0.7s ease-out;
		cursor: pointer;
		font-size: 20px;
	}
	
	.unit .hasMove_tag {
		position: absolute;
		left: 70px;
		opacity: 0.6;
	}
	.unit .hasMove_tag img {
	  transform: scale(0.5);
	}
	
	.turn_pannel {
		position: fixed;
		width: 200px;
		height: 120px;
		background-image: url('../../static/UI/pannel_background.png');
		background-position: -20px -46px;
		font-family: '方正综艺简体';
		/* transform: translate(-100%,-150%); */
		transform: scale(2);
	}
	
	.turn_pannel span{
		display: block;
		margin-left: 10px;
	}
	
	.turn_pannel .close_tag{
		transform: translate(90%, 10%);
		font-family: '方正综艺简体';
		cursor: pointer;
	}
</style>
