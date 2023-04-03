export default function hexFun(center, distance) {
	delete center.z
	const results = [];
	for (let dx = -distance; dx <= distance; dx++) {
		for (let dy = Math.max(-distance, -dx - distance); dy <= Math.min(distance, -dx + distance); dy++) {
			const dz = -dx - dy;
			// if (dx === 0 && dy === 0 && dz === 0) continue; // 去掉中心点自身坐标
			const x = center.x + dx;
			const y = center.y + dy;
			results.push({
				x: x,
				y: y
			});
		}
	}
	return results;
}
