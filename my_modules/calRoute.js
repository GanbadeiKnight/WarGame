import showRange from './showRange.js'
export default function calRoute(unit){
	let tempofFinalDistance=100
	let nextCell = {}
	//这个数组用于存储已经存在单位或是被不可通过地形所阻挡的地块坐标
	let cantMove =[]
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
			if(cantMove[i].x===distanceArr[j].x&&cantMove[i].y===distanceArr[j].y){
				distanceArr.splice(j, 1);
				j--;
			}
		}
	}
	for(let i=0;i<distanceArr.length;i++){
		let finalDistance=Math.abs(distanceArr[i].x-this.targetCity.x)+Math.abs(distanceArr[i].y-this.targetCity.y)
		console.log(finalDistance+"索引"+i)
		if(finalDistance<tempofFinalDistance){
			tempofFinalDistance=finalDistance
			nextCell={
				x:distanceArr[i].x,
				y:distanceArr[i].y
			}
		}
	}
	console.log(nextCell)
	// return nextCell
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
	unit.hasMove = true
	if (unit.positionX > preventUnitX) {
		unit.headEast = true
	} else if (unit.positionX < preventUnitX) {
		unit.headEast = false
	}
	console.log(unit)
}