import * as React from 'react';
import './Canvas.css';
import Point from './Point'
import HexPoint from './HexPoint'
import CubePoint from './CubePoint'
import Hex from './Hex'
import River from './River'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMountain } from '@fortawesome/free-solid-svg-icons'

enum MouseState {
	None,
	River,
	Mountain,
	CityCenter
}

enum Direction {
	UpLeft,
	UpRight,
	Left,
	Right,
	DownLeft,
	DownRight
}



class Canvas extends React.Component {

	private canvasContainer: React.RefObject<HTMLInputElement>;
	private svgRoot: React.RefObject<SVGAElement>;

	private placingPreview: SVGElement | undefined;

	private mouseState: MouseState;

	private rivers: River[];

	constructor(props: any) {
		super(props);
		this.canvasContainer = React.createRef();
		this.svgRoot = React.createRef();
		this.mouseState = MouseState.None;
		this.rivers = new Array;
	}

	render() {
		return (
			<div ref={this.canvasContainer} className="canvas-container">
				<div className="toolbar">
					<button type="button" className="btn btn-primary shadow-sm" onClick={this.onRiverButtonClick.bind(this)}>River</button>
					<button type="button" className="btn btn-primary shadow-sm" onClick={this.onMountainButtonClick.bind(this)}>Mountain</button>
					<button type="button" className="btn btn-primary shadow-sm">Button3</button>
				</div>
				<svg onMouseMove={this.onMouseMove.bind(this)} onClick={this.onCanvasMouseClick.bind(this)} onContextMenu={this.onCanvasRightMouseClick.bind(this)}><g ref={this.svgRoot}></g></svg>
			</div>
		);
	}

	onMountainButtonClick(event: React.MouseEvent) {
		event.preventDefault();
		this.trySwitchModeTo(MouseState.Mountain);
	}

	onRiverButtonClick(event: React.MouseEvent) {
		event.preventDefault();
		this.trySwitchModeTo(MouseState.River);
	}

	onCanvasRightMouseClick(event: React.MouseEvent)
	{
		event.preventDefault();
		switch (this.mouseState) {
			case MouseState.River:
				var mousePoint = new Point(event.clientX, event.clientY);
				var closestHexPixelPoint = this.hexToPixel(this.pixelToHexPoint(mousePoint));
				var direction = this.angleToDirection(this.toDegrees(this.angleBetweenCoordinates(closestHexPixelPoint, mousePoint)));
				var neighbourPoint = this.directionToNeightbour(this.pixelToHexPoint(mousePoint), direction);
				var hexPoint = this.pixelToHexPoint(mousePoint);

				var hex = undefined;
				this.grid.forEach((value, key) => {
					if(key.q === hexPoint.q && key.r === hexPoint.r)
						hex = value;
				});
				var neighbourHex = undefined;
				this.grid.forEach((value, key) => {
					if(key.q === neighbourPoint.q && key.r === neighbourPoint.r)
					neighbourHex = value;
				});

				if(hex !== undefined && neighbourHex !== undefined) {
					for(var i = this.rivers.length - 1; i >= 0; i--)
					{
						if((this.rivers[i].hex === hex && this.rivers[i].hex2 === neighbourHex )||(this.rivers[i].hex === neighbourHex && this.rivers[i].hex2 === hex))
						{
							this.rivers[i].graphics.remove();
							this.rivers.splice(i, 1);
						}
					}
				}
				break;
		}
	}

	onCanvasMouseClick(event: React.MouseEvent) {
		event.preventDefault();
		switch (this.mouseState) {
			case MouseState.River:
				var mousePoint = new Point(event.clientX, event.clientY);
				var closestHexPixelPoint = this.hexToPixel(this.pixelToHexPoint(mousePoint));
				var direction = this.angleToDirection(this.toDegrees(this.angleBetweenCoordinates(closestHexPixelPoint, mousePoint)));
				var neighbourPoint = this.directionToNeightbour(this.pixelToHexPoint(mousePoint), direction);
				var hexPoint = this.pixelToHexPoint(mousePoint);
				
				var hex = undefined;
				this.grid.forEach((value, key) => {
					if(key.q === hexPoint.q && key.r === hexPoint.r)
						hex = value;
				});
				var neighbourHex = undefined;
				this.grid.forEach((value, key) => {
					if(key.q === neighbourPoint.q && key.r === neighbourPoint.r)
					neighbourHex = value;
				});

				if(hex !== undefined && neighbourHex !== undefined)
				{
					var line = this.createSVGElement("line");
					line.classList.add("river");
					var corners = this.getClosestCorners(mousePoint, closestHexPixelPoint);
					line.setAttribute("x1", corners[0].x.toString());
					line.setAttribute("y1", corners[0].y.toString());
					line.setAttribute("x2", corners[1].x.toString());
					line.setAttribute("y2", corners[1].y.toString());
					this.svgRoot.current!.appendChild(line);

					this.rivers.push(new River(hex, neighbourHex, line))
				}
				break;
		}
	}

