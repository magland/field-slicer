import { Checkbox, Radio } from '@material-ui/core';
import React, { Fragment, FunctionComponent, useCallback } from 'react';
import { WorkspaceViewData } from 'VolumeViewData';
import { GridScalarValue, VectorFieldComponentName, vectorFieldComponentNames, WorkspaceViewSelection, WorkspaceViewSelectionAction } from '../workspaceViewSelectionReducer';
import JSONStringifyDeterministic from './jsonStringifyDeterministic';

type GridFieldSelectionControlsProps = {
    data: WorkspaceViewData
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
}

const GridFieldControls: FunctionComponent<GridFieldSelectionControlsProps> = (props: GridFieldSelectionControlsProps) => {
    const { data, selection, selectionDispatch } = props

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

    return (
        <Fragment>
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
        </Fragment>
    )
}

const gridScalarsAreEqual = (a: GridScalarValue | undefined, b: GridScalarValue | undefined) => {
    if (!a) return false
    if (!b) return false
    return JSONStringifyDeterministic(a) === JSONStringifyDeterministic(b)
}

export default GridFieldControls