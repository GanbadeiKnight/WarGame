export default function getUnitClass(unitType, headEast) {
	switch (unitType) {
		case 'tank_de':
			return headEast ? 'panzer_1_east' : 'panzer_1_west'
		case 'tank_su':
			return headEast ? 'panzer_2_east' : 'panzer_2_west'
		case 'tank_heavy_de':
			return headEast ? 'panzer_heavy_1_east' : 'panzer_heavy_1_west'
		case 'tank_heavy_su':
			return headEast ? 'panzer_heavy_2_east' : 'panzer_heavy_2_west'
		case 'infantry_su':
			return headEast ? 'infantry_2_east' : 'infantry_2_west'
		case 'infantry_s_su':
			return headEast ? 'infantry_s_2_east' : 'infantry_s_2_west'
		case 'cannon_su':
			return headEast ? 'cannon_2_east' : 'cannon_2_west'
		case 'infantry_de':
			return headEast ? 'infantry_1_east' : 'infantry_1_west'
		case 'infantry_s_de':
			return headEast ? 'infantry_s_1_east' : 'infantry_s_1_west'
		case 'cannon_de':
			return headEast ? 'cannon_1_east' : 'cannon_1_west'
		default:
			return ''
	}
}
