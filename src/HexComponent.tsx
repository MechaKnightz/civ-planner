import { HexType } from './Hex'
import Hex from './Hex'
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMountain } from '@fortawesome/free-solid-svg-icons'
import HexPoint from './HexPoint';

interface HexComponentProps {
    hexKey: HexPoint;
    hex: Hex;
}

class HexComponent extends React.Component<HexComponentProps> {
    render() {
        var drawCoord = this.props.hex.position.pointCoord();
        return (
            <g key={this.props.hexKey.toString()} transform={`translate(${drawCoord.x},${drawCoord.y})`}>
                <polygon points={Hex.shape.toString()}></polygon>
                {this.renderHexType(this.props.hex.hexType)}
            </g>)
    }

    renderHexType(type: HexType)
    {
        switch(type)
        {
            case HexType.Mountain:
                return (<g transform="translate(-30, -30) scale(0.1)">
                <FontAwesomeIcon viewBox="" icon={faMountain}/>
            </g>)
        }

        return (null);
    }
}

export default HexComponent;