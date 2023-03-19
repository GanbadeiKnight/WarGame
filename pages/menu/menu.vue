<template>
	<div class="container">
		<div class="drag">
			<div class="unit_model" @touchstart="createMoveBlocks">
				<img src="../../static/unit/heavy_tank.png">
			</div>
		</div>
	</div>
	
</template>

<script>
	export default{
		data(){
			return{
				flag:false,
			}
		},
		methods:{
		createMoveBlocks(){
			var PositionX = event.touches[0].clientX;
			var PositionY = event.touches[0].clientY;
			console.log(PositionX);
			console.log(PositionY);
			
			// createHexagon(PositionX,PositionY){
			// 	var centerPosition = judgePosition(PositionX,PositionY);
				
				
			// }
		}
		// judgePosition(x,y){
		// 	if()
		// }
	}	
		
	}
	
	
	
</script>

<style>
	.container{
		overflow: scroll;
	}
	.drag {
		overflow: scroll;
		background-color: floralwhite;
		height: 100vh;
		width: 200vw;
		position: relative;
		background-image: url('../../static/ui/map.png');
	}
	.unit_model{
		left:2vw;
		height: 8vw;
		width: 8vw;
		background-color: aquamarine;
		position: absolute;
	}
	.unit_model img{
		width: 8vw;
		top: 2vw;
		position: absolute;
	}
</style>
