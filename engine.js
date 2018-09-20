
export class Engine {
	
	constructor(canvas, init) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		
		this.images = {};
		this.objects = [];
		this.bgFill = null;
		
		this.onRender = this.onRender.bind(this);
		
		this.frame = -1;
		
		init(this)
			.then(() =>
				this.nextRenderID = requestAnimationFrame(
					(ms) => {
						// Set the initial millis first time around
						this.millis = ms;
						this.onRender(ms);
					}));
	}
	
	get width() {
		return this.canvas.width;
	}
	
	get height() {
		return this.canvas.height;
	}
	
	loadImages(urls, prefix='', suffix='') {
		const promises = [];
		
		for (let url of urls) {
			const img = this.images[url] = new Image();
			
			promises.push(new Promise((resolve, reject) => {
				img.onload = () => resolve(img);
				img.onerror = reject;
			}));
			
			img.src = prefix + url + suffix;
		}
		
		return Promise.all(promises);
	}
	
	img(url, w, h) {
		return new Promise((resolve, reject) => {
			const img = new Image(w, h);
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = url;
		});
	}
	
	addObject(obj) {
		this.objects.push(obj);
		return obj;
	}
	
	onRender(ms) {
		this.delta = (ms - this.millis) / 1000;
		this.millis = ms;
		this.frame++;
		this.nextRenderID = requestAnimationFrame(this.onRender);
		
		const ctx = this.ctx;
		
		if (this.bgFill) {
			ctx.fillStyle = this.bgFill;
			ctx.fillRect(0, 0, this.width, this.height);
		} else {
			ctx.clearRect(0, 0, this.width, this.height);
		}
		
		for (let obj of this.objects) {
			if (obj.enabled) obj.onRender(ctx, this.delta, this);
		}
	}
	
}

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

export class Unit {
	constructor(img, x, y, radius=20, facing=0) {
		this.img = img;
		this.x = x;
		this.y = y;
		this.facing = facing;
		this.radius = radius;
		this.enabled = true;
	}
	
	onRender(ctx, delta, engine) {
		this.facing += delta * 3;
		
		const img = engine.images[this.img];
		const arrow = engine.images.arrow;
		drawSprite(ctx, arrow, this.x, this.y,
			this.facing, 0, this.radius);
		drawSprite(ctx, img, this.x, this.y);
	}
}