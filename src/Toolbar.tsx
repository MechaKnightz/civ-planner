import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMountain } from '@fortawesome/free-solid-svg-icons'
import { faWater } from '@fortawesome/free-solid-svg-icons'

interface ToolbarProps {
    onRiverButtonClick: (event: React.MouseEvent) => void
    onMountainButtonClick: (event: React.MouseEvent) => void
}

function Toolbar(props: ToolbarProps ) {
    return (
        <div className="toolbar">
            <button type="button" className="btn btn-primary shadow-sm" onClick={props.onRiverButtonClick}>River <FontAwesomeIcon icon={faWater}/></button>
            <button type="button" className="btn btn-primary shadow-sm" onClick={props.onMountainButtonClick}>Mountain <FontAwesomeIcon icon={faMountain}/></button>
            <button type="button" className="btn btn-primary shadow-sm">Button3</button>
        </div>
        );
}

export default Toolbar;