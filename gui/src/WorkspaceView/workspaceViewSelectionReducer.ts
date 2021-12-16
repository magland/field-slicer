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

export type ReferencePlaneOpts = {
    show: boolean
    transparent: boolean
    opacity: number
}

export type WorkspaceViewSelection = {
    gridName?: string
    gridScalar?: GridScalarValue
    gridArrowVectorFieldName?: string
    focusPosition?: [number, number, number]
    visibleSurfaceNames?: string[]
    referencePlaneOpts: ReferencePlaneOpts
}

export const defaultWorkspaceViewSelection: WorkspaceViewSelection = {
    referencePlaneOpts: {
        show: true,
        transparent: true,
        opacity: 0.7
    }
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
} | {
    type: 'toggleVisibleSurface'
    surfaceName: string
} | {
    type: 'setVisibleSurfaceNames'
    surfaceNames: string[]
} | {
    type: 'toggleShowReferencePlanes'
} | {
    type: 'toggleTransparentReferencePlanes'
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
    else if (a.type === 'toggleVisibleSurface') {
        return {...s, visibleSurfaceNames: toggleStringInList(s.visibleSurfaceNames || [], a.surfaceName)}
    }
    else if (a.type === 'setVisibleSurfaceNames') {
        return {...s, visibleSurfaceNames: a.surfaceNames}
    }
    else if (a.type === 'toggleShowReferencePlanes') {
        return {...s, referencePlaneOpts: {...s.referencePlaneOpts, show: !s.referencePlaneOpts.show}}
    }
    else if (a.type === 'toggleTransparentReferencePlanes') {
        return {...s, referencePlaneOpts: {...s.referencePlaneOpts, transparent: !s.referencePlaneOpts.transparent}}
    }
    else {
        throw Error('Unexpected action type')
    }
}

const toggleStringInList = (x: string[], a: string) => {
    if (x.includes(a)) return x.filter(b => (b !== a))
    else return [...x, a]
}