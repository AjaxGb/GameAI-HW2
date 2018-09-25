import { drawSprite, TAU } from './utils.js';

export class NoticeParticle {
	constructor(unit, img='notice', hopHeight=5, duration=1) {
		this.unit = unit;
		this.img = img;
		
		this.hopHeight = hopHeight;
		this.duration = duration;
		this.timeLeft = duration;
	}
	
	onUpdate(delta, engine) {
		this.timeLeft -= delta;
		if (this.timeLeft <= 0) {
			this.isDead = true;
		}
	}
	
	onRender(ctx, delta, engine) {
		const img = engine.images[this.img];
		
		const [x, y] = this.unit.pos;
		
		drawSprite(ctx, img, x, y - this.unit.radius
			+ Math.min(0, Math.sin(this.timeLeft / this.duration * TAU))
			* this.hopHeight);
	}
}
