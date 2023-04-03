import hexFun from "./hexFun"

export default function showRange(labelX,labelY,distance) {
	let labelZ = -labelX - labelY
	let center = {
		x: labelX,
		y: labelY,
		z: labelZ
	}
	const result = hexFun(center, distance)
	console.log(result)
	return result
}
