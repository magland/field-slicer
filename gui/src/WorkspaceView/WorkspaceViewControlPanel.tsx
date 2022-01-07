import React, { FunctionComponent } from 'react';
import { WorkspaceViewData } from 'VolumeViewData';
import GridFieldControls from './controls/GridFieldControls';
import GridSelectionControls from './controls/GridSelectionControls';
import PlaneViewControls from './controls/PlaneViewControls';
import SurfaceSelectionControls from './controls/SurfaceSelectionControls';
import ThreeDSceneControls from './controls/ThreeDSceneControls';
import { WorkspaceViewSelection, WorkspaceViewSelectionAction } from './workspaceViewSelectionReducer';

type Props = {
    data: WorkspaceViewData
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
    width: number
    height: number
}

const WorkspaceViewControlPanel: FunctionComponent<Props> = ({data, selection, selectionDispatch}) => {
    const gridControls = selection.gridName ? [<GridFieldControls
        data={data}
        selection={selection}
        selectionDispatch={selectionDispatch}
    />,
    <ThreeDSceneControls
        selection={selection}
        selectionDispatch={selectionDispatch}
    />,
    <PlaneViewControls
        selection={selection}
        selectionDispatch={selectionDispatch}
    />] : []

    return (
        <div style={{padding: 10, overflowY: "auto"}}>

            {/* Select grid */}
            {
                data.grids.length > 0 && 
                <GridSelectionControls
                    data={data}
                    selection={selection}
                    selectionDispatch={selectionDispatch}
                />
            }

            {/* Surfaces & their Fields */}
            {
                data.surfaces.length > 0 &&
                <SurfaceSelectionControls
                    data={data}
                    selection={selection}
                    selectionDispatch={selectionDispatch}
                />
            }

            {gridControls}
        </div>
    )
}

export default WorkspaceViewControlPanel