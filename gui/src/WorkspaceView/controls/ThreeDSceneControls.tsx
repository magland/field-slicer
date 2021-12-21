import { Checkbox } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceViewSelection, WorkspaceViewSelectionAction } from '../workspaceViewSelectionReducer';

type ThreeDSceneControlProps = {
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
}

const ThreeDSceneControls: FunctionComponent<ThreeDSceneControlProps> = (props: ThreeDSceneControlProps) => {
    const {selection, selectionDispatch} = props

    const handleToggleShowReferencePlanes = useCallback(() => {
        selectionDispatch({
            type: 'toggleShowReferencePlanes'
        })
    }, [selectionDispatch])
    const handleToggleTransparentReferencePlanes = useCallback(() => {
        selectionDispatch({
            type: 'toggleTransparentReferencePlanes'
        })
    }, [selectionDispatch])
    const handleToggleShowReferenceLines = useCallback(() => {
        selectionDispatch({
            type: 'toggleShowReferenceLines'
        })
    }, [selectionDispatch])

    return (
        <div key="3d-scene">
            <h3>3D scene</h3>
            <div>
                <Checkbox
                    checked={selection.scene3DOpts.showReferencePlanes}
                    onChange={handleToggleShowReferencePlanes}
                /> Show reference planes
            </div>
            <div>
                <Checkbox
                    checked={selection.scene3DOpts.transparentReferencePlanes}
                    onChange={handleToggleTransparentReferencePlanes}
                /> Transparent reference planes
            </div>
            <div>
                <Checkbox
                    checked={selection.scene3DOpts.showReferenceLines}
                    onChange={handleToggleShowReferenceLines}
                /> Show reference lines
            </div>
        </div>
    )
}

export default ThreeDSceneControls