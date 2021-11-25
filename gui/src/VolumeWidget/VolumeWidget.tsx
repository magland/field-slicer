import Splitter from 'components/Splitter/Splitter';
import FourPanelVolumeView, { Coord3 } from 'FourPanelVolumeView/FourPanelVolumeView';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import LeftPanel from './LeftPanel';

type Props = {
    volumeData: number[][][][]
    componentNames: string[]
    width: number
    height: number
}

const VolumeWidget: FunctionComponent<Props> = ({volumeData, componentNames, width, height}) => {
    const {Nx, Ny, Nz} = useMemo(() => {
        return {Nx: volumeData[0].length, Ny: volumeData[0][0].length, Nz: volumeData[0][0][0].length}
    }, [volumeData])
    const [focusPosition, setFocusPosition] = useState<Coord3>([0, 0, 0])
    const [componentIndex, setComponentIndex] = useState<number>(0)
    const [scale, setScale] = useState<number>(4)
    useEffect(() => {
        setFocusPosition([Math.floor(Nx / 2), Math.floor(Ny / 2), Math.floor(Nz / 2)])
    }, [Nx, Ny, Nz])
    return (
        <Splitter
            width={width}
            height={height}
            initialPosition={360}
        >
            <LeftPanel
                volumeData={volumeData}
                componentNames={componentNames}
                focusPosition={focusPosition}
                setFocusPosition={setFocusPosition}
                componentIndex={componentIndex}
                setComponentIndex={setComponentIndex}
                scale={scale}
                setScale={setScale}
                width={0} // filled in by splitter
                height={0} // filled in by splitter
            />
            <FourPanelVolumeView
                volumeData={volumeData}
                componentNames={componentNames}
                focusPosition={focusPosition}
                setFocusPosition={setFocusPosition}
                componentIndex={componentIndex}
                setComponentIndex={setComponentIndex}
                scale={scale}
                setScale={setScale}
                width={0} // filled in by splitter
                height={0} // filled in by splitter
            />
        </Splitter>
    )
}

export default VolumeWidget