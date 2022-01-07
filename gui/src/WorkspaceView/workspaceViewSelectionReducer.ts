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

export type Scene3DOpts = {
    showReferencePlanes: boolean
    transparentReferencePlanes: boolean
    referencePlanesOpacity: number
    showReferenceLines: boolean
}

export type PlaneViewOpts = {
    zoomFactor: number
    brightnessFactor: number
    arrowScaleFactor: number
    arrowStride: number
}

export type PanelLayoutMode = '4-panel' | '3d-scene' | 'XY' | 'XZ' | 'YZ'

export type WorkspaceViewSelection = {
    gridName?: string
    gridScalar?: GridScalarValue
    gridArrowVectorFieldName?: string
    focusPosition?: [number, number, number]
    visibleSurfaceNames?: string[]
    selectedSurfaceScalarFieldNames: {[key: string]: string | undefined}
    selectedSurfaceVectorFieldNames: {[key: string]: string | undefined}
    scene3DOpts: Scene3DOpts
    planeViewOpts: PlaneViewOpts
    panelLayoutMode: PanelLayoutMode
}

export const defaultWorkspaceViewSelection: WorkspaceViewSelection = {
    scene3DOpts: {
        showReferencePlanes: true,
        transparentReferencePlanes: true,
        showReferenceLines: true,
        referencePlanesOpacity: 0.7
    },
    planeViewOpts: {
        zoomFactor: 1,
        brightnessFactor: 1,
        arrowScaleFactor: 1,
        arrowStride: 3
    },
    selectedSurfaceScalarFieldNames: {},
    selectedSurfaceVectorFieldNames: {},
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
    type: 'toggleShowReferenceLines'
} | {
    type: 'planeViewZoom'
    direction: number
} | {
    type: 'planeViewBrighten'
    direction: number
} | {
    type: 'planeViewScaleArrows'
    direction: number
} | {
    type: 'planeViewAdjustArrowStride'
    direction: number
} | {
    type: 'setPanelLayoutMode'
    panelLayoutMode: PanelLayoutMode
} | {
    type: 'toggleSelectedSurfaceScalarField'
    surfaceFieldName: string
    surfaceName: string
} | {
    type: 'toggleSelectedSurfaceVectorField'
    surfaceFieldName: string
    surfaceName: string
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
        return {...s, scene3DOpts: {...s.scene3DOpts, showReferencePlanes: !s.scene3DOpts.showReferencePlanes}}
    }
    else if (a.type === 'toggleTransparentReferencePlanes') {
        return {...s, scene3DOpts: {...s.scene3DOpts, transparentReferencePlanes: !s.scene3DOpts.transparentReferencePlanes}}
    }
    else if (a.type === 'toggleShowReferenceLines') {
        return {...s, scene3DOpts: {...s.scene3DOpts, showReferenceLines: !s.scene3DOpts.showReferenceLines}}
    }
    else if (a.type === 'planeViewZoom') {
        return {...s, planeViewOpts: {...s.planeViewOpts, zoomFactor: doZoom(s.planeViewOpts.zoomFactor, a.direction)}}
    }
    else if (a.type === 'planeViewBrighten') {
        return {...s, planeViewOpts: {...s.planeViewOpts, brightnessFactor: doZoom(s.planeViewOpts.brightnessFactor, a.direction)}}
    }
    else if (a.type === 'planeViewScaleArrows') {
        return {...s, planeViewOpts: {...s.planeViewOpts, arrowScaleFactor: doZoom(s.planeViewOpts.arrowScaleFactor, a.direction)}}
    }
    else if (a.type === 'planeViewAdjustArrowStride') {
        return {...s, planeViewOpts: {...s.planeViewOpts, arrowStride: adjustStride(s.planeViewOpts.arrowStride, a.direction)}}
    }
    else if (a.type === 'setPanelLayoutMode') {
        return {...s, panelLayoutMode: a.panelLayoutMode}
    }
    else if (a.type === 'toggleSelectedSurfaceScalarField') {
        const name = s.selectedSurfaceScalarFieldNames[a.surfaceName]
        const X = {...s.selectedSurfaceScalarFieldNames}
        if ((name) && (name === a.surfaceFieldName)) {
            X[a.surfaceName] = undefined
        }
        else {
            X[a.surfaceName] = a.surfaceFieldName
        }
        return {...s, selectedSurfaceScalarFieldNames: X}
    }
    else if (a.type === 'toggleSelectedSurfaceVectorField') {
        const name = s.selectedSurfaceVectorFieldNames[a.surfaceName]
        const X = {...s.selectedSurfaceVectorFieldNames}
        if ((name) && (name === a.surfaceFieldName)) {
            X[a.surfaceName] = undefined
        }
        else {
            X[a.surfaceName] = a.surfaceFieldName
        }
        return {...s, selectedSurfaceVectorFieldNames: X}
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

const adjustStride = (stride: number, direction: number) => {
    if (direction < 0) {
        if (stride > 1) return stride - 1
        else return stride
    }
    else if (direction > 0) {
        return stride + 1
    }
    else return stride
}

const toggleStringInList = (x: string[], a: string) => {
    if (x.includes(a)) return x.filter(b => (b !== a))
    else return [...x, a]
}