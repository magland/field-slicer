import { useFileData } from 'figurl/getFileData';
import React, { FunctionComponent } from 'react';
import VectorFieldWidget from './VectorFieldWidget';

type Props = {
    dataUri: string
    width: number
    height: number
}

const VectorFieldWidgetWrapper: FunctionComponent<Props> = ({dataUri, width, height}) => {
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
        <VectorFieldWidget
            volumeData={volumeData}
            width={width}
            height={height}
        />
    )
}

export default VectorFieldWidgetWrapper