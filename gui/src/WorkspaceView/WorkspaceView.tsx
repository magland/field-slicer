import Splitter from 'components/Splitter/Splitter';
import React, { FunctionComponent, useEffect, useMemo, useReducer } from 'react';
import { WorkspaceViewData } from 'VolumeViewData';
import WorkspaceViewControlPanel from './WorkspaceViewControlPanel';
import WorkspaceViewMainWindow from './WorkspaceViewMainWindow';
import { defaultWorkspaceViewSelection, workspaceViewSelectionReducer } from './workspaceViewSelectionReducer';

type Props = {
    data: WorkspaceViewData
    width: number
    height: number
}

const WorkspaceView: FunctionComponent<Props> = ({data, width, height}) => {
    const [selection, selectionDispatch] = useReducer(workspaceViewSelectionReducer, defaultWorkspaceViewSelection)
    useEffect(() => {
        if (!selection.gridName) {
            const gridName = data.grids[0]?.name
            if (!gridName) return
            selectionDispatch({
                type: 'setGrid',
                gridName
            })
        }
        if (!selection.gridScalar) {
            if (data.gridScalarFields.length > 0) {
                selectionDispatch({
                    type: 'setGridScalar',
                    gridScalar: {
                        type: 'scalarField',
                        gridScalarFieldName: data.gridScalarFields[0].name
                    }
                })
            }
            else if (data.gridVectorFields.length > 0) {
                selectionDispatch({
                    type: 'setGridScalar',
                    gridScalar: {
                        type: 'vectorFieldComponent',
                        gridVectorFieldName: data.gridVectorFields[0].name,
                        componentName: 'magnitude'
                    }
                })
            }
        }
        if (!selection.visibleSurfaceNames) {
            selectionDispatch({
                type: 'setVisibleSurfaceNames',
                surfaceNames: data.surfaces.map(s => (s.name))
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // empty dependency array => only fires once

    const grid = useMemo(() => {
        if (!selection.gridName) return undefined
        return data.grids.filter(x => (x.name === selection.gridName))[0]
    }, [selection.gridName, data.grids])

    useEffect(() => {
        if (grid) {
            selectionDispatch({
                type: 'setPanelLayoutMode',
                panelLayoutMode: '4-panel'
            })
            selectionDispatch({
                type: 'setFocusPosition',
                focusPosition: [Math.floor(grid.Nx / 2), Math.floor(grid.Ny / 2), Math.floor(grid.Nz / 2)]
            })
        }
        else {
            selectionDispatch({
                type: 'setPanelLayoutMode',
                panelLayoutMode: '3d-scene'
            })
            selectionDispatch({
                type: 'setFocusPosition',
                focusPosition: undefined
            })
        }
    }, [grid])

    return (
        <Splitter
            width={width}
            height={height}
            initialPosition={300}
        >
            <WorkspaceViewControlPanel
                data={data}
                selection={selection}
                selectionDispatch={selectionDispatch}
                width={0} // filled in by splitter
                height={0} // filled in by splitter
            />
            <WorkspaceViewMainWindow
                data={data}
                selection={selection}
                selectionDispatch={selectionDispatch}
                width={0} // filled in by splitter
                height={0} // filled in by splitter
            />
        </Splitter>
    )
}

export default WorkspaceView