import { randomAngle } from './utils.js';

export default class Vec2 {
	constructor(x, y) {
		if (!new.target) throw 'Vec2() must be called with new';
		this.__x = x;
		this.__y = y;
	}
	
	static fromAngle(angle) {
		return new Vec2(Math.cos(angle), Math.sin(angle));
	}
	
	static randomOnCircle() {
		return Vec2.fromAngle(randomAngle());
	}
	
	get x() { return this.__x; }
	get y() { return this.__y; }
	
	scaled(num) {
		return new Vec2(this.x * num, this.y * num);
	}
	
	add(vec) {
		return new Vec2(this.x + vec.x, this.y + vec.y);
	}
	
	sub(vec) {
		return new Vec2(this.x - vec.x, this.y - vec.y);
	}
	
	toAngle() {
		return Math.atan2(this.y, this.x);
	}
	
	toString() {
		return `Vec2(${this.x}, ${this.y})`;
	}
	
	*[Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}
}
