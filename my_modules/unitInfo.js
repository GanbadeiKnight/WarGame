export default function getUnitInfo(unitType){
	switch(unitType){
		case 'default':
		return {
			
		}
		case 1://2号坦克数据
		return {
			combat:45,
			speed:2,
			name:"二号"
		}
		case 2://通用坦克数据
		return {
			combat:40,
			speed:2,
			name:"M3格兰特"
		}
	}
}