import { Checkbox } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import { WorkspaceViewData } from 'VolumeViewData';
import GridFieldControls from './controls/GridFieldControls';
import GridSelectionControls from './controls/GridSelectionControls';
import PlaneViewControls from './controls/PlaneViewControls';
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
    const handleToggleVisibleSurface = useCallback((e: React.ChangeEvent<{
        value: unknown
    }>) => {
        const surfaceName = e.target.value as string
        selectionDispatch({
            type: 'toggleVisibleSurface',
            surfaceName
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

            {gridControls}
        </div>
    )
}

export default WorkspaceViewControlPanel