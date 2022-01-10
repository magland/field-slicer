import { Checkbox, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { WorkspaceSurfaceScalarField, WorkspaceSurfaceVectorField, WorkspaceViewData } from 'VolumeViewData';
import { WorkspaceViewSelection, WorkspaceViewSelectionAction } from '../workspaceViewSelectionReducer';
import "./Controls.css";

const separator = '::'

type SurfaceSelectionControlProps = {
    data: WorkspaceViewData
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
}

type SyncSwitchProps = {
    syncOn: boolean
    callback: any
}

type PerSurfaceControlsProps = {
    name: string
    displayed: boolean
    synchronized: boolean
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
    fieldNames: string[]
    selectedFieldName?: string
    type: 'vector' | 'scalar'
    callback: any
}

type SynchronizedFieldSelectionProps = {
    scalarFields: Set<string>  //string[]
    vectorFields: Set<string>  //string[]
    selectedScalarField?: string
    selectedVectorField?: string
    selectScalarFieldsCallback: any
    selectVectorFieldsCallback: any
}

type ChangeEvent = React.ChangeEvent<{value: unknown}>

const SurfaceSelectionControls: FunctionComponent<SurfaceSelectionControlProps> = (props: SurfaceSelectionControlProps) => {
    const { data, selection, selectionDispatch } = props

    const allSurfaceNames = useMemo(() => data.surfaces.map(s => s.name), [data.surfaces])

    // This is probably not performance-significant, but we expect the underlying data to change less frequently,
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

    const allFieldNames = useMemo(() => {
        // TODO: sort these & return as array?
        const scalarFields = new Set(data.surfaceScalarFields.map(f => f.name))
        const vectorFields = new Set(data.surfaceVectorFields.map(f => f.name))
        return { scalarFields: scalarFields, vectorFields: vectorFields }
    }, [data.surfaceScalarFields, data.surfaceVectorFields])

    const sharedSelectedScalarFieldName = useMemo(() => ( selection.selectedSurfaceScalarFieldNames[allSurfaceNames[0]] ?? ''),
        [selection.selectedSurfaceScalarFieldNames, allSurfaceNames])
    const sharedSelectedVectorFieldName = useMemo(() => ( selection.selectedSurfaceVectorFieldNames[allSurfaceNames[0]] ?? ''),
        [selection.selectedSurfaceVectorFieldNames, allSurfaceNames])

    const handleToggleVisibleSurface = useCallback((e: ChangeEvent) => {
        const surfaceName = e.target.value as string
        selectionDispatch({
            type: 'toggleVisibleSurface',
            surfaceName
        })
    }, [selectionDispatch])

    const handleToggleSurfaceSelectionSync = useCallback(() => {selectionDispatch({type: 'toggleSurfaceSelectionSynchronization'})}, [selectionDispatch])

    const fieldToggler = useCallback((name: string, fieldType: 'scalar' | 'vector') => {
        const type = fieldType === 'scalar' ? 'toggleSelectedSurfaceScalarField' : 'toggleSelectedSurfaceVectorField'
        // The reducer doesn't actually know the names of non-displayed surfaces--it doesn't see the data.
        // So to synchronize hidden surfaces properly, we have to provide the full list of known surface names.
        // The sign to do that is when the provided surface name is blank.
        const [ givenSurfaceName, surfaceFieldName ] = name.split(separator)
        const surfaceNames = givenSurfaceName ? [givenSurfaceName] : allSurfaceNames
        selectionDispatch({ type, surfaceFieldName, surfaceNames })
    }, [selectionDispatch, allSurfaceNames])

    const handleToggleSelectedScalarField = useCallback((e: ChangeEvent) => {
        fieldToggler(e.target.value as string, 'scalar')
    }, [fieldToggler])

    const handleToggleSelectedVectorField = useCallback((e: ChangeEvent) => {
        fieldToggler(e.target.value as string, 'vector')
    }, [fieldToggler])

    return (
        <div key="surfaces">
            <h3>Surfaces</h3>
            <SyncSwitch syncOn={selection.synchronizeSurfaceFieldSelection} callback={handleToggleSurfaceSelectionSync} />
            {
                selection.synchronizeSurfaceFieldSelection && <SynchronizedFieldSelectionControls
                    scalarFields={allFieldNames.scalarFields}
                    vectorFields={allFieldNames.vectorFields}
                    selectedScalarField={sharedSelectedScalarFieldName}
                    selectedVectorField={sharedSelectedVectorFieldName}
                    selectScalarFieldsCallback={handleToggleSelectedScalarField}
                    selectVectorFieldsCallback={handleToggleSelectedVectorField}
                />
            }
            {
                surfaces.map(surface => (
                    <PerSurfaceControls
                        name={surface.name}
                        displayed={surface.displayed}
                        synchronized={selection.synchronizeSurfaceFieldSelection}
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

const SyncSwitch: FunctionComponent<SyncSwitchProps> = (props: SyncSwitchProps) => {
    const { syncOn, callback } = props
    return (
        <FormGroup className={"slider"}>
            <FormControlLabel
                control={ <Switch checked={syncOn} size={"small"} onChange={() => callback()} /> }
                label={ <Typography variant="caption">Sync selected fields</Typography> }
            />
        </FormGroup>
    )
}

const PerSurfaceControls: FunctionComponent<PerSurfaceControlsProps> = (surface: PerSurfaceControlsProps) => {
    const { name, displayed, synchronized, scalarFields, vectorFields, selectedScalarFieldName, selectedVectorFieldName, visibilityCallback, selectedVectorFieldCallback, selectedScalarFieldCallback } = surface
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
            {displayed && !synchronized && <FieldSelector
                surfaceName={name}
                fieldNames={vectorFields.map(vf => vf.name)}
                selectedFieldName={selectedVectorFieldName}
                type={'vector'}
                callback={selectedVectorFieldCallback}
            />}
            {/* Scalar field selector */}
            {displayed && !synchronized && <FieldSelector
                surfaceName={name}
                fieldNames={scalarFields.map(sf => sf.name)}
                selectedFieldName={selectedScalarFieldName}
                type={'scalar'}
                callback={selectedScalarFieldCallback}
            />}
        </div>
    )
}

const FieldSelector: FunctionComponent<FieldSelectorProps> = (props: FieldSelectorProps) => {
    const { surfaceName, fieldNames, selectedFieldName, type, callback } = props
    if (fieldNames.length === 0) return (<React.Fragment />)
    return (
        <div key={`surface-${type}-fields`}>
            <span>
                <h4>Surface {type} fields</h4>
            </span>
            {
                fieldNames.map(name => (
                    <div key={name}>
                        <Checkbox
                            value={`${surfaceName}${separator}${name}`}
                            checked={selectedFieldName === name}
                            onChange={callback}
                        />
                        {name}
                    </div>
                ))
            }
        </div>
    )
}

const SynchronizedFieldSelectionControls: FunctionComponent<SynchronizedFieldSelectionProps> = (props: SynchronizedFieldSelectionProps) => {
    const { scalarFields, vectorFields, selectedScalarField, selectedVectorField, selectScalarFieldsCallback, selectVectorFieldsCallback } = props
    if (scalarFields.size === 0 && vectorFields.size === 0) return <React.Fragment />

    return (
        <div key={'field-selection'}>
            {
                vectorFields.size > 0 && <FieldSelector
                    surfaceName='' // an empty surface name means to apply the selection to all surfaces
                    fieldNames={Array.from(vectorFields)}
                    selectedFieldName={selectedVectorField}
                    type={'vector'}
                    callback={selectVectorFieldsCallback}
                />
            }
            {
                scalarFields.size > 0 && <FieldSelector
                    surfaceName=''
                    fieldNames={Array.from(scalarFields)}
                    selectedFieldName={selectedScalarField}
                    type={'scalar'}
                    callback={selectScalarFieldsCallback}
                />
            }
        </div>
    )
}



export default SurfaceSelectionControls