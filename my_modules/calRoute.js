import showRange from './showRange.js'
import doCombat from './doCombat.js'
import audio from './audio.js'
export default function calRoute(unit){
	let tempofFinalDistance=100
	let nextCell = {}
	//这个数组用于存储已经存在单位或是被不可通过地形所阻挡的地块坐标
	//初始化，此处根据的是地图上的山脉这些不可通过区域进行初始化
	let cantMove =[
		{x:1,y:0},
		{x:2,y:0},
		{x:1,y:1},
		{x:3,y:2},
		{x:2,y:3},
		{x:3,y:3},
		{x:2,y:4}
	]
	for(let i=0;i<this.unitarr.length;i++){
		if(this.unitarr[i].hasUnit){
			cantMove.push({
				x:this.unitarr[i].x,
				y:this.unitarr[i].y
			})
		}
	}
	//计算理论上当前坐标距离最终坐标的距离
	const distanceArr = showRange(unit.x,unit.y,1)
	for(let i=0;i<cantMove.length;i++){
		for(let j=0;j<distanceArr.length;j++){
			if(this.cellarr[this.coordinateMap[`${distanceArr[j].x},${distanceArr[j].y}`]]!==undefined&&this.cellarr[this.coordinateMap[`${distanceArr[j].x},${distanceArr[j].y}`]].hasUnit&&this.unitarr[this.indexMap.get(this.coordinateMap[`${distanceArr[j].x},${distanceArr[j].y}`])].team!==unit.team){
				console.log("执行进攻敌方单位")
				let beAttacker = this.unitarr[this.indexMap.get(this.coordinateMap[`${distanceArr[j].x},${distanceArr[j].y}`])]
				this.damage = doCombat(beAttacker,unit).result1
				unit.hp = unit.hp - this.damage
				beAttacker.hp = beAttacker.hp - doCombat(beAttacker,unit).result2
                unit.hasMove = true
				if (beAttacker.hp <= 0) {
					beAttacker.hasUnit = false
					// this.unitarr.splice(this.unitarr.indexOf(unit),1)
					this.cellarr[beAttacker.id].hasUnit = false
					this.indexMap.delete(beAttacker.id)
					console.log("防御者已被消灭")
					beAttacker.exp=beAttacker.exp+35
					if(beAttacker.exp>=100){
						beAttacker.exp = beAttacker.exp-100
						beAttacker.hp=beAttacker.hp+50
					}
				}
				if (unit.hp <= 0) {
					unit.hasUnit = false
					// this.unitarr.splice(this.unitarr.indexOf(unit),1)
					this.cellarr[unit.id].hasUnit = false
					this.indexMap.delete(unit.id)
					console.log("进攻者已被消灭")
					unit.exp=unit.exp+35
					if(unit.exp>=100){
						unit.exp = unit.exp-100
						unit.hp=unit.hp+50
					}
				}
				//播放进攻音效
				audio.panzerAttackAudio.volume = 0.5
				audio.panzerAttackAudio.play()
				//实现攻击特效
				const currentUnit = this.$refs['unit-' + this.unitarr.indexOf(beAttacker)]
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
				return
			}
			if(cantMove[i].x===distanceArr[j].x&&cantMove[i].y===distanceArr[j].y){
				distanceArr.splice(j, 1);
				j--;
			}
			
		}
	}
	for(let i=0;i<distanceArr.length;i++){
		let finalDistance=Math.abs(distanceArr[i].x-this.targetCity.x)+Math.abs(distanceArr[i].y-this.targetCity.y)
		if(finalDistance<=tempofFinalDistance&&this.cellarr[this.coordinateMap[`${distanceArr[i].x},${distanceArr[i].y}`]]!==undefined){
			if(i!==0&&distanceArr[i].x>=distanceArr[i-1].x){
				tempofFinalDistance=finalDistance
				nextCell={
					x:distanceArr[i].x,
					y:distanceArr[i].y
				}
			}else if(i===0){
				tempofFinalDistance=finalDistance
				nextCell={
					x:distanceArr[i].x,
					y:distanceArr[i].y
				}
			}
		}
	}
	// return nextCell
	if(Object.keys(nextCell).length === 0){
		nextCell={
			x:unit.x + 1,
			y:unit.y
		}
	}
	let index = this.coordinateMap[`${nextCell.x},${nextCell.y}`]
	//执行单位进行移动
	this.cellarr[unit.id].hasUnit = false
	this.indexMap.delete(unit.id)
	const preventUnitX = JSON.parse(JSON.stringify(unit.positionX))
	unit.id = JSON.parse(JSON.stringify(this.cellarr[index].id))
	this.indexMap.set(unit.id, this.unitarr.indexOf(unit))
	unit.positionX = JSON.parse(JSON.stringify(this.cellarr[index].positionX))
	unit.positionY = JSON.parse(JSON.stringify(this.cellarr[index].positionY))
	unit.x = JSON.parse(JSON.stringify(this.cellarr[index].x))
	unit.y = JSON.parse(JSON.stringify(this.cellarr[index].y))
	this.cellarr[index].hasUnit = true
	this.cellarr[index].team=JSON.parse(JSON.stringify(unit.team))
	if (unit.positionX > preventUnitX) {
		unit.headEast = true
	} else if (unit.positionX < preventUnitX) {
		unit.headEast = false
	}
	//播放移动音效
	audio.getAudioByUnitType(unit.unitType).volume = 0.2
	audio.getAudioByUnitType(unit.unitType).play()
}