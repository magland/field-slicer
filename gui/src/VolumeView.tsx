import React, { FunctionComponent } from 'react';
import Volume3DView from 'Volume3DView/Volume3DView';
import VolumeViewData from 'VolumeViewData';

type Props = {
    data: VolumeViewData
    width: number
    height: number
}

const VolumeView: FunctionComponent<Props> = ({data, width, height}) => {
    if (data.type === 'volume3d') {
        return (
            <Volume3DView
                volumeData={data.data}
                componentNames={data.componentNames}
                width={width}
                height={height}
            />
        )
    }
    else {
        return <div>Unexpected data type: {data.type}</div>
    }
}

export default VolumeView