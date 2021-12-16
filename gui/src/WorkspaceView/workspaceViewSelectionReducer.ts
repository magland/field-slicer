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

export type PlaneViewOpts = {
    zoomFactor: number
}

export type PanelLayoutMode = '4-panel' | '3d-scene' | 'XY' | 'XZ' | 'YZ'

export type WorkspaceViewSelection = {
    gridName?: string
    gridScalar?: GridScalarValue
    gridArrowVectorFieldName?: string
    focusPosition?: [number, number, number]
    visibleSurfaceNames?: string[]
    referencePlaneOpts: ReferencePlaneOpts
    planeViewOpts: PlaneViewOpts
    panelLayoutMode: PanelLayoutMode
}

export const defaultWorkspaceViewSelection: WorkspaceViewSelection = {
    referencePlaneOpts: {
        show: true,
        transparent: true,
        opacity: 0.7
    },
    planeViewOpts: {
        zoomFactor: 1
    },
    panelLayoutMode: '4-panel'
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
} | {
    type: 'planeViewZoom'
    direction: number
} | {
    type: 'setPanelLayoutMode'
    panelLayoutMode: PanelLayoutMode
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
    else if (a.type === 'planeViewZoom') {
        return {...s, planeViewOpts: {...s.planeViewOpts, zoomFactor: doZoom(s.planeViewOpts.zoomFactor, a.direction)}}
    }
    else if (a.type === 'setPanelLayoutMode') {
        return {...s, panelLayoutMode: a.panelLayoutMode}
    }
    else {
        throw Error('Unexpected action type')
    }
}

const doZoom = (zoomFactor: number, direction: number) => {
    if (direction < 0) {
        if (zoomFactor > 1) return zoomFactor - 1
        else return 1 / (Math.round(1 / zoomFactor) + 1)
    }
    else if (direction > 0) {
        if (zoomFactor >= 1) return zoomFactor + 1
        else return 1 / (Math.round(1 / zoomFactor) - 1)
    }
    else return zoomFactor
}

const toggleStringInList = (x: string[], a: string) => {
    if (x.includes(a)) return x.filter(b => (b !== a))
    else return [...x, a]
}