import * as React from 'react';
import './Canvas.css';
import Point from './Point'
import HexPoint from './HexPoint'
import CubePoint from './CubePoint'
import Hex from './Hex'
import River from './River'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMountain } from '@fortawesome/free-solid-svg-icons'
import Toolbar from './Toolbar'
import HexGrid from './HexGrid'
import Utils from './Utils'

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

interface ICanvasProps {
}


interface ICanvasState {
	rivers: River[];
	grid: Map<HexPoint, Hex>;
}


class Canvas extends React.Component<ICanvasProps, ICanvasState> {

	private canvasContainer: React.RefObject<HTMLInputElement>;

	private placingPreview: SVGElement | undefined;

	private mouseState: MouseState;

	constructor(props: any) {
		super(props);
		this.canvasContainer = React.createRef();
		this.mouseState = MouseState.None;
		this.state = {grid: new Map<HexPoint, Hex>(), rivers:  new Array()};
	}

	render() {
		return (
			<div ref={this.canvasContainer} className="canvas-container">
				<Toolbar onRiverButtonClick={this.onRiverButtonClick.bind(this)} onMountainButtonClick={this.onMountainButtonClick.bind(this)} ></Toolbar>
				<svg onMouseMove={this.onMouseMove.bind(this)} onClick={this.onCanvasMouseClick.bind(this)} onContextMenu={this.onCanvasRightMouseClick.bind(this)}>
					<HexGrid rivers={this.state.rivers} grid={this.state.grid}></HexGrid>
				</svg>
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
				var closestHexPixelPoint = HexPoint.fromPixel(mousePoint).toPixel();
				var direction = this.angleToDirection(Utils.toDegrees(Utils.angleBetweenCoordinates(closestHexPixelPoint, mousePoint)));
				var neighbourPoint = this.directionToNeightbour(HexPoint.fromPixel(mousePoint), direction);
				var hexPoint = HexPoint.fromPixel(mousePoint);

				var rivers = this.state.rivers;
				var grid = this.state.grid;

				var hex = undefined;
				grid.forEach((value, key) => {
					if(key.q === hexPoint.q && key.r === hexPoint.r)
						hex = value;
				});
				var neighbourHex = undefined;
				grid.forEach((value, key) => {
					if(key.q === neighbourPoint.q && key.r === neighbourPoint.r)
					neighbourHex = value;
				});

				if(hex !== undefined && neighbourHex !== undefined) {
					for(var i = rivers.length - 1; i >= 0; i--)
					{
						if((rivers[i].hex === hex && rivers[i].hex2 === neighbourHex )||(rivers[i].hex === neighbourHex && rivers[i].hex2 === hex))
						{
							rivers.splice(i, 1);
						}
					}
				}
				this.setState({rivers})
				break;
		}
	}

	onCanvasMouseClick(event: React.MouseEvent) {
		event.preventDefault();
		switch (this.mouseState) {
			case MouseState.River:
				var mousePoint = new Point(event.clientX, event.clientY);
				var closestHexPixelPoint = HexPoint.fromPixel(mousePoint).toPixel();
				var direction = this.angleToDirection(Utils.toDegrees(Utils.angleBetweenCoordinates(closestHexPixelPoint, mousePoint)));
				var neighbourPoint = this.directionToNeightbour(HexPoint.fromPixel(mousePoint), direction);
				var hexPoint = HexPoint.fromPixel(mousePoint);
				var rivers = this.state.rivers;
				var grid = this.state.grid;
				
				var hex = undefined;
				grid.forEach((value, key) => {
					if(key.q === hexPoint.q && key.r === hexPoint.r)
						hex = value;
				});
				var neighbourHex = undefined;
				grid.forEach((value, key) => {
					if(key.q === neighbourPoint.q && key.r === neighbourPoint.r)
						neighbourHex = value;
				});

				if(hex !== undefined && neighbourHex !== undefined)
				{
					rivers.push(new River(hex, neighbourHex));

					this.setState({rivers});
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
				// var mousePoint = new Point(event.clientX, event.clientY);
				// var closestHexPixelPoint = HexPoint.fromPixel(mousePoint).toPixel();
				// var corners = this.getClosestCorners(mousePoint, closestHexPixelPoint);
				// var line = this.createSVGElement("line");
				// line.classList.add("river-preview");
				// line.setAttribute("x1", corners[0].x.toString());
				// line.setAttribute("y1", corners[0].y.toString());
				// line.setAttribute("x2", corners[1].x.toString());
				// line.setAttribute("y2", corners[1].y.toString());
				// this.placingPreview = line;
				//todo preview
				//this.svgRoot.current!.appendChild(line); 
				break;
			case MouseState.CityCenter:
				// var mousePoint = new Point(event.clientX, event.clientY);
				// var closestHexPixelPoint = this.hexToPixel(this.pixelToHexPoint(mousePoint));
				// var iconContainer = this.createSVGElement("g");
				// var icon = React.createElement(FontAwesomeIcon, {icon: faMountain});
				// //iconContainer.appendChild(icon);

				// this.placingPreview = iconContainer;
				// this.svgRoot.current!.appendChild(iconContainer);
				break;
		}
	}

	getClosestCorners(mousePoint: Point, hexPoint: Point): [Point, Point] {
		var pointsAndDistances: Map<Point, number> = new Map<Point, number>();
		var corners = HexPoint.fromPixel(hexPoint).getAllHexCorners();

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

		var grid = this.state.grid;

		for (var r = 0; r < height; r++) {
			var r_offset = Math.floor(r / 2);
			for (var q = -r_offset; q < width - r_offset; q++) {
				grid.set(new HexPoint(q, r), new Hex(new HexPoint(q, r)));
			}
		}

		this.setState({grid});
		//this.svgRoot.current!.addEventListener('contextmenu', event => event.preventDefault());
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
				throw new Error("Error neighbour");
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
}
export default Canvas;