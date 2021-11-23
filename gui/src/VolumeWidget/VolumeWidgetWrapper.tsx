import { useFileData } from 'figurl/getFileData';
import React, { FunctionComponent } from 'react';
import VolumeWidget from './VolumeWidget';

type Props = {
    dataUri: string
    componentNames: string[]
    width: number
    height: number
}

const VolumeWidgetWrapper: FunctionComponent<Props> = ({dataUri, componentNames, width, height}) => {
    const {fileData: volumeData, errorMessage} = useFileData(dataUri)
    if (!volumeData) {
        if (errorMessage) {
            return <div>Problem loading data: {errorMessage}</div>
        }
        else {
            return <div>Loading data...</div>
        }
    }
    return (
        <VolumeWidget
            volumeData={volumeData}
            componentNames={componentNames}
            width={width}
            height={height}
        />
    )
}

export default VolumeWidgetWrapper