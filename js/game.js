import { randomAngle } from './utils.js';
import Engine from './engine.js';
import Entity from './entity.js';
import Unit from './unit.js';
import Vec2 from './vec2.js';
import { NoticeParticle } from './particle.js';

import {
	WanderSteer, PursueSteer, FleeSteer, PathSteer,
} from './steering.js';

const engine = new Engine(
	document.getElementById('main-canvas'),
	startup);

async function startup(engine) {
	await engine.loadImages([
		'grass', 'house',
		'wolf', 'lumberjack', 'red', 'fatwolf',
		'arrow', 'notice', 'ohno',
	], 'img/', '.png');
	
	engine.bgFill = engine.ctx.createPattern(
		engine.images.grass, 'repeat');
	
	runtime();
}

const fatwolf = engine.addObject(
	new Unit('fatwolf', 70, 60, Math.PI / 2));
fatwolf.disabled = true;
const house = engine.addObject(
	new Entity('house', 70, 60));

const hunter = new Unit('lumberjack',
	Math.random() * engine.width,
	Math.random() * engine.height,
	randomAngle(),
	18);
const wolf = new Unit('wolf',
	Math.random() * engine.width,
	Math.random() * engine.height,
	randomAngle());
const red = new Unit('red',
	engine.width + 32,
	engine.height + 32,
	randomAngle(),
	14);

window.fatwolf = fatwolf;
window.house = house;
window.hunter = hunter;
window.wolf = wolf;
window.red = red;
window.engine = engine;

engine.ctx.imageSmoothingEnabled = false;

async function runtime() {
	// Spawn hunter
	engine.addObject(hunter);
	hunter.steering = new WanderSteer(70, 40);
	
	// Wait
	await Promise.race([
		engine.afterSeconds(10),
		engine.afterKey('down', 'Space')]);
	
	// Spawn wolf
	engine.addObject(wolf);
	wolf.maxVelocity = 25;
	wolf.steering = new WanderSteer(70, 40);
	
	// When they get near
	await Promise.race([
		engine.afterCondition(() =>
			hunter.pos.withinRadius(wolf.pos, 120)),
		engine.afterKey('down', 'Space')]);
	
	// Pursue and flee
	engine.addObject(new NoticeParticle(hunter));
	engine.addObject(new NoticeParticle(wolf));
	
	hunter.steering = new PursueSteer(wolf);
	wolf.steering = new FleeSteer(hunter);
	hunter.clampToScreen = false;
	wolf.clampToScreen = false;
	
	// When offscreen or collide
	await Promise.race([
		Promise.all([
			engine.afterSeconds(2),
			engine.afterCondition(() => {
				const hunterSqrRad = hunter.radius * hunter.radius;
				const wolfSqrRad = wolf.radius * wolf.radius;
				
				const hunterOnScreen = hunter.pos
					.distFromAABB(...engine.aabb)
					.sqrMagnitude <= hunterSqrRad;
				const wolfOnScreen = wolf.pos
					.distFromAABB(...engine.aabb)
					.sqrMagnitude <= wolfSqrRad
				
				return (!hunterOnScreen && !wolfOnScreen)
					|| hunter.pos.withinRadius(
						wolf.pos, hunter.radius + wolf.radius);
			})]),
		engine.afterKey('down', 'Space')]);
	
	// Red walks to house
	
	wolf.disabled = true;
	hunter.disabled = true;
	
	engine.addObject(red);
	red.clampToScreen = false;
	
	red.maxVelocity = 100;
	red.maxAcceleration = 1000;
	red.maxAngularVel = 15;
	red.maxAngularAccel = 10000;
	red.drag = 0.4;
	
	const path = red.steering = new PathSteer([
		new Vec2(390, 250),
		new Vec2(300, 240),
		new Vec2(250, 220),
		new Vec2(270, 170),
		new Vec2(275, 130),
		new Vec2(210, 100),
		new Vec2(150,  80),
		house.pos]);
	
	// Wait
	await Promise.race([
		engine.afterSeconds(7),
		engine.afterKey('down', 'Space')]);
	
	// Wolf chases Red
	wolf.disabled = false;
	wolf.steering = new PursueSteer(red);
	
	// When they get near
	await Promise.race([
		engine.afterCondition(() =>
			red.pos.withinRadius(wolf.pos, 30)),
		engine.afterKey('down', 'Space')]);
	
	wolf.steering = null;
	red.steering = null;
	engine.addObject(new NoticeParticle(red));
	engine.addObject(new NoticeParticle(wolf));
	
	// Wait
	await Promise.race([
		engine.afterSeconds(2),
		engine.afterKey('down', 'Space')]);
	
	red.steering = path;
	wolf.steering = new PursueSteer(house);
	hunter.disabled = false;
	hunter.steering = new PursueSteer(house);
	
	await Promise.race([
		Promise.all([
			engine.afterCondition(
				() => red.pos.withinRadius(house.pos, 30))
				.then(() => red.disabled = true),
			engine.afterCondition(
				() => wolf.pos.withinRadius(house.pos, 30))
				.then(() => wolf.disabled = true),
			engine.afterCondition(
				() => hunter.pos.withinRadius(house.pos, 30))
				.then(() => hunter.disabled = true)]),
		engine.afterKey('down', 'Space')]);
	
	hunter.disabled = true;
	wolf.disabled = true;
	red.disabled = true;
	
	engine.addObject(new NoticeParticle(house, 'ohno', 7, 3));
	
	await engine.afterSeconds(5);
	
	fatwolf.disabled = false;
	fatwolf.velocity = new Vec2(0, 100);
}
