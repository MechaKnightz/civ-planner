import * as React from 'react';
import './Canvas.css';
import Point from './Point'
import HexPoint from './HexPoint'
import Hex from './Hex'
import River from './River'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMountain } from '@fortawesome/free-solid-svg-icons'
import Toolbar from './Toolbar'
import HexGrid from './HexGrid'
import Utils from './Utils'
import MouseState from './MouseState'
import Direction from './Direction'

interface ICanvasProps {
}


interface ICanvasState {
	rivers: River[];
	grid: Map<HexPoint, Hex>;
	mouseState: MouseState;
	mousePoint: Point;
}


class Canvas extends React.Component<ICanvasProps, ICanvasState> {

	private canvasContainer: React.RefObject<HTMLInputElement>;

	constructor(props: any) {
		super(props);
		this.canvasContainer = React.createRef();
		this.state = { grid: new Map<HexPoint, Hex>(), rivers: [], mouseState: MouseState.None, mousePoint: new Point(0, 0)};
	}

	render() {
		return (
			<div ref={this.canvasContainer} className="canvas-container">
				<Toolbar onRiverButtonClick={this.onRiverButtonClick.bind(this)} onMountainButtonClick={this.onMountainButtonClick.bind(this)} ></Toolbar>
				<svg onMouseMove={this.onMouseMove.bind(this)} onClick={this.onCanvasMouseClick.bind(this)} onContextMenu={this.onCanvasRightMouseClick.bind(this)}>
					<HexGrid rivers={this.state.rivers} grid={this.state.grid} mouseState={this.state.mouseState} mousePoint={this.state.mousePoint}></HexGrid>
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

	onCanvasRightMouseClick(event: React.MouseEvent) {
		event.preventDefault();
		var mouseState = this.state.mouseState;
		switch (mouseState) {
			case MouseState.River:
				var mousePoint = new Point(event.clientX, event.clientY);
				var closestHexPixelPoint = HexPoint.fromPixel(mousePoint).toPixel();
				var direction = Utils.angleToDirection(Utils.toDegrees(Utils.angleBetweenCoordinates(closestHexPixelPoint, mousePoint)));
				var neighbourPoint = Utils.directionToNeightbour(HexPoint.fromPixel(mousePoint), direction);
				var hexPoint = HexPoint.fromPixel(mousePoint);

				var rivers = this.state.rivers;
				var grid = this.state.grid;

				var hex = undefined;
				grid.forEach((value, key) => {
					if (key.q === hexPoint.q && key.r === hexPoint.r)
						hex = value;
				});
				var neighbourHex = undefined;
				grid.forEach((value, key) => {
					if (key.q === neighbourPoint.q && key.r === neighbourPoint.r)
						neighbourHex = value;
				});

				if (hex !== undefined && neighbourHex !== undefined) {
					for (var i = rivers.length - 1; i >= 0; i--) {
						if ((rivers[i].hex === hex && rivers[i].hex2 === neighbourHex) || (rivers[i].hex === neighbourHex && rivers[i].hex2 === hex)) {
							rivers.splice(i, 1);
						}
					}
				}
				this.setState({ rivers })
				break;
		}
	}

	onCanvasMouseClick(event: React.MouseEvent) {
		event.preventDefault();
		var mouseState = this.state.mouseState;
		switch (mouseState) {
			case MouseState.River:
				var mousePoint = new Point(event.clientX, event.clientY);
				var closestHexPixelPoint = HexPoint.fromPixel(mousePoint).toPixel();
				var direction = Utils.angleToDirection(Utils.toDegrees(Utils.angleBetweenCoordinates(closestHexPixelPoint, mousePoint)));
				var neighbourPoint = Utils.directionToNeightbour(HexPoint.fromPixel(mousePoint), direction);
				var hexPoint = HexPoint.fromPixel(mousePoint);
				var rivers = this.state.rivers;
				var grid = this.state.grid;

				var hex: Hex | undefined = undefined;
				grid.forEach((value, key) => {
					if (key.q === hexPoint.q && key.r === hexPoint.r)
						hex = value;
				});
				var neighbourHex: Hex | undefined = undefined;
				grid.forEach((value, key) => {
					if (key.q === neighbourPoint.q && key.r === neighbourPoint.r)
						neighbourHex = value;
				});

				if (hex !== undefined && neighbourHex !== undefined) {
					console.log(Direction[direction]);
					console.log(hex);
					console.log(neighbourHex);
					if(River.indexOfRiver(rivers, new River(hex, neighbourHex)) === -1) {
						rivers.push(new River(hex, neighbourHex));
						this.setState({ rivers });
					}
				}
				break;
		}
	}

	onMouseMove(event: React.MouseEvent) {
		event.preventDefault();
		this.setState({mousePoint: new Point(event.clientX, event.clientY)})
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

		this.setState({ grid });
		//this.svgRoot.current!.addEventListener('contextmenu', event => event.preventDefault());
	}

	

	trySwitchModeTo(newState: MouseState): void {
		var mouseState = this.state.mouseState;
		if (mouseState !== newState) {
			mouseState = newState;
		}
		else {
			mouseState = MouseState.None;
		}
		this.setState({mouseState});
	}
}
export default Canvas;