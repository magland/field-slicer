import React, { FunctionComponent } from 'react';
import VolumeViewData from 'VolumeViewData';
import WorkspaceView from 'WorkspaceView/WorkspaceView';

type Props = {
    data: VolumeViewData
    width: number
    height: number
}

const VolumeView: FunctionComponent<Props> = ({data, width, height}) => {
    if (data.type === 'workspace') {
        return (
            <WorkspaceView
                data={data}
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