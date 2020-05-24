import * as React from 'react';
import River from './River'
import Hex from './Hex'
import HexPoint from './HexPoint'
import MouseState from './MouseState'
import Point from './Point';
import Utils from './Utils'
import { HexType } from './Hex'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMountain } from '@fortawesome/free-solid-svg-icons'
import HexComponent from './HexComponent'

interface HexProps {
    grid: Map<HexPoint, Hex>;
    rivers: River[];
    mouseState: MouseState;
    mousePoint: Point;
}

function HexGrid(props: HexProps) {
    return (
        <g className="svg-root">
            {Array.from(props.grid).map(([key, hex])=> {
                return (<HexComponent hexKey={key} hex={hex}></HexComponent>)
                })}
            {props.rivers.map(river => {
                    var points = river.hex.position.getBorderPoints(river.hex2.position);
                    return(
                    <g key={river.toString()} >
                        <line className="river" x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} />
                    </g>)})
            }
            {renderPreview(props.mouseState, props.mousePoint)}
        </g>
        );
}

function renderPreview(state: MouseState, mouse: Point) {
    switch(state) {
        case MouseState.River:
            var closestHexPixelPoint = HexPoint.fromPixel(mouse).toPixel();
            var direction = Utils.angleToDirection(Utils.toDegrees(Utils.angleBetweenCoordinates(closestHexPixelPoint, mouse)));
            var neighbourPoint = Utils.directionToNeightbour(HexPoint.fromPixel(mouse), direction);
            var hexPoint = HexPoint.fromPixel(mouse);
            var points = hexPoint.getBorderPoints(neighbourPoint);
            return(
                <g key="river-preview">
                    <line className="river-preview" x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} />
                </g>)
        case MouseState.Mountain:
            var closestHexPixelPoint = HexPoint.fromPixel(mouse).toPixel();
            var direction = Utils.angleToDirection(Utils.toDegrees(Utils.angleBetweenCoordinates(closestHexPixelPoint, mouse)));
            var hexPoint = HexPoint.fromPixel(mouse);
            var drawCoord = HexPoint.fromPixel(mouse).toPixel();
            return(
                <g key="mountain-preview" className="mountain-preview" transform={`translate(${drawCoord.x},${drawCoord.y})`}>
                    <polygon className="mountain-preview-polygon" points={Hex.shape.toString()}></polygon>
                    <g transform="translate(-30, -30) scale(0.1)">
                        <FontAwesomeIcon viewBox="" icon={faMountain}/>
                    </g>)
                </g>)
    }
}

export default HexGrid; 