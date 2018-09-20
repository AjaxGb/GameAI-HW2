import Vec2 from './vec2.js';
import { drawSprite } from './utils.js';

export default class Unit {
	constructor(img, x, y, radius=20, facing=0) {
		this.img = img;
		this.pos = new Vec2(x, y);
		this.facing = facing;
		this.radius = radius;
		this.enabled = true;
	}
	
	onRender(ctx, delta, engine) {
		this.facing += delta * 3;
		
		const img = engine.images[this.img];
		const arrow = engine.images.arrow;
		drawSprite(ctx, arrow, ...this.pos,
			this.facing, this.radius, 0);
		drawSprite(ctx, img, ...this.pos);
	}
}
