export default function doCombat(unit,attacker){
	let randomNum = Math.floor(Math.random() * 13) + 24
	let attackerCombat=attacker.unitInfo.combat
	let defenserCombat=unit.unitInfo.combat
	if(attacker.status==='low_morale'){
		attacker.unitInfo.combat=attacker.unitInfo.combat - 10
	}
	if(unit.status==='low_morale'){
		unit.unitInfo.combat=unit.unitInfo.combat - 10
	}
	if(attacker.hp<=75){
		attacker.unitInfo.combat=attacker.unitInfo.combat-2
	}
	if(attacker.hp<=50){
		attacker.unitInfo.combat=attacker.unitInfo.combat-7
	}
	if(unit.hp<=75){
		unit.unitInfo.combat=unit.unitInfo.combat-1
	}
	if(unit.hp<=50){
		unit.unitInfo.combat=unit.unitInfo.combat-7
	}
	unit.exp=unit.exp+2
	attacker.exp=attacker.exp+5
	console.log("经验增加了")
	let result1 = parseInt(0.5*randomNum*Math.pow(Math.E,(unit.unitInfo.combat-attacker.unitInfo.combat)*0.04))
	let result2 = parseInt(0.5*randomNum*Math.pow(Math.E,(attacker.unitInfo.combat-unit.unitInfo.combat)*0.04))
	return {
		result1:result1,
		result2:result2
	}
}