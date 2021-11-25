import { Coord3 } from 'FourPanelVolumeView/FourPanelVolumeView';
import { FieldArrowOpts } from 'FourPanelVolumeView/PlaneView/PlaneView';
import VolumeViewControl from 'FourPanelVolumeView/VolumeViewControl';
import React, { FunctionComponent } from 'react';

type Props = {
    volumeData: number[][][][]
    componentNames: string[]
    focusPosition: Coord3
    setFocusPosition: (p: Coord3) => void
    componentIndex: number
    setComponentIndex: (c: number) => void
    scale: number
    setScale: (s: number) => void
    width: number
    height: number
    fieldArrowOpts?: FieldArrowOpts
    setFieldArrowOpts: (o: FieldArrowOpts) => void
}

const LeftPanel: FunctionComponent<Props> = ({volumeData, componentNames, width, height, focusPosition, setFocusPosition, componentIndex, setComponentIndex, scale, setScale, fieldArrowOpts, setFieldArrowOpts}) => {
    return (
        <VolumeViewControl
            volumeData={volumeData}
            componentNames={componentNames}
            componentIndex={componentIndex}
            setComponentIndex={setComponentIndex}
            focusPosition={focusPosition}
            setFocusPosition={setFocusPosition}
            scale={scale}
            setScale={setScale}
            width={width}
            height={height}
            fieldArrowOpts={fieldArrowOpts}
            setFieldArrowOpts={setFieldArrowOpts}
        />
    )
}

export default LeftPanel