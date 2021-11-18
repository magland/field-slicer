import VolumeViewData from 'VolumeViewData';
import FourPanelVolumeView from 'FourPanelVolumeView/FourPanelVolumeView';
import React, { FunctionComponent } from 'react';

type Props = {
    data: VolumeViewData
    width: number
    height: number
}

const VolumeView: FunctionComponent<Props> = ({data, width, height}) => {
    if (data.type === 'volume3d') {
        return (
            <FourPanelVolumeView
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