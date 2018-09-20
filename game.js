import Engine from './engine.js';
import Unit from './unit.js';

const engine = new Engine(
	document.getElementById('main-canvas'),
	startup);

async function startup(engine) {
	await engine.loadImages([
		'grass',
		'wolf', 'lumberjack', 'red',
		'arrow',
	], 'img/', '.png');
	
	engine.bgFill = engine.ctx.createPattern(
		engine.images.grass, 'repeat');
	
	runtime();
}

const hunter = new Unit('lumberjack',
	Math.random() * engine.width,
	Math.random() * engine.height,
	18);
const wolf = new Unit('wolf',
	Math.random() * engine.width,
	Math.random() * engine.height);
const red = new Unit('red',
	Math.random() * engine.width,
	Math.random() * engine.height,
	14);

engine.ctx.imageSmoothingEnabled = false;

async function runtime() {
	engine.addObject(hunter);
	
	await engine.afterSeconds(5);
	
	engine.addObject(wolf);
	
	await engine.afterSeconds(5);
	
	engine.addObject(red);
}
