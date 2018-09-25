
export const TAU = 6.283185307179586477;

export function drawSprite(ctx, img, x, y, rot=0, offx=0, offy=0) {
	if (rot) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rot);
		ctx.drawImage(img,
			offx - img.width / 2,
			offy - img.height / 2);
		ctx.restore();
	} else {
		ctx.drawImage(img,
			(x + offx - img.width / 2)|0,
			(y + offy - img.height / 2)|0);
	}
}

export function randomAngle() {
	return Math.random() * TAU - Math.PI;
}

export function clamped(n, min, max) {
	return Math.min(Math.max(n, min), max);
}

export function clampedAbs(n, max) {
	return Math.min(Math.max(n, -max), max);
}

export function floorMod(n, d) {
	return (n % d + d) % d;
}

export function normalizeAngle(a) {
	return floorMod(a + Math.PI, TAU) - Math.PI;
}

export function removeWhere(arr, cond) {
	let i = arr.length;
	while (i--) {
		if (cond(arr[i], i, arr)) {
			arr.splice(i, 1);
		}
	}
}
