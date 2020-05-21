import * as React from 'react';

interface ToolbarProps {
    onRiverButtonClick: (event: React.MouseEvent) => void
    onMountainButtonClick: (event: React.MouseEvent) => void
}

function Toolbar(props: ToolbarProps ) {
    return (
        <div className="toolbar">
            <button type="button" className="btn btn-primary shadow-sm" onClick={props.onRiverButtonClick}>River</button>
            <button type="button" className="btn btn-primary shadow-sm" onClick={props.onMountainButtonClick}>Mountain</button>
            <button type="button" className="btn btn-primary shadow-sm">Button3</button>
        </div>
        );
}

export default Toolbar;