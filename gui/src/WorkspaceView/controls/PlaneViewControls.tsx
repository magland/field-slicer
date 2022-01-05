import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceViewSelection, WorkspaceViewSelectionAction } from '../workspaceViewSelectionReducer';
import ZoomFactorControl, { ArrowScaleFactorControl, ArrowStrideControl, BrightnessFactorControl } from './ZoomFactorControl';

type PlaneViewControlProps = {
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
}


const PlaneViewControls: FunctionComponent<PlaneViewControlProps> = (props: PlaneViewControlProps) => {
    const {selection, selectionDispatch} = props

    const handlePlaneViewZoom = useCallback((direction: number) => {
        selectionDispatch({
            type: 'planeViewZoom',
            direction
        })
    }, [selectionDispatch])
    const handlePlaneViewBrighten = useCallback((direction: number) => {
        selectionDispatch({
            type: 'planeViewBrighten',
            direction
        })
    }, [selectionDispatch])
    const handlePlaneViewScaleArrows = useCallback((direction: number) => {
        selectionDispatch({
            type: 'planeViewScaleArrows',
            direction
        })
    }, [selectionDispatch])
    const handlePlaneViewAdjustArrowStride = useCallback((direction: number) => {
        selectionDispatch({
            type: 'planeViewAdjustArrowStride',
            direction
        })
    }, [selectionDispatch])

    return (
        <div key="plane-views">
            <h3>Plane views</h3>
            <ZoomFactorControl
                value={selection.planeViewOpts.zoomFactor}
                onZoom={handlePlaneViewZoom}
            />
            <div>&nbsp;</div>
            <BrightnessFactorControl
                value={selection.planeViewOpts.brightnessFactor}
                onBrighten={handlePlaneViewBrighten}
            />
            <div>&nbsp;</div>
            <ArrowScaleFactorControl
                value={selection.planeViewOpts.arrowScaleFactor}
                onScaleArrows={handlePlaneViewScaleArrows}
            />
            <div>&nbsp;</div>
            <ArrowStrideControl
                value={selection.planeViewOpts.arrowStride}
                onAdjustArrowStride={handlePlaneViewAdjustArrowStride}
            />
        </div>
    )
}

export default PlaneViewControls