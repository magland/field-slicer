import React, { FunctionComponent, useMemo, useState } from 'react';
import PlaneView, { FieldArrowOpts } from './PlaneView/PlaneView';
import Volume3DScene from './Volume3DScene';

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
    showFieldArrows: boolean
}

export type Coord3 = [number, number, number]

const FourPanelVolumeView: FunctionComponent<Props> = ({volumeData, componentNames, width, height, focusPosition, setFocusPosition, componentIndex, setComponentIndex, scale, setScale, showFieldArrows}) => {
    const W = width / 2
    const H = height / 2
    const style0: React.CSSProperties = useMemo(() => ({
        position: 'absolute', width, height
    }), [width, height])
    const style1: React.CSSProperties = useMemo(() => ({
        position: 'absolute', width: W, height: H
    }), [W, H])
    const style2: React.CSSProperties = useMemo(() => ({
        position: 'absolute', width: W, height: H, left: W,
    }), [W, H])
    const style3: React.CSSProperties = useMemo(() => ({
        position: 'absolute', width: W, height: H, top: H
    }), [W, H])
    const style4: React.CSSProperties = useMemo(() => ({
        position: 'absolute', width: W, height: H, left: W, top: H
    }), [W, H])
    
    const {Nc, Nx, Ny, Nz} = useMemo(() => {
        return {Nc: volumeData.length, Nx: volumeData[0].length, Ny: volumeData[0][0].length, Nz: volumeData[0][0][0].length}
    }, [volumeData])
    
    const {vMin, vMax} = useMemo(() => {
        let vMin = volumeData[0][0][0][0]
        let vMax = volumeData[0][0][0][0]
        for (let c=0; c<Nc; c++) {
            for (let i1=0; i1<Nx; i1++) {
                for (let i2=0; i2<Ny; i2++) {
                    for (let i3=0; i3<Nz; i3++) {
                        vMin = Math.min(vMin, volumeData[c][i1][i2][i3])
                        vMax = Math.max(vMax, volumeData[c][i1][i2][i3])
                    }
                }
            }
        }
        return {vMin, vMax}
    }, [volumeData, Nc, Nx, Ny, Nz])
    const valueRange: [number, number] = useMemo(() => ([vMin, vMax]), [vMin, vMax])

    const [fieldArrowOpts, setFieldArrowOpts] = useState<FieldArrowOpts>({stride: 4, scale: 3})

    return (
        <div style={style0}>
            <div style={style1}>
                <Volume3DScene
                    volumeData={volumeData}
                    componentNames={componentNames}
                    componentIndex={componentIndex}
                    setComponentIndex={setComponentIndex}
                    focusPosition={focusPosition}
                    setFocusPosition={setFocusPosition}
                    scale={scale}
                    setScale={setScale}
                    width={W}
                    height={H}
                />
            </div>
            <div style={style2}>
                <PlaneView
                    volumeData={volumeData}
                    componentIndex={componentIndex}
                    plane="XY"
                    focusPosition={focusPosition}
                    setFocusPosition={setFocusPosition}
                    valueRange={valueRange}
                    width={W}
                    height={H}
                    scale={scale}
                    fieldArrowOpts={showFieldArrows ? fieldArrowOpts : undefined}
                />
            </div>
            <div style={style3}>
                <PlaneView
                    volumeData={volumeData}
                    componentIndex={componentIndex}
                    plane="YZ"
                    focusPosition={focusPosition}
                    setFocusPosition={setFocusPosition}
                    valueRange={valueRange}
                    width={W}
                    height={H}
                    scale={scale}
                    fieldArrowOpts={showFieldArrows ? fieldArrowOpts : undefined}
                />
            </div>
            <div style={style4}>
                <PlaneView
                    volumeData={volumeData}
                    componentIndex={componentIndex}
                    plane="XZ"
                    focusPosition={focusPosition}
                    setFocusPosition={setFocusPosition}
                    valueRange={valueRange}
                    width={W}
                    height={H}
                    scale={scale}
                    fieldArrowOpts={showFieldArrows ? fieldArrowOpts : undefined}
                />
            </div>
        </div>
    )
}

export default FourPanelVolumeView