export default function getUnitDetail(unitType){
	switch (unitType) {
		case 'tank_de':
		return 'panzer_detail'
		case 'tank_su':
		return 'panzer_detail'
		case 'tank_heavy_de':
		return 'heavy_detail'
		case 'tank_heavy_su':
		return 'heavy_detail'
		case 'cannon_de':
		return 'cannon_detail'
		case 'cannon_su':
		return 'cannon_detail'
		case 'infantry_de':
		return 'infantry_detail'
		case 'infantry_su':
		return 'infantry_detail'
		case 'infanrty_s_de':
		return 'infantry_s_detail'
		case 'infantry_s_su':
		return 'infantry_s_detail'
	}
}