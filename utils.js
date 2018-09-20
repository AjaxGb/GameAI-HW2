
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
	return Math.random() * Math.PI * 2;
}
