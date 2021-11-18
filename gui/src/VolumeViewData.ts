import { validateObject } from "figurl"
import { isEqualTo } from "figurl/viewInterface/kacheryTypes"
import { isArrayOf, isString } from "figurl/viewInterface/validateObject"

type VolumeViewData = {
    type: 'volume3d'
    data: number[][][][]
    componentNames: string[]
}

export const isVolumeViewData = (x: any): x is VolumeViewData => {
    return validateObject(x, {
        type: isEqualTo('volume3d'),
        data: () => (true),
        componentNames: isArrayOf(isString)
    }, {allowAdditionalFields: true})
}

export default VolumeViewData