import * as React from 'react';
import './Canvas.css';
import Point from './Point'
import HexPoint from './HexPoint'
import CubePoint from './CubePoint'

enum MouseState {
	None,
	River
}

class Canvas extends React.Component {

	private canvasContainer: React.RefObject<HTMLInputElement>;
	private svgRoot: React.RefObject<SVGAElement>;

	private riverPreview: SVGElement | undefined;

	private mouseState: MouseState;

	constructor(props: any) {
		super(props);
		this.canvasContainer = React.createRef();
		this.svgRoot = React.createRef();
		this.mouseState = MouseState.None;
	}

	render() {
		return (
			<div ref={this.canvasContainer} className="canvas-container">
				<div className="toolbar">
					<button type="button" className="btn btn-primary shadow-sm" onClick={this.onRiverClick.bind(this)}>River</button>
					<button type="button" className="btn btn-primary shadow-sm">Button2</button>
					<button type="button" className="btn btn-primary shadow-sm">Button3</button>
				</div>
				<svg onMouseMove={this.onMouseMove.bind(this)}><g ref={this.svgRoot}></g></svg>
			</div>
		);
	}

	onRiverClick(event: React.MouseEvent) {
		event.preventDefault();
		if (this.mouseState != MouseState.River) {
			this.mouseState = MouseState.River;
			console.log(event.target);
		}
		else {
			this.mouseState = MouseState.None;
			console.log(event.target);
		}

	}

	onMouseMove(event: React.MouseEvent) {
		event.preventDefault();
		switch (this.mouseState) {
			case MouseState.River:
				this.riverPreview = undefined;
				var mousePoint = new Point(event.clientX, event.clientY);
				var closestHexPixelPoint = this.hexToPixel(this.pixelToHex(mousePoint))
				var corners = this.getClosestCorners(mousePoint, closestHexPixelPoint);
				var line = this.createSVGElement("line");
				line.setAttribute("x1", corners[0].x.toString());
				line.setAttribute("y1", corners[0].y.toString());
				line.setAttribute("x2", corners[1].x.toString());
				line.setAttribute("y2", corners[1].y.toString());
				this.riverPreview = line;
				this.svgRoot.current!.appendChild(line);
				console.log("reached");
				break;
		}
	}

	getClosestCorners(mousePoint: Point, hexPoint: Point): [Point, Point] {
		var pointsAndDistances: Map<Point, number> = new Map<Point, number>();
		var corners = this.getAllHexCorners(hexPoint);

		corners.forEach(corner => {
			var distance = Math.hypot(mousePoint.x - corner.x, mousePoint.y - corner.y);
			pointsAndDistances.set(corner, distance);
		});

		var sortedMap: Map<Point, number> = new Map([...pointsAndDistances.entries()].sort((n1, n2) => n1[1] - n2[1]));

		return [[...sortedMap][0][0], [...sortedMap][1][0]];
	}

	componentDidMount() {
		//this.svgCanvas.current.setAttribute("viewBox", `0 0 1920 1080`);
		var width = 20;
		var height = 12

		var visualGrid = this.createSVGElement("g");

		for (var r = 0; r < height; r++) {
			var r_offset = Math.floor(r / 2);
			for (var q = -r_offset; q < width - r_offset; q++) {
				this.grid.set({ q, r }, { q, r });
			}
		}

		this.grid.forEach(child => {
			visualGrid.appendChild(this.hexToDom(child.q, child.r))
		});

		this.svgRoot.current!.appendChild(visualGrid);
	}

	grid = new Map;
	hexRadius = 60;
	hexHeight = this.hexRadius * Math.sqrt(3);
	hexWidth = this.hexRadius * Math.sqrt(3);

	hexColor = 0x647d18;

	hexToDom(row: number, column: number) {

		var transform = this.createSVGElement("g");
		var drawPos = this.toDrawPosition({ q: row, r: column });
		//transform.transform = `translate(${drawPos.x},${drawPos.y})`;
		transform.setAttribute("transform", `translate(${drawPos.x},${drawPos.y})`);

		var polygon = this.createSVGElement("polygon");

		var points = [
			0, -this.hexRadius,
			this.hexHeight / 2, -this.hexRadius / 2,
			this.hexHeight / 2, this.hexRadius / 2,
			0, this.hexRadius,
			-this.hexHeight / 2, this.hexRadius / 2,
			-this.hexHeight / 2, -this.hexRadius / 2,
		]

		polygon.setAttribute("points", points.toString());

		//todo remove
		polygon.onclick = (e: MouseEvent) => {
			console.log(this.pixelToHex(new Point(e.clientX, e.clientY)));
		};

		transform.appendChild(polygon);
		return transform;
	}

	toDrawPosition(p: HexPoint): Point {
		var x = this.hexRadius * (Math.sqrt(3) * p.q + Math.sqrt(3) / 2 * p.r);
		var y = this.hexRadius * (3. / 2 * p.r);
		return new Point(x, y);;
	}

	getAllHexCorners(hexCoord: Point): Point[] {
		var res: Point[] = new Array;
		for (var i = 0; i < 6; i++) {
			res.push(this.getHexCorner(hexCoord, this.hexRadius, i));
		}
		return res;
	}

	axialToCube(hex: HexPoint): CubePoint {
		var x = hex.q;
		var z = hex.r;
		var y = -x - z;
		return { x, y, z };
	}

	cubeToAxial(cube: CubePoint): HexPoint {
		var q = cube.x;
		var r = cube.z;
		return { q, r };
	}

	hexRound(hex: HexPoint): HexPoint {
		return this.cubeToAxial(this.cubeRound(this.axialToCube(hex)));
	}

	pixelToHex(point: Point): HexPoint {
		var q = (Math.sqrt(3) / 3 * point.x - 1. / 3 * point.y) / this.hexRadius;
		var r = (2. / 3 * point.y) / this.hexRadius;
		return this.hexRound({ q, r });
	}

	cubeRound(cube: CubePoint): CubePoint {
		var rx = Math.round(cube.x);
		var ry = Math.round(cube.y);
		var rz = Math.round(cube.z);

		var x_diff = Math.abs(rx - cube.x);
		var y_diff = Math.abs(ry - cube.y);
		var z_diff = Math.abs(rz - cube.z);

		if (x_diff > y_diff && x_diff > z_diff)
			rx = -ry - rz;
		else if (y_diff > z_diff)
			ry = -rx - rz;
		else
			rz = -rx - ry;
		return { x: rx, y: ry, z: rz };
	}

	hexToPixel(hex: HexPoint): Point {
		var x = this.hexRadius * (Math.sqrt(3) * hex.q + Math.sqrt(3) / 2 * hex.r)
		var y = this.hexRadius * (3. / 2 * hex.r)
		return new Point(x, y);
	}

	//i == 0 is top right
	//i == 1 is bot right
	//i == 5 is top 
	getHexCorner(center: Point, size: number, i: number): Point {
		var angle_deg = 60 * i - 30;
		var angle_rad = Math.PI / 180 * angle_deg;
		return new Point(center.x + size * Math.cos(angle_rad),
			center.y + size * Math.sin(angle_rad))
	}


	createSVGElement(element: string): SVGElement {
		return document.createElementNS("http://www.w3.org/2000/svg", element);
	}
}
export default Canvas;