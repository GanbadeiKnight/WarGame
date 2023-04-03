export default function doCombat(unit,attacker){
	let randomNum = Math.floor(Math.random() * 13) + 24
	let attackerCombat=attacker.unitInfo.combat
	let defenserCombat=unit.unitInfo.combat
	if(attacker.hp<=75){
		attackerCombat=attackerCombat-2
	}
	if(attacker.hp<=50){
		attackerCombat=attackerCombat-7
	}
	if(unit.hp<=75){
		defenserCombat=attackerCombat-1
	}
	if(unit.hp<=50){
		defenserCombat=attackerCombat-7
	}
	let result1 = parseInt(0.5*randomNum*Math.pow(Math.E,(unit.unitInfo.combat-attacker.unitInfo.combat)*0.04))
	let result2 = parseInt(0.5*randomNum*Math.pow(Math.E,(attacker.unitInfo.combat-unit.unitInfo.combat)*0.04))
	return {
		result1:result1,
		result2:result2
	}
}