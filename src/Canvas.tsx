import * as React from 'react';
import './Canvas.css';
import Point from './Point'
import HexPoint from './HexPoint'
import Hex from './Hex'
import { HexType } from './Hex'
import River from './River'
import Toolbar from './Toolbar'
import HexGrid from './HexGrid'
import Utils from './Utils'
import MouseState from './MouseState'

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
				this.onRiverRightClick(new Point(event.clientX, event.clientY));
				break;
			case MouseState.Mountain:
				this.onMountainRightClick(new Point(event.clientX, event.clientY));
			break;
		}
	}

	onMountainRightClick(mouse: Point) {
		var grid = this.state.grid;
		var hexPoint = HexPoint.fromPixel(mouse);

		var hex: Hex | undefined = undefined;
		for(var key of Array.from(grid.keys())) {
			if (key.q === hexPoint.q && key.r === hexPoint.r)
				hex = grid.get(key);
		}

		if (hex !== undefined) {
			hex.hexType = HexType.None;
		}
	}

	onRiverRightClick(mouse: Point) {
		var closestHexPixelPoint = HexPoint.fromPixel(mouse).toPixel();
		var direction = Utils.angleToDirection(Utils.toDegrees(Utils.angleBetweenCoordinates(closestHexPixelPoint, mouse)));
		var neighbourPoint = Utils.directionToNeightbour(HexPoint.fromPixel(mouse), direction);
		var hexPoint = HexPoint.fromPixel(mouse);

		var rivers = this.state.rivers;
		var grid = this.state.grid;

		var hex = undefined;
		for(var key of Array.from(grid.keys())) {
			if (key.q === hexPoint.q && key.r === hexPoint.r)
				hex = grid.get(key);
		}
		var neighbourHex = undefined;
		for(var key of Array.from(grid.keys())) {
			if (key.q === neighbourPoint.q && key.r === neighbourPoint.r)
			neighbourHex = grid.get(key);
		}

		if (hex !== undefined && neighbourHex !== undefined) {
			for (var i = rivers.length - 1; i >= 0; i--) {
				if ((rivers[i].hex === hex && rivers[i].hex2 === neighbourHex) || (rivers[i].hex === neighbourHex && rivers[i].hex2 === hex)) {
					rivers.splice(i, 1);
				}
			}
		}
		this.setState({ rivers })
	}

	onCanvasMouseClick(event: React.MouseEvent) {
		event.preventDefault();
		var mouseState = this.state.mouseState;
		switch (mouseState) {
			case MouseState.River:
				this.onRiverClick(new Point(event.clientX, event.clientY));
				break;
			case MouseState.Mountain:
				this.onMountainClick(new Point(event.clientX, event.clientY));
				break;
		}
	}

	onRiverClick(mouse: Point) {
		var closestHexPixelPoint = HexPoint.fromPixel(mouse).toPixel();
		var direction = Utils.angleToDirection(Utils.toDegrees(Utils.angleBetweenCoordinates(closestHexPixelPoint, mouse)));
		var neighbourPoint = Utils.directionToNeightbour(HexPoint.fromPixel(mouse), direction);
		var hexPoint = HexPoint.fromPixel(mouse);
		var rivers = this.state.rivers;
		var grid = this.state.grid;

		var hex: Hex | undefined = undefined;
		for(var key of Array.from(grid.keys())) {
			if (key.q === hexPoint.q && key.r === hexPoint.r)
				hex = grid.get(key);
		}
		var neighbourHex: Hex | undefined = undefined;
		for(var key of Array.from(grid.keys())) {
			if (key.q === neighbourPoint.q && key.r === neighbourPoint.r)
			neighbourHex = grid.get(key);
		}

		if (hex !== undefined && neighbourHex !== undefined) {
			if(River.indexOfRiver(rivers, new River(hex, neighbourHex)) === -1) {
				rivers.push(new River(hex, neighbourHex));
				this.setState({ rivers });
			}
		}
	}

	onMountainClick(mouse: Point) {
		var grid = this.state.grid;
		var hexPoint = HexPoint.fromPixel(mouse);

		var hex: Hex | undefined = undefined;
		for(var key of Array.from(grid.keys())) {
			if (key.q === hexPoint.q && key.r === hexPoint.r)
				hex = grid.get(key);
		}

		if (hex !== undefined) {
			hex.hexType = HexType.Mountain;
			this.setState({grid})
		}
	}

	onMouseMove(event: React.MouseEvent) {
		event.preventDefault();
		this.setState({mousePoint: new Point(event.clientX, event.clientY)})
	}

	componentDidMount() {
		var width = 20;
		var height = 12

		var grid = this.state.grid;

		for (var r = 0; r < height; r++) {
			var r_offset = Math.floor(r / 2);
			for (var q = -r_offset; q < width - r_offset; q++) {
				grid.set(new HexPoint(q, r), new Hex(new HexPoint(q, r), HexType.None));
			}
		}

		this.setState({ grid });
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