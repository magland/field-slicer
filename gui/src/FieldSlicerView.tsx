import FieldSlicerViewData from 'FieldSlicerViewData';
import FourPanelVolumeView from 'FourPanelVolumeView/FourPanelVolumeView';
import React, { FunctionComponent } from 'react';

type Props = {
    data: FieldSlicerViewData
    width: number
    height: number
}

const FieldSlicerView: FunctionComponent<Props> = ({data, width, height}) => {
    if (data.type === 'volume') {
        return (
            <FourPanelVolumeView
                volumeData={data.data}
                channelNames={data.channelNames}
                width={width}
                height={height}
            />
        )
    }
    else {
        return <div>Unexpected data type: {data.type}</div>
    }
}

export default FieldSlicerView