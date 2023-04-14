export default function getUnitInfo(unitType){
	switch(unitType){
		case 'default':
		return {
			
		}
		case 'tank_de'://2号坦克数据
		return {
			combat:40,
			speed:2,
			name:"二号"
		}
		case 'tank_su'://t-34坦克
		return {
			combat:42,
			speed:2,
			name:"T-34"
		}
		case 'tank_heavy_de':
		return {
			combat:55,
			speed:2,
			name:"tiger"
		}
		case 'tank_heavy_su':
		return {
			combat:50,
			speed:2,
			name:"IS-2"
		}
		case 'infantry_de':
		return {
			combat:30,
			speed:1,
			name:"Germany_infantry"
		}
		case 'infantry_su':
		return {
			combat:25,
			speed:1,
			name:"Soviet_infantry"
		}
		case 'infantry_s_de':
		return {
			combat:32,
			speed:2,
			name:"motar_infantry_Germany"
		}
		case 'infantry_s_su':
		return {
			combat:32,
			speed:2,
			name:"motar_infantry_Soviet"
		}
		case 'cannon_de':
		return {
			combat:40,
			speed:1,
			name:"Germany_cannon"
		}
		case 'cannon_su':
		return {
			combat:42,
			speed:1,
			name:"Soviet_cannon"
		}
	}
}