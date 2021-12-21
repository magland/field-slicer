import { Checkbox } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceViewData } from 'VolumeViewData';
import { WorkspaceViewSelection, WorkspaceViewSelectionAction } from '../workspaceViewSelectionReducer';

type SurfaceSelectionControlProps = {
    data: WorkspaceViewData
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
}

const SurfaceSelectionControls: FunctionComponent<SurfaceSelectionControlProps> = (props: SurfaceSelectionControlProps) => {
    const { data, selection, selectionDispatch } = props

    const handleToggleVisibleSurface = useCallback((e: React.ChangeEvent<{
        value: unknown
    }>) => {
        const surfaceName = e.target.value as string
        selectionDispatch({
            type: 'toggleVisibleSurface',
            surfaceName
        })
    }, [selectionDispatch])


    return (
        <div key="surfaces">
            <h3>Surfaces</h3>
            {
                data.surfaces.map(x => (
                    <div key={x.name}>
                        <div key="surface">Surface: {x.name}</div>
                        <div key="show">
                            <Checkbox
                                value={x.name}
                                checked={(selection.visibleSurfaceNames || []).includes(x.name)}
                                onChange={handleToggleVisibleSurface}
                            /> show surface
                        </div>
                        <div key="surface-vector-fields">
                            {/* todo */}
                        </div>
                        <div key="surface-scalar-fields">
                            {/* todo */}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default SurfaceSelectionControls
