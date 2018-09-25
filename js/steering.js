import Vec2 from './vec2.js';
import { normalizeAngle, TAU } from './utils.js';

function smallestAngleDiff(from, to) {
	return normalizeAngle(to - from); 
}

export class WanderSteer {
	constructor(distance, radius) {
		this.distance = distance;
		this.radius = radius;
	}
	
	steer(unit, engine) {
		if (engine.frame % 5 !== 0) {
			//return;
		}
		
		const offset =
			Vec2.fromAngle(unit.facing, this.distance)
				.add(Vec2.randomOnCircle(this.radius));
		
		const heading = offset.toAngle();
		
		this.target = unit.pos.add(offset);
		
		return {
			accel: Vec2.fromAngle(unit.facing, 100),
			angularAccel: smallestAngleDiff(unit.facing, heading)
				/ (1 - unit.angularDrag),
		};
	}
	
	debug(unit, ctx) {
		if (!this.target) return;
		ctx.beginPath();
		ctx.moveTo(...unit.pos);
		ctx.lineTo(...this.target);
		ctx.stroke();
	}
}

export class PursueSteer {
	constructor(target) {
		this.target = target;
	}
	
	steer(unit, engine) {
		const offset = this.target.pos.sub(unit.pos);
		const heading = offset.toAngle();
		
		return {
			accel: Vec2.fromAngle(unit.facing, 100),
			angularAccel: smallestAngleDiff(unit.facing, heading),
		};
	}
	
	debug(unit, ctx) {
		if (!this.target) return;
		ctx.beginPath();
		ctx.moveTo(...unit.pos);
		ctx.lineTo(...this.target.pos);
		ctx.stroke();
	}
}

export class FleeSteer {
	constructor(target) {
		this.target = target;
	}
	
	steer(unit, engine) {
		
		const offset = unit.pos.sub(this.target.pos);
		const heading = offset.toAngle();
		
		return {
			accel: Vec2.fromAngle(unit.facing, 100),
			angularAccel: smallestAngleDiff(unit.facing, heading),
		};
	}
	
	debug(unit, ctx) {
		if (!this.target) return;
		ctx.beginPath();
		ctx.moveTo(...unit.pos);
		ctx.lineTo(...this.target.pos);
		ctx.stroke();
	}
}

export class PathSteer {
	constructor(path, nodeRadius=20) {
		this.path = path;
		this.nodeRadius = nodeRadius;
		this.pathI = 0;
		
		this.finalCallbacks = [];
	}
	
	reachedDestination() {
		return new Promise(result => {
			this.finalCallbacks.push(result);
		});
	}
	
	steer(unit, engine) {
		let target = this.path[this.pathI];
		
		if (unit.pos.withinRadius(target, this.nodeRadius)) {
			if (this.pathI === this.path.length - 1) {
				for (let c of this.finalCallbacks) c();
				this.finalCallbacks.length = 0;
			} else {
				target = this.path[++this.pathI];
			}
		}
		
		const offset = target.sub(unit.pos);
		const heading = offset.toAngle();
		
		return {
			accel: Vec2.fromAngle(unit.facing,
				Math.min(100, offset.magnitude)),
			angularAccel: smallestAngleDiff(unit.facing, heading),
		};
	}
	
	debug(unit, ctx) {
		ctx.fillStyle = '#555';
		for (var i = this.path.length - 1; i >= 0; i--) {
			const [x, y] = this.path[i];
			ctx.fillRect(x - 2, y - 2, 5, 5);
		}
		ctx.beginPath();
		ctx.moveTo(...unit.pos);
		ctx.lineTo(...this.path[this.pathI]);
		ctx.stroke();
	}
}
