<template>
	<div class="unit_panze_1" :style="{ top: positionY, left: positionX }">
	</div>
</template>

<script>
	export default {
		name: 'Unit',
		props: ['positionX', 'positionY','units'],
		data(){
			return {
				units:[{
					id:'',
					positionX: 1500+"px",
					positionY: 200+"px",
					rowIndex:'1',
					cellIndex:'1'
				},
				]
			}
		}
	}
</script>

<style scoped>
	.unit_panze_1 {
		width: 75px;
		height: 50px;
		background-image: url('../../static/unit/tank_de_hd.png');
		background-position: 1px 1px;
		display: block;
		position: absolute;
		transform: scaleX(-1);
	}
</style>
