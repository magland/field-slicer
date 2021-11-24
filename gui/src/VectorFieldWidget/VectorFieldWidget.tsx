import Splitter from 'components/Splitter/Splitter';
import FourPanelVolumeView, { Coord3 } from 'FourPanelVolumeView/FourPanelVolumeView';
import { allocateZeros4d } from 'FourPanelVolumeView/PlaneView/PlaneView';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import LeftPanel from './LeftPanel';

type Props = {
    volumeData: number[][][][]
    width: number
    height: number
}

const VectorFieldWidget: FunctionComponent<Props> = ({volumeData, width, height}) => {
    const {Nx, Ny, Nz} = useMemo(() => {
        return {Nx: volumeData[0].length, Ny: volumeData[0][0].length, Nz: volumeData[0][0][0].length}
    }, [volumeData])
    const [focusPosition, setFocusPosition] = useState<Coord3>([0, 0, 0])
    const [componentIndex, setComponentIndex] = useState<number>(0)
    const [scale, setScale] = useState<number>(4)
    useEffect(() => {
        setFocusPosition([Math.floor(Nx / 2), Math.floor(Ny / 2), Math.floor(Nz / 2)])
    }, [Nx, Ny, Nz])
    const volumeData2 = useMemo(() => {
        const X = allocateZeros4d(4, Nx, Ny, Nz)
        for (let x=0; x<Nx; x++) {
            for (let y=0; y<Ny; y++) {
                for (let z=0; z<Nz; z++) {
                    const a1 = volumeData[0][x][y][z]
                    const a2 = volumeData[1][x][y][z]
                    const a3 = volumeData[2][x][y][z]
                    X[0][x][y][z] = a1
                    X[1][x][y][z] = a2
                    X[2][x][y][z] = a3
                    X[3][x][y][z] = Math.sqrt(a1 * a1 + a2 * a2 + a3 * a3)
                }
            }
        }
        return X
    }, [volumeData, Nx, Ny, Nz])
    const componentNames = useMemo(() => (['x', 'y', 'z', 'norm']), [])

    return (
        <Splitter
            width={width}
            height={height}
            initialPosition={360}
        >
            <LeftPanel
                volumeData={volumeData2}
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
                volumeData={volumeData2}
                componentNames={componentNames}
                focusPosition={focusPosition}
                setFocusPosition={setFocusPosition}
                componentIndex={componentIndex}
                setComponentIndex={setComponentIndex}
                scale={scale}
                setScale={setScale}
                width={0} // filled in by splitter
                height={0} // filled in by splitter
                showFieldArrows={true}
            />
        </Splitter>
    )
}

export default VectorFieldWidget