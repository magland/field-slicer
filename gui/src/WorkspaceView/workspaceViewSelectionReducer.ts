export type VectorFieldComponentName = 'X' | 'Y' | 'Z' | 'magnitude'

export const vectorFieldComponentNames: VectorFieldComponentName[] = ['X', 'Y', 'Z', 'magnitude']

export type GridScalarValue = {
    type: 'scalarField'
    gridScalarFieldName: string
} | {
    type: 'vectorFieldComponent'
    gridVectorFieldName: string
    componentName: VectorFieldComponentName
}

export type WorkspaceViewSelection = {
    gridName?: string
    gridScalar?: GridScalarValue
    gridArrowVectorFieldName?: string
    focusPosition?: [number, number, number]
}

export type WorkspaceViewSelectionAction = {
    type: 'setGrid'
    gridName: string | undefined
} | {
    type: 'setGridScalar'
    gridScalar: GridScalarValue | undefined // can either be a scalar field or a component of a vector field
} | {
    type: 'setGridArrowVectorField',
    gridVectorFieldName: string
} | {
    type: 'toggleGridArrowVectorField',
    gridVectorFieldName: string
} | {
    type: 'setFocusPosition'
    focusPosition: [number, number, number] | undefined
}

export const workspaceViewSelectionReducer = (s: WorkspaceViewSelection, a: WorkspaceViewSelectionAction): WorkspaceViewSelection => {
    if (a.type === 'setGrid') {
        return {...s, gridName: a.gridName}
    }
    else if (a.type === 'setGridScalar') {
        return {...s, gridScalar: a.gridScalar}
    }
    else if (a.type === 'setGridArrowVectorField') {
        return {...s, gridArrowVectorFieldName: a.gridVectorFieldName}
    }
    else if (a.type === 'toggleGridArrowVectorField') {
        return {...s, gridArrowVectorFieldName: s.gridArrowVectorFieldName === a.gridVectorFieldName ? undefined : a.gridVectorFieldName}
    }
    else if (a.type === 'setFocusPosition') {
        return {...s, focusPosition: a.focusPosition}
    }
    else {
        throw Error('Unexpected action type')
    }
}