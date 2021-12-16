import { Checkbox, MenuItem, Radio, Select } from '@material-ui/core';
import { JSONStringifyDeterministic } from 'figurl/viewInterface/kacheryTypes';
import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceViewData } from 'VolumeViewData';
import { GridScalarValue, VectorFieldComponentName, vectorFieldComponentNames, WorkspaceViewSelection, WorkspaceViewSelectionAction } from './workspaceViewSelectionReducer';

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
                            <div key="grid-vector-field">{x.name} (grid vector field)</div>
                            {
                                vectorFieldComponentNames.map(a => (
                                    <div key={a}>
                                        <Radio
                                            value={JSON.stringify({gridVectorFieldName: x.name, componentName: a})}
                                            checked={gridScalarsAreEqual(selection.gridScalar, {type: 'vectorFieldComponent', gridVectorFieldName: x.name, componentName: a})}
                                            onChange={handleVectorFieldComponentChange}
                                        /> {a}
                                    </div>
                                ))
                            }
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
                            <div key="grid-scalar-field">{x.name} (grid scalar field)</div>
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

            {/* 3D Scene */}
            <div key="3d-scene">
                <h3>3D scene</h3>
                <div>
                    <Checkbox
                        checked={selection.referencePlaneOpts.show}
                        onChange={handleToggleShowReferencePlanes}
                    /> Show reference planes
                </div>
                <div>
                    <Checkbox
                        checked={selection.referencePlaneOpts.transparent}
                        onChange={handleToggleTransparentReferencePlanes}
                    /> Transparent reference planes
                </div>
            </div>
        </div>
    )
}

const gridScalarsAreEqual = (a: GridScalarValue | undefined, b: GridScalarValue | undefined) => {
        if (!a) return false
        if (!b) return false
        return JSONStringifyDeterministic(a) === JSONStringifyDeterministic(b)
}

export default WorkspaceViewControlPanel