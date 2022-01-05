import { Checkbox, MenuItem, Radio, Select } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceViewData } from 'VolumeViewData';
import GridFieldControls from './controls/GridFieldControls';
import GridSelectionControls from './controls/GridSelectionControls';
import PlaneViewControls from './controls/PlaneViewControls';
import SurfaceSelectionControls from './controls/SurfaceSelectionControls';
import ThreeDSceneControls from './controls/ThreeDSceneControls';
import ZoomFactorControl, { ArrowScaleFactorControl, BrightnessFactorControl } from './controls/ZoomFactorControl';
import { VectorFieldComponentName, WorkspaceViewSelection, WorkspaceViewSelectionAction } from './workspaceViewSelectionReducer';

type Props = {
    data: WorkspaceViewData
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
    width: number
    height: number
}

const WorkspaceViewControlPanel: FunctionComponent<Props> = ({data, selection, selectionDispatch}) => {
    const handleSelectedGridChanged = useCallback((evt: React.ChangeEvent<{name?: string, value: any}>) => {
        const a = evt.target.value as string
        selectionDispatch({
            type: 'setGrid',
            gridName: a !== '<undefined>' ? a : undefined
        })
    }, [selectionDispatch])
    const handleVectorFieldComponentChange = useCallback((e: React.ChangeEvent<{
        value: unknown
    }>) => {
        const x = JSON.parse(e.target.value as string) as {gridVectorFieldName: string, componentName: VectorFieldComponentName}
        selectionDispatch({
            type: 'setGridScalar',
            gridScalar: {type: 'vectorFieldComponent', gridVectorFieldName: x.gridVectorFieldName, componentName: x.componentName}
        })
    }, [selectionDispatch])
    const handleScalarFieldChange = useCallback((e: React.ChangeEvent<{
        value: unknown
    }>) => {
        const x = JSON.parse(e.target.value as string) as {gridScalarFieldName: string}
        selectionDispatch({
            type: 'setGridScalar',
            gridScalar: {type: 'scalarField', gridScalarFieldName: x.gridScalarFieldName}
        })
    }, [selectionDispatch])
    const handleVectorFieldArrowChange = useCallback((e: React.ChangeEvent<{
        value: unknown
    }>) => {
        const gridVectorFieldName = e.target.value as string
        selectionDispatch({
            type: 'toggleGridArrowVectorField',
            gridVectorFieldName
        })
    }, [selectionDispatch])
    const handleToggleVisibleSurface = useCallback((e: React.ChangeEvent<{
        value: unknown
    }>) => {
        const surfaceName = e.target.value as string
        selectionDispatch({
            type: 'toggleVisibleSurface',
            surfaceName
        })
    }, [selectionDispatch])
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
    const handleToggleSelectSurfaceScalarField = useCallback((e: React.ChangeEvent<{
        value: unknown
    }>) => {
        const surfaceScalarFieldName = e.target.value as string
        const surfaceName = data.surfaceScalarFields.filter(y => (y.name === surfaceScalarFieldName))[0].surfaceName
        selectionDispatch({
            type: 'toggleSelectedSurfaceScalarField',
            surfaceName,
            surfaceScalarFieldName
        })
    }, [selectionDispatch, data.surfaceScalarFields])
    const handleToggleSelectSurfaceVectorField = useCallback((e: React.ChangeEvent<{
        value: unknown
    }>) => {
        const surfaceVectorFieldName = e.target.value as string
        const surfaceName = data.surfaceVectorFields.filter(y => (y.name === surfaceVectorFieldName))[0].surfaceName
        selectionDispatch({
            type: 'toggleSelectedSurfaceVectorField',
            surfaceName,
            surfaceVectorFieldName
        })
    }, [selectionDispatch, data.surfaceVectorFields])
    return (
        <div style={{padding: 10, overflowY: "auto"}}>

            {/* Select grid */}
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

            {/* Grid vector fields */}
            <div key="grid-vector-fields">
                <h3>Grid vector fields</h3>
                {
                    data.gridVectorFields.filter(x => (x.gridName === selection.gridName)).map(x => (
                        <div key={x.name}>
                            <div key="grid-vector-field">{x.name}</div>
                            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                            {
                                vectorFieldComponentNames.map(a => (
                                    <div key={a} style={{whiteSpace: 'nowrap'}}>
                                        <Radio
                                            value={JSON.stringify({gridVectorFieldName: x.name, componentName: a})}
                                            checked={gridScalarsAreEqual(selection.gridScalar, {type: 'vectorFieldComponent', gridVectorFieldName: x.name, componentName: a})}
                                            onChange={handleVectorFieldComponentChange}
                                        /> {a}
                                    </div>
                                ))
                            }
                            </div>
                            <div key="arrows">
                                <Checkbox
                                    value={x.name}
                                    checked={selection.gridArrowVectorFieldName === x.name}
                                    onChange={handleVectorFieldArrowChange}
                                /> Arrows
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Grid scalar fields */}
            <div key="grid-scalar-fields">
                <h3>Grid scalar fields</h3>
                {
                    data.gridScalarFields.filter(x => (x.gridName === selection.gridName)).map(x => (
                        <div key={x.name}>
                            <div key="grid-scalar-field">{x.name}</div>
                            <div>
                                <Radio
                                    value={JSON.stringify({gridScalarFieldName: x.name})}
                                    checked={gridScalarsAreEqual(selection.gridScalar, {type: 'scalarField', gridScalarFieldName: x.name})}
                                    onChange={handleScalarFieldChange}
                                /> scalar
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Surfaces */}
            <div key="surfaces">
                {
                    data.surfaces.map(x => {
                        const surfaceVectorFields = data.surfaceVectorFields.filter(y => (y.surfaceName === x.name))
                        const surfaceScalarFields = data.surfaceScalarFields.filter(y => (y.surfaceName === x.name))
                        return (
                            <div key={x.name}>
                                <h3 key="surface">Surface: {x.name}</h3>
                                <div key="show">
                                    <Checkbox
                                        value={x.name}
                                        checked={(selection.visibleSurfaceNames || []).includes(x.name)}
                                        onChange={handleToggleVisibleSurface}
                                    /> show surface
                                </div>
                                <div key="surface-vector-fields">
                                    {
                                        surfaceVectorFields.length > 0 && (
                                            <span>
                                                <h4>Surface vector fields</h4>
                                                {
                                                    surfaceVectorFields.map(y => (
                                                        <div key={y.name}>
                                                            <Checkbox
                                                                value={y.name}
                                                                checked={selection.selectedSurfaceVectorFieldNames[x.name] === y.name}
                                                                onChange={handleToggleSelectSurfaceVectorField}
                                                            />
                                                            {y.name}
                                                        </div>
                                                    ))
                                                }
                                            </span>
                                        )
                                    }
                                </div>
                                <div key="surface-scalar-fields">
                                    {
                                        surfaceScalarFields.length > 0 && (
                                            <span>
                                                <h4>Surface scalar fields</h4>
                                                {
                                                    surfaceScalarFields.map(y => (
                                                        <div key={y.name}>
                                                            <Checkbox
                                                                value={y.name}
                                                                checked={selection.selectedSurfaceScalarFieldNames[x.name] === y.name}
                                                                onChange={handleToggleSelectSurfaceScalarField}
                                                            />
                                                            {y.name}
                                                        </div>
                                                    ))
                                                }
                                            </span>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {/* 3D Scene */}
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

            {/* Plane views */}
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
            </div>
        </div>
    )
}

export default WorkspaceViewControlPanel