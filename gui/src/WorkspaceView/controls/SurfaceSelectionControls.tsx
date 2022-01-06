import { Checkbox } from '@material-ui/core';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { WorkspaceSurfaceScalarField, WorkspaceSurfaceVectorField, WorkspaceViewData } from 'VolumeViewData';
import { WorkspaceViewSelection, WorkspaceViewSelectionAction } from '../workspaceViewSelectionReducer';

const separator = '::'

type SurfaceSelectionControlProps = {
    data: WorkspaceViewData
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
}

type PerSurfaceControlsProps = {
    name: string
    displayed: boolean
    scalarFields: WorkspaceSurfaceScalarField[]
    vectorFields: WorkspaceSurfaceVectorField[]
    selectedScalarFieldName?: string
    selectedVectorFieldName?: string
    visibilityCallback: any
    selectedVectorFieldCallback: any
    selectedScalarFieldCallback: any
}

type FieldSelectorProps = {
    surfaceName: string
    fields: WorkspaceSurfaceScalarField[] | WorkspaceSurfaceVectorField[]
    selectedFieldName?: string
    type: 'vector' | 'scalar'
    callback: any
}

type ChangeEvent = React.ChangeEvent<{value: unknown}>

const SurfaceSelectionControls: FunctionComponent<SurfaceSelectionControlProps> = (props: SurfaceSelectionControlProps) => {
    const { data, selection, selectionDispatch } = props

    const handleToggleVisibleSurface = useCallback((e: ChangeEvent) => {
        const surfaceName = e.target.value as string
        selectionDispatch({
            type: 'toggleVisibleSurface',
            surfaceName
        })
    }, [selectionDispatch])

    const fieldTtoggler = useCallback((name: string, fieldType: 'scalar' | 'vector') => {
        const type = fieldType === 'scalar' ? 'toggleSelectedSurfaceScalarField' : 'toggleSelectedSurfaceVectorField'
        const [ surfaceName, surfaceFieldName ] = name.split(separator)
        console.log(`Dispatching for ${surfaceName} ${surfaceFieldName} from ${name}`)
        selectionDispatch({ type, surfaceName, surfaceFieldName })
    }, [selectionDispatch])

    const handleToggleSelectedScalarField = useCallback((e: ChangeEvent) => {
        fieldTtoggler(e.target.value as string, 'scalar')
    }, [fieldTtoggler])

    const handleToggleSelectedVectorField = useCallback((e: ChangeEvent) => {
        fieldTtoggler(e.target.value as string, 'vector')
    }, [fieldTtoggler])

    // This is probably not a huge performance boost, but we expect the underlying data to change rarely,
    // while the selection state will change much more frequently.
    // Might as well memoize the filtering that matches surfaces to fields, so we don't need to re-filter
    // every time a selection state changes.
    const surfacesWithFields = useMemo(() => (
        data.surfaces.map(surface => {
            return {
                name: surface.name,
                scalarFields: data.surfaceScalarFields.filter(field => field.surfaceName === surface.name),
                vectorFields: data.surfaceVectorFields.filter(field => field.surfaceName === surface.name)
            }
        })
    ), [data.surfaces, data.surfaceScalarFields, data.surfaceVectorFields])

    const surfaces = useMemo(() => (surfacesWithFields.map(surface => {
        return {
            name: surface.name,
            displayed: (selection.visibleSurfaceNames || []).includes(surface.name),
            scalarFields: surface.scalarFields,
            vectorFields: surface.vectorFields,
            selectedScalarFieldName: selection.selectedSurfaceScalarFieldNames[surface.name],
            selectedVectorFieldName: selection.selectedSurfaceVectorFieldNames[surface.name]
        }
    })), [surfacesWithFields, selection.selectedSurfaceVectorFieldNames, selection.selectedSurfaceScalarFieldNames, selection.visibleSurfaceNames])

    return (
        <div key="surfaces">
            <h3>Surfaces</h3>
            {
                surfaces.map(surface => (
                    <PerSurfaceControls
                        name={surface.name}
                        displayed={surface.displayed}
                        scalarFields={surface.scalarFields}
                        vectorFields={surface.vectorFields}
                        selectedScalarFieldName={surface.selectedScalarFieldName}
                        selectedVectorFieldName={surface.selectedVectorFieldName}
                        visibilityCallback={handleToggleVisibleSurface}
                        selectedScalarFieldCallback={handleToggleSelectedScalarField}
                        selectedVectorFieldCallback={handleToggleSelectedVectorField}
                    />
                ))
            }
        </div>
    )
}

const PerSurfaceControls: FunctionComponent<PerSurfaceControlsProps> = (surface: PerSurfaceControlsProps) => {
    const { name, displayed, scalarFields, vectorFields, selectedScalarFieldName, selectedVectorFieldName, visibilityCallback, selectedVectorFieldCallback, selectedScalarFieldCallback } = surface
    return (
        <div key={name}>
            <h3 key="surface">Surface: {name}</h3>
            <div key="show">
                <Checkbox
                    value={name}
                    checked={displayed}
                    onChange={visibilityCallback}
                /> show surface
            </div>
            {/* Vector field selector */}
            {displayed && <FieldSelector
                surfaceName={name}
                fields={vectorFields}
                selectedFieldName={selectedVectorFieldName}
                type={'vector'}
                callback={selectedVectorFieldCallback}
            />}
            {/* Scalar field selector */}
            {displayed && <FieldSelector
                surfaceName={name}
                fields={scalarFields}
                selectedFieldName={selectedScalarFieldName}
                type={'scalar'}
                callback={selectedScalarFieldCallback}
            />}
        </div>
    )
}

const FieldSelector: FunctionComponent<FieldSelectorProps> = (props: FieldSelectorProps) => {
    const { surfaceName, fields, selectedFieldName, type, callback } = props
    if (fields.length === 0) return (<span />)
    return (
        <div key={`surface-${type}-fields`}>
            <span>
                <h4>Surface {type} fields</h4>
                {
                    fields.map(field => (
                        <div key={field.name}>
                            <Checkbox
                                value={`${surfaceName}${separator}${field.name}`}
                                checked={selectedFieldName === field.name}
                                onChange={callback}
                            />
                            {field.name}
                        </div>
                    ))
                }
            </span>
        </div>
    )
}

export default SurfaceSelectionControls