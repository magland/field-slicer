import validateObject, { isArrayOf, isEqualTo, isNumber, isString, isOneOf } from "./validateObject"

export type WorkspaceGrid = {
    name: string
    Nx: number
    Ny: number
    Nz: number
    x0: number
    y0: number
    z0: number
    dx: number
    dy: number
    dz: number
}

const isWorkspaceGridData = (x: any): x is WorkspaceGrid => {
    return validateObject(x, {
        name: isString,
        Nx: isNumber,
        Ny: isNumber,
        Nz: isNumber,
        x0: isNumber,
        y0: isNumber,
        z0: isNumber,
        dx: isNumber,
        dy: isNumber,
        dz: isNumber
    }, {allowAdditionalFields: true})
}

export type WorkspaceSurface = {
    name: string
    vertices: number[][]
    faces: number[][]
}

const isWorkspaceSurfaceData = (x: any): x is WorkspaceSurface => {
    return validateObject(x, {
        name: isString,
        vertices: () => (true),
        faces: () => (true)
    }, {allowAdditionalFields: true})
}

export type WorkspaceGridVectorField = {
    name: string
    gridName: string
    data: number[][][][]
}

const isWorkspaceGridVectorFieldData = (x: any): x is WorkspaceGridVectorField => {
    return validateObject(x, {
        name: isString,
        gridName: isString,
        data: () => (true)
    }, {allowAdditionalFields: true})
}

export type WorkspaceGridScalarField = {
    name: string
    gridName: string
    data: number[][][]
}

const isWorkspaceGridScalarFieldData = (x: any): x is WorkspaceGridScalarField => {
    return validateObject(x, {
        name: isString,
        gridName: isString,
        data: () => (true)
    }, {allowAdditionalFields: true})
}

type WorkspaceGridRegion = {
    name: string
    gridName: string
    data: number[][][]
}

const isWorkspaceGridRegionData = (x: any): x is WorkspaceGridRegion => {
    return validateObject(x, {
        name: isString,
        gridName: isString,
        data: () => (true)
    }, {allowAdditionalFields: true})
}

export type WorkspaceSurfaceVectorField = {
    name: string
    surfaceName: string
    data: number[][]
}

const isWorkspaceSurfaceVectorFieldData = (x: any): x is WorkspaceSurfaceVectorField => {
    return validateObject(x, {
        name: isString,
        surfaceName: isString,
        data: () => (true)
    }, {allowAdditionalFields: true})
}

export type WorkspaceSurfaceScalarField = {
    name: string
    surfaceName: string
    data: number[]
}

const isWorkspaceSurfaceScalarFieldData = (x: any): x is WorkspaceSurfaceScalarField => {
    return validateObject(x, {
        name: isString,
        surfaceName: isString,
        data: () => (true)
    }, {allowAdditionalFields: true})
}

type WorkspaceSurfaceRegion = {
    name: string
    surfaceName: string
    data: number[]
}

const isWorkspaceSurfaceRegionData = (x: any): x is WorkspaceSurfaceRegion => {
    return validateObject(x, {
        name: isString,
        surfaceName: isString,
        data: () => (true)
    }, {allowAdditionalFields: true})
}

export type WorkspaceViewData = {
    type: 'workspace',
    grids: WorkspaceGrid[],
    surfaces: WorkspaceSurface[],
    gridVectorFields: WorkspaceGridVectorField[],
    gridScalarFields: WorkspaceGridScalarField[],
    gridRegions: WorkspaceGridRegion[],
    surfaceVectorFields: WorkspaceSurfaceVectorField[],
    surfaceScalarFields: WorkspaceSurfaceScalarField[],
    surfaceRegions: WorkspaceSurfaceRegion[]
}

type VolumeViewData = {
    type: 'volume'
    dataUri: string
    dataShape: number[]
    componentNames: string[]
} | {
    type: 'vector_field'
    dataUri: string
} | {
    type: 'surface'
    numVertices: number
    numFaces: number
    vertices: number[][]
    faces: number[][]
} | WorkspaceViewData

export const isVolumeViewData = (x: any): x is VolumeViewData => {
    const isVolumeData = (x: any) => {
        return validateObject(x, {
            type: isEqualTo('volume'),
            dataUri: isString,
            dataShape: isArrayOf(isNumber),
            componentNames: isArrayOf(isString)
        }, {allowAdditionalFields: true})
    }
    const isVectorFieldData = (x: any) => {
        return validateObject(x, {
            type: isEqualTo('vector_field'),
            dataUri: isString,
            dataShape: isArrayOf(isNumber)
        }, {allowAdditionalFields: true})
    }
    const isSurfaceData = (x: any) => {
        return validateObject(x, {
            type: isEqualTo('surface'),
            numVertices: isNumber,
            numFaces: isNumber,
            vertices: () => (true),
            faces: () => (true)
        }, {allowAdditionalFields: true})
    }
    const isWorkspaceData = (x: any) => {
        return validateObject(x, {
            type: isEqualTo('workspace'),
            grids: isArrayOf(isWorkspaceGridData),
            surfaces: isArrayOf(isWorkspaceSurfaceData),
            gridVectorFields: isArrayOf(isWorkspaceGridVectorFieldData),
            gridScalarFields: isArrayOf(isWorkspaceGridScalarFieldData),
            gridRegions: isArrayOf(isWorkspaceGridRegionData),
            surfaceVectorFields: isArrayOf(isWorkspaceSurfaceVectorFieldData),
            surfaceScalarFields: isArrayOf(isWorkspaceSurfaceScalarFieldData),
            surfaceRegions: isArrayOf(isWorkspaceSurfaceRegionData)
        }, {allowAdditionalFields: true})
    }
    return isOneOf([isVolumeData, isVectorFieldData, isSurfaceData, isWorkspaceData])(x)
}

export default VolumeViewData