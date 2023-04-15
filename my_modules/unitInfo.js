export default function getUnitInfo(unitType){
	switch(unitType){
		case 'default':
		return {
			
		}
		case 'tank_de'://2号坦克数据
		return {
			combat:40,
			speed:2,
			name:"二号 师",
			costE:220,
			costI:150
		}
		case 'tank_su'://t-26坦克
		return {
			combat:38,
			speed:2,
			name:"T-26 师",
			costE:220,
			costI:150
		}
		case 'tank_heavy_de':
		return {
			combat:50,
			speed:2,
			name:"虎式 师",
			costE:400,
			costI:350
		}
		case 'tank_heavy_su':
		return {
			combat:45,
			speed:2,
			name:"IS-2 师",
			costE:400,
			costI:350
		}
		case 'infantry_de':
		return {
			combat:30,
			speed:1,
			name:"德意志国防军",
			costE:100,
			costI:0
		}
		case 'infantry_su':
		return {
			combat:25,
			speed:1,
			name:"苏联红军",
			costE:100,
			costI:0
		}
		case 'infantry_s_de':
		return {
			combat:32,
			speed:2,
			name:"德意志国防军",
			costE:100,
			costI:50
		}
		case 'infantry_s_su':
		return {
			combat:32,
			speed:2,
			name:"苏联红军",
			costE:100,
			costI:50
		}
		case 'cannon_de':
		return {
			combat:40,
			speed:1,
			name:"Kar88mm ",
			costE:200,
			costI:100
		}
		case 'cannon_su':
		return {
			combat:42,
			speed:1,
			name:"76mm m1942",
			costE:200,
			costI:100
		}
	}
}