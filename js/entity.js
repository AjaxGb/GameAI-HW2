import { drawSprite } from './utils.js';
import Vec2 from './vec2.js';

export default class Entity {
	constructor(img, x, y, radius=25) {
		this.img = img;
		this.pos = new Vec2(x, y);
		this.radius = radius;
	}
	
	onRender(ctx, delta, engine) {
		const img = engine.images[this.img];
		drawSprite(ctx, img, ...this.pos);
	}
}