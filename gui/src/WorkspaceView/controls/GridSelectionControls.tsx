import { MenuItem, Select } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceViewData } from 'VolumeViewData';
import { WorkspaceViewSelection, WorkspaceViewSelectionAction } from '../workspaceViewSelectionReducer';

type GridSelectionProps = {
    data: WorkspaceViewData
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
}

const GridSelectionControls: FunctionComponent<GridSelectionProps> = (props: GridSelectionProps) => {
    const {data, selection, selectionDispatch } = props

    const handleSelectedGridChanged = useCallback((evt: React.ChangeEvent<{name?: string, value: any}>) => {
        const a = evt.target.value as string
        selectionDispatch({
            type: 'setGrid',
            gridName: a !== '<undefined>' ? a : undefined
        })
    }, [selectionDispatch])

    return (
        <div key="select-grid">
            <h3>Grid</h3>
            <Select
                value={selection.gridName || '<undefined>'}
                onChange={handleSelectedGridChanged}
            >
                <MenuItem key="<undefined>" value="<undefined>">Select a grid</MenuItem>
                {
                    data.grids.map(grid => (
                        <MenuItem key={grid.name} value={grid.name}>{grid.name}</MenuItem>
                    ))
                }
            </Select>
        </div>
    )
}

export default GridSelectionControls
