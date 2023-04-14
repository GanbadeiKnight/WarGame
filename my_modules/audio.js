const audioObject={
	
	getAudioByUnitType:function(unitType){
		switch(unitType){
			case 'tank_de':
			return this.panzerMoveAudio
			case 'tank_su':
			return this.panzerMoveAudio
			case 'tank_heavy_de':
			return this.panzerMoveAudio
			case 'tank_heavy_su':
			return this.panzerMoveAudio
			case 'infantry_de':
			return this.infantryMoveAudio
			case 'infantry_su':
			return this.infantryMoveAudio
			case 'infantry_s_de':
			return this.wheelMoveAudio
			case 'infantry_s_su':
			return this.wheelMoveAudio
			case 'cannon_de':
			return this.wheelMoveAudio
			case 'cannon_su':
			return this.wheelMoveAudio
		}
	},
	panzerMoveAudio:new Audio('../static/audio/tank.wav'),
	panzerAttackAudio:new Audio('../static/audio/explo.wav'),
	infantryMoveAudio:new Audio('../static/audio/leg.wav'),
	wheelMoveAudio:new Audio('../static/audio/wheel.wav')
}
export default audioObject