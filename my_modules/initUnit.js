import getUnitInfo from "./unitInfo"

export default function initUnit(){
	
	//进行单位具体信息的指定
	this.unitarr[0].unitType = 'infantry_su'
	this.unitarr[0].unitInfo = getUnitInfo(this.unitarr[0].unitType)
	this.unitarr[0].team = 1
	this.unitarr[0].status = 'low_morale'
	this.unitarr[1].unitType = 'cannon_su'
	this.unitarr[1].unitInfo = getUnitInfo(this.unitarr[1].unitType)
	this.unitarr[1].unitInfo.tag = '西方面军'
	this.unitarr[1].team = 1
	this.unitarr[1].status = 'low_morale'
	this.unitarr[2].unitType = 'infantry_su'
	this.unitarr[2].unitInfo = getUnitInfo(this.unitarr[2].unitType)
	this.unitarr[2].team = 1
	this.unitarr[2].status = 'low_morale'
	
	this.unitarr[3].unitType = 'tank_de'
	this.unitarr[3].unitInfo = getUnitInfo(this.unitarr[3].unitType)
	this.unitarr[3].team = 0
	
	this.unitarr[4].unitType = 'infantry_su'
	this.unitarr[4].unitInfo = getUnitInfo(this.unitarr[4].unitType)
	this.unitarr[4].team = 1
	this.unitarr[4].status = 'low_morale'
	this.unitarr[5].unitType = 'infantry_su'
	this.unitarr[5].unitInfo = getUnitInfo(this.unitarr[5].unitType)
	this.unitarr[5].team = 1
	this.unitarr[5].status = 'low_morale'
	
	this.unitarr[6].unitType = 'infantry_s_de'
	this.unitarr[6].unitInfo = getUnitInfo(this.unitarr[6].unitType)
	this.unitarr[6].team = 0
	this.unitarr[7].unitType = 'infantry_de'
	this.unitarr[7].unitInfo = getUnitInfo(this.unitarr[7].unitType)
	this.unitarr[7].team = 0
	this.unitarr[8].unitType = 'infantry_de'
	this.unitarr[8].unitInfo = getUnitInfo(this.unitarr[8].unitType)
	this.unitarr[8].team = 0
	this.unitarr[9].unitType = 'infantry_de'
	this.unitarr[9].unitInfo = getUnitInfo(this.unitarr[9].unitType)
	this.unitarr[9].team = 0
	
	this.unitarr[10].unitType = 'cannon_su'
	this.unitarr[10].unitInfo = getUnitInfo(this.unitarr[10].unitType)
	this.unitarr[10].team = 1
	this.unitarr[11].unitType = 'infantry_su'
	this.unitarr[11].unitInfo = getUnitInfo(this.unitarr[11].unitType)
	this.unitarr[11].team = 1
	this.unitarr[12].unitType = 'cannon_su'
	this.unitarr[12].unitInfo = getUnitInfo(this.unitarr[12].unitType)
	this.unitarr[12].team = 1
	this.unitarr[13].unitType = 'tank_su'
	this.unitarr[13].unitInfo = getUnitInfo(this.unitarr[13].unitType)
	this.unitarr[13].team = 1
	this.unitarr[14].unitType = 'cannon_su'
	this.unitarr[14].unitInfo = getUnitInfo(this.unitarr[14].unitType)
	this.unitarr[14].team = 1
	this.unitarr[15].unitType = 'infantry_su'
	this.unitarr[15].unitInfo = getUnitInfo(this.unitarr[15].unitType)
	this.unitarr[15].team = 1
	this.unitarr[16].unitType = 'tank_su'
	this.unitarr[16].unitInfo = getUnitInfo(this.unitarr[16].unitType)
	this.unitarr[16].team = 1
	
	this.unitarr[17].unitType = 'infantry_de'
	this.unitarr[17].unitInfo = getUnitInfo(this.unitarr[17].unitType)
	this.unitarr[17].team = 0
	this.unitarr[18].unitType = 'infantry_de'
	this.unitarr[18].unitInfo = getUnitInfo(this.unitarr[18].unitType)
	this.unitarr[18].team = 0
	this.unitarr[19].unitType = 'tank_heavy_de'
	this.unitarr[19].unitInfo = getUnitInfo(this.unitarr[19].unitType)
	this.unitarr[19].team = 0
	
	this.unitarr[20].unitType = 'infantry_su'
	this.unitarr[20].unitInfo = getUnitInfo(this.unitarr[20].unitType)
	this.unitarr[20].team = 1
	this.unitarr[21].unitType = 'infantry_su'
	this.unitarr[21].unitInfo = getUnitInfo(this.unitarr[21].unitType)
	this.unitarr[21].team = 1
	this.unitarr[22].unitType = 'infantry_su'
	this.unitarr[22].unitInfo = getUnitInfo(this.unitarr[22].unitType)
	this.unitarr[22].team = 1
	
	this.unitarr[23].unitType = 'tank_de'
	this.unitarr[23].unitInfo = getUnitInfo(this.unitarr[23].unitType)
	this.unitarr[23].team = 0
	
	this.unitarr[24].unitType = 'infantry_su'
	this.unitarr[24].unitInfo = getUnitInfo(this.unitarr[24].unitType)
	this.unitarr[24].team = 1
	this.unitarr[25].unitType = 'cannon_su'
	this.unitarr[25].unitInfo = getUnitInfo(this.unitarr[25].unitType)
	this.unitarr[25].team = 1
	
	this.unitarr[26].unitType = 'infantry_s_de'
	this.unitarr[26].unitInfo = getUnitInfo(this.unitarr[26].unitType)
	this.unitarr[26].team = 0
	this.unitarr[27].unitType = 'tank_de'
	this.unitarr[27].unitInfo = getUnitInfo(this.unitarr[27].unitType)
	this.unitarr[27].team = 0
	this.unitarr[28].unitType = 'tank_de'
	this.unitarr[28].unitInfo = getUnitInfo(this.unitarr[28].unitType)
	this.unitarr[28].team = 0
	
	this.unitarr[29].unitType = 'infantry_su'
	this.unitarr[29].unitInfo = getUnitInfo(this.unitarr[29].unitType)
	this.unitarr[29].team = 1
	this.unitarr[30].unitType = 'infantry_su'
	this.unitarr[30].unitInfo = getUnitInfo(this.unitarr[30].unitType)
	this.unitarr[30].team = 1
	
	this.unitarr[31].unitType = 'infantry_de'
	this.unitarr[31].unitInfo = getUnitInfo(this.unitarr[31].unitType)
	this.unitarr[31].team = 0
	this.unitarr[32].unitType = 'infantry_s_de'
	this.unitarr[32].unitInfo = getUnitInfo(this.unitarr[32].unitType)
	this.unitarr[32].team = 0
	this.unitarr[33].unitType = 'tank_de'
	this.unitarr[33].unitInfo = getUnitInfo(this.unitarr[33].unitType)
	this.unitarr[33].team = 0
	this.unitarr[34].unitType = 'tank_de'
	this.unitarr[34].unitInfo = getUnitInfo(this.unitarr[34].unitType)
	this.unitarr[34].team = 0
}