	onMouseMove(event: React.MouseEvent) {
		event.preventDefault();
		if(this.placingPreview !== undefined && this.placingPreview !== null)
		{
			this.placingPreview.remove();
		}
		switch (this.mouseState) {
			case MouseState.River:
				var mousePoint = new Point(event.clientX, event.clientY);
				var closestHexPixelPoint = this.hexToPixel(this.pixelToHexPoint(mousePoint));
				var corners = this.getClosestCorners(mousePoint, closestHexPixelPoint);
				var line = this.createSVGElement("line");
				line.classList.add("river-preview");
				line.setAttribute("x1", corners[0].x.toString());
				line.setAttribute("y1", corners[0].y.toString());
				line.setAttribute("x2", corners[1].x.toString());
				line.setAttribute("y2", corners[1].y.toString());
				this.placingPreview = line;
				this.svgRoot.current!.appendChild(line);
				break;
			case MouseState.CityCenter:
				var mousePoint = new Point(event.clientX, event.clientY);
				var closestHexPixelPoint = this.hexToPixel(this.pixelToHexPoint(mousePoint));
				var iconContainer = this.createSVGElement("g");
				var icon = React.createElement(FontAwesomeIcon, {icon: faMountain});
				//iconContainer.appendChild(icon);

				this.placingPreview = iconContainer;
				this.svgRoot.current!.appendChild(iconContainer);
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
				this.grid.set(new HexPoint(q, r), new Hex(new HexPoint(q, r), this.hexToDom(q, r)));
			}
		}

		this.grid.forEach(child => {
			visualGrid.appendChild(child.graphics);
		});

		this.svgRoot.current!.appendChild(visualGrid);
		//this.svgRoot.current!.addEventListener('contextmenu', event => event.preventDefault());
	}

	grid = new Map<HexPoint, Hex>();
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
			//console.log(this.pixelToHex(new Point(e.clientX, e.clientY)));
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

	pixelToHexPoint(point: Point): HexPoint {
		var q = (Math.sqrt(3) / 3 * point.x - 1. / 3 * point.y) / this.hexRadius;
		var r = (2. / 3 * point.y) / this.hexRadius;
		return this.hexRound(new HexPoint(q, r));
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

	directionToNeightbour(basePoint: HexPoint, direction:Direction): HexPoint {
		switch (direction) {
			case Direction.UpRight:
				return new HexPoint(basePoint.q + 1, basePoint.r - 1);
			case Direction.Right:
				return new HexPoint(basePoint.q + 1, basePoint.r);
			case Direction.DownRight:
				return new HexPoint(basePoint.q, basePoint.r + 1);
			case Direction.DownLeft:
				return new HexPoint(basePoint.q - 1, basePoint.r + 1);
			case Direction.Left:
				return new HexPoint(basePoint.q - 1, basePoint.r);
			case Direction.UpLeft:
				return new HexPoint(basePoint.q, basePoint.r - 1);
			default:
				throw new Error("Error neightbour");
		}
	}

	angleToDirection(angle: number): Direction
	{
		if(angle < 30)
			return Direction.Right;
		else if(angle < 90)
			return Direction.UpRight;
		else if(angle < 150)
			return Direction.UpLeft;
		else if(angle < 210)
			return Direction.Left;
		else if(angle < 270)
			return Direction.DownLeft;
		else if(angle < 330)
			return Direction.DownRight;
		else 
			return Direction.Right;
	}

	angleBetweenCoordinates(basePoint: Point, secondPoint: Point): number {
		var deltaX = secondPoint.x - basePoint.x;
		var deltaY = basePoint.y - secondPoint.y;
		var result = Math.atan2(deltaY, deltaX);
		if(result < 0)
			return result + Math.PI * 2;
		else 
			return result;
		//return (result < 0) ? (result + 360) : result;
	}

	toDegrees (angle: number): number {
		return angle * (180 / Math.PI);
	}

	trySwitchModeTo(newState: MouseState): void {
		if(this.placingPreview !== undefined && this.placingPreview !== null)
		{
			this.placingPreview.remove();
		}
		if (this.mouseState != newState) {
			this.mouseState = newState;
		}
		else {
			this.mouseState = MouseState.None;
		}
	}

	createSVGElement(element: string): SVGElement {
		return document.createElementNS("http://www.w3.org/2000/svg", element);
	}
}
export default Canvas;