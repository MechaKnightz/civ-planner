import * as React from 'react';
import River from './River'
import Hex from './Hex'
import HexPoint from './HexPoint'

interface HexProps {
    grid: Map<HexPoint, Hex>;
    rivers: River[];
}

function HexGrid(props: HexProps ) {
    return (
        <g className="svg-root">
            {Array.from(props.grid).map(([key, hex])=> {
                var drawCoord = hex.position.pointCoord();
                    return (
                    <g key={key.toString()} transform={`translate(${drawCoord.x},${drawCoord.y})`}>
                        <polygon points={Hex.shape.toString()}></polygon>
                    </g>)
                    //toString might not work
                })}
            {props.rivers.map(river => {
                    var points = river.hex.getBorderPoints(river.hex2);
                    return(
                    <g key={river.toString()} >
                        <line className="river" x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} />
                    </g>)})
            }
        </g>
        );
}

export default HexGrid;