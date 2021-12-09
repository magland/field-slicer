import React, { FunctionComponent } from 'react';
import SurfaceWidget from 'SurfaceWidget/SurfaceWidget';
import VectorFieldWidgetWrapper from 'VectorFieldWidget/VectorFieldWidgetWrapper';
import VolumeViewData from 'VolumeViewData';
import VolumeWidgetWrapper from 'VolumeWidget/VolumeWidgetWrapper';

type Props = {
    data: VolumeViewData
    width: number
    height: number
}

const VolumeView: FunctionComponent<Props> = ({data, width, height}) => {
    if (data.type === 'volume') {
        return (
            <VolumeWidgetWrapper
                dataUri={data.dataUri}
                componentNames={data.componentNames}
                width={width}
                height={height}
            />
        )
    }
    else if (data.type === 'vector_field') {
        return (
            <VectorFieldWidgetWrapper
                dataUri={data.dataUri}
                width={width}
                height={height}
            />
        )
    }
    else if (data.type === 'surface') {
        return (
            <SurfaceWidget
                vertices={data.vertices}
                faces={data.faces}
                width={width}
                height={height}
            />
        )
    }
    else {
        return <div>Unexpected data type</div>
    }
}

export default VolumeView