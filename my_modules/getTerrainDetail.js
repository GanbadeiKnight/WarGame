export default function getTerrainDetail(terrain){
	if(0 < terrain && terrain < 10){
		return '../../static/map/terrain/realfarm.png'
	}
	if(10 < terrain && terrain < 20){
		return '../../static/map/terrain/realforest.png'
	}
	if(20 < terrain && terrain < 30){
		return '../../static/map/terrain/realwetland.png'
	}
}