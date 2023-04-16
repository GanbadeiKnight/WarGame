export default function getUnitDetail(unitType){
	switch (unitType) {
		case 'tank_de':
		return 'panzer_detail_de'
		case 'tank_su':
		return 'panzer_detail_su'
		case 'tank_heavy_de':
		return 'heavy_detail_de'
		case 'tank_heavy_su':
		return 'heavy_detail_su'
		case 'cannon_de':
		return 'cannon_detail_de'
		case 'cannon_su':
		return 'cannon_detail_su'
		case 'infantry_de':
		return 'infantry_detail_de'
		case 'infantry_su':
		return 'infantry_detail_su'
		case 'infanrty_s_de':
		return 'infantry_s_detail_de'
		case 'infantry_s_su':
		return 'infantry_s_detail_su'
	}
}