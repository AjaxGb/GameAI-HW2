import Vec2 from './vec2.js';
import { drawSprite, clampedAbs, normalizeAngle } from './utils.js';

export default class Unit {
	constructor(img, x, y, facing=0, radius=20) {
		this.img = img;
		this.radius = radius;
		
		this.pos = new Vec2(x, y);
		this.facing = facing;
		
		this.velocity = Vec2.zero;
		this.angularVel = 0;
		
		this.maxAccel = 7;
		this.maxAngularAccel = 10;
		this.maxVelocity = 20;
		this.maxAngularVel = 5;
		
		this.drag = 0.2;
		this.angularDrag = 0.95;
		
		this.steering = null;
		
		this.clampToScreen = true;
	}
	
	onUpdate(delta, engine) {
		if (this.steering) {
			this.lastSteer = this.steering.steer(this, engine)
				|| this.lastSteer;
		} else {
			this.lastSteer = null;
		}
		
		const accel = (this.lastSteer && this.lastSteer.accel)
			? this.lastSteer.accel.capped(this.maxAccel)
			: Vec2.zero;
		const angularAccel = (this.lastSteer
				&& this.lastSteer.angularAccel)
			? clampedAbs(this.lastSteer.angularAccel, this.maxAngularAccel)
			: 0;
		
		this.velocity = this.velocity.add(accel.scaled(delta));
		this.angularVel += angularAccel * delta;
		
		this.velocity = this.velocity.scaled(1 - this.drag * delta);
		this.angularVel *= 1 - this.angularDrag * delta;
		
		this.velocity = this.velocity.capped(this.maxVelocity);
		this.angularVel = clampedAbs(
			this.angularVel, this.maxAngularVel);
	}
	
	onRender(ctx, delta, engine) {
		this.pos = this.pos.add(this.velocity.scaled(delta));
		this.facing = normalizeAngle(
			this.facing + this.angularVel * delta);
		
		if (this.clampToScreen) {
			this.pos = this.pos.clamped(0, 0, engine.width, engine.height);
		}
		
		const img = engine.images[this.img];
		const arrow = engine.images.arrow;
		drawSprite(ctx, arrow, ...this.pos,
			this.facing, this.radius, 0);
		drawSprite(ctx, img, ...this.pos);
		
		if (this.steering && this.steering.debug) {
			this.steering.debug(this, ctx);
		}
	}
}
