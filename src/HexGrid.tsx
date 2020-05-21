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
            {/* {
                props.rivers.forEach(river => {
                    
                    (<g y1={}></g>)
                })
            } */}
            {Array.from(props.grid).map(([key, hex])=> {
                var drawCoord = hex.position.pointCoord();
                    return (
                    <g key={key.toString()} transform={`translate(${drawCoord.x},${drawCoord.y})`}>
                        <polygon points={Hex.shape.toString()}></polygon>
                    </g>)
                    //toString might not work
                })}
        </g>
        );
}

export default HexGrid;