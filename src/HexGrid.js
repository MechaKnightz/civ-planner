import * as PIXI from 'pixi.js';

class HexGrid {

	grid = [];
	hexRadius = 60;
	hexHeight = this.hexRadius * Math.sqrt(3);
	hexWidth = this.hexRadius * Math.sqrt(3);

	hexColor = 0x647d18;

	constructor(size, app) {
		for (var i = 0; i < size; i++) {
			this.grid[i] = [];
			for (var j = 0; j < size; j++) {
				this.grid[i][j] = {graphics: this.createHexGraphics(this.toDrawPosition({ q: i, r: j }))};
				app.stage.addChild(this.grid[i][j].graphics);
			}
		}
	}

	createHexGraphics(point) {
		var hex = new PIXI.Graphics();
		hex.beginFill(this.hexColor);

		hex.drawPolygon([
			0, -this.hexRadius,
			this.hexHeight / 2, -this.hexRadius / 2,
			this.hexHeight / 2, this.hexRadius / 2,
			0, this.hexRadius,
			-this.hexHeight / 2, this.hexRadius / 2,
			-this.hexHeight / 2, -this.hexRadius / 2,
		]);

		hex.endFill();
		hex.x = point.q;
		hex.y = point.r;

		return hex;
	}

	toDrawPosition(p) {
		var newP = {};
		newP.q = this.hexRadius * (Math.sqrt(3) * p.q  +  Math.sqrt(3)/2 * p.r);
		newP.r = this.hexRadius * (3./2 * p.r);
		return newP;
	}
}

export default HexGrid;