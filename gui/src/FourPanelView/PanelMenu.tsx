import { IconButton } from '@material-ui/core';
import { CropSquare } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { PanelLayoutMode } from 'WorkspaceView/workspaceViewSelectionReducer';

type Props = {
    panelLayoutMode: PanelLayoutMode
    setPanelLayoutMode: (mode: PanelLayoutMode) => void
    targetPanelLayoutMode: PanelLayoutMode
}

const style0 = {
    fill: 'gray'
}

const PanelMenu: FunctionComponent<Props> = ({panelLayoutMode, setPanelLayoutMode, targetPanelLayoutMode}) => {
    return (
        <div style={{textAlign: 'right'}}>
            {
                panelLayoutMode === '4-panel' ? (
                    <IconButton onClick={() => setPanelLayoutMode(targetPanelLayoutMode)}><CropSquare style={style0} /></IconButton>        
                ) : panelLayoutMode === targetPanelLayoutMode ? (
                    <IconButton onClick={() => setPanelLayoutMode('4-panel')}><CropSquare style={style0} /></IconButton>
                ) : <span />
            }
            
        </div>
    )
}

export default PanelMenu