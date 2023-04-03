const audioObject={
	
	getAudioByUnitType:function(unitType){
		switch(unitType){
			case 1:
			return this.panzerMoveAudio
			case 2:
			return this.panzerMoveAudio
		}
	},
	panzerMoveAudio:new Audio('../static/audio/tank.wav'),
	panzerAttackAudio:new Audio('../static/audio/explo.wav')
}
export default audioObject