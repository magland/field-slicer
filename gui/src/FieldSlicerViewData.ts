import { validateObject } from "figurl"
import { isEqualTo } from "figurl/viewInterface/kacheryTypes"
import { isArrayOf, isString } from "figurl/viewInterface/validateObject"

type FieldSlicerViewData = {
    type: 'volume'
    data: number[][][][]
    channelNames: string[]
}

export const isFieldSlicerViewData = (x: any): x is FieldSlicerViewData => {
    return validateObject(x, {
        type: isEqualTo('volume'),
        data: () => (true),
        channelNames: isArrayOf(isString)
    }, {allowAdditionalFields: true})
}

export default FieldSlicerViewData