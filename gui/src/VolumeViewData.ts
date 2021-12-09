import { validateObject } from "figurl"
import { isOneOf } from "figurl/viewInterface/kacheryTypes"
import { isArrayOf, isEqualTo, isNumber, isString } from "figurl/viewInterface/validateObject"

type VolumeViewData = {
    type: 'volume'
    dataUri: string
    dataShape: number[]
    componentNames: string[]
} | {
    type: 'vector_field'
    dataUri: string
    dataShap1: number[]
} | {
    type: 'surface'
    numVertices: number
    numFaces: number
    vertices: number[][]
    faces: number[]
    ifaces: number[]
}

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
            faces: () => (true),
            ifaces: () => (true)
        }, {allowAdditionalFields: true})
    }
    return isOneOf([isVolumeData, isVectorFieldData, isSurfaceData])(x)
}

export default VolumeViewData