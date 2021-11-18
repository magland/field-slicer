import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import Hyperlink from 'components/Hyperlink/Hyperlink';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import ComponentSelect from './ComponentSelect';
import { Coord3 } from './FourPanelVolumeView';
import "./VolumeViewControl.css"

type Props = {
    volumeData: number[][][][]
    componentNames: string[]
    componentIndex: number
    setComponentIndex: (c: number) => void
    focusPosition: Coord3
    setFocusPosition: (p: Coord3) => void
    valueRange: [number, number]
    scale: number
    setScale: (s: number) => void
    width: number
    height: number
}

const VolumeViewControl: FunctionComponent<Props> = ({volumeData, componentNames, componentIndex, setComponentIndex, focusPosition, setFocusPosition, valueRange, scale, setScale, width, height}) => {
    const {Nc, Nx, Ny, Nz} = useMemo(() => {
        return {Nc: volumeData.length, Nx: volumeData[0].length, Ny: volumeData[0][0].length, Nz: volumeData[0][0][0].length}
    }, [volumeData])
    const currentValue = useMemo(() => {
        const c = componentIndex
        const x = focusPosition[0]
        const y = focusPosition[1]
        const z = focusPosition[2]
        if ((c < 0) || (c >= Nc)) return
        if ((x < 0) || (x >= Nx)) return
        if ((y < 0) || (y >= Ny)) return
        if ((z < 0) || (z >= Nz)) return
        return volumeData[c][x][y][z]
    }, [Nc, Nx, Ny, Nz, componentIndex, focusPosition, volumeData])
    const handleScaleUp = useCallback(() => {
        if (scale < 1) {
            const a = Math.round(1 / scale)
            setScale(1 / (a - 1))
        }
        else {
            setScale(scale + 1)
        }
    }, [scale, setScale])
    const handleScaleDown = useCallback(() => {
        if (scale <= 1.5) {
            const a = Math.round(1 / scale)
            setScale(1 / (a + 1))
        }
        else {
            setScale(scale - 1)
        }
    }, [scale, setScale])
    const handleResetPosition = useCallback(() => {
        setFocusPosition([Math.floor(Nx / 2), Math.floor(Ny / 2), Math.floor(Nz / 2)])
    }, [setFocusPosition, Nx, Ny, Nz])
    const divStyle: React.CSSProperties = useMemo(() => ({
        position: 'absolute',
        width,
        height
    }), [width, height])
    return (
        <div className="VolumeViewControl" style={divStyle}>
            <Table className="VolumeViewControlTable">
                <TableBody>
                    <TableRow>
                        <TableCell>Component</TableCell>
                        <TableCell><ComponentSelect componentNames={componentNames} componentIndex={componentIndex} setComponentIndex={setComponentIndex} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Position</TableCell>
                        <TableCell>[{focusPosition.map(a => (`${a}`)).join(', ')}] <span className="noselect"><Hyperlink onClick={handleResetPosition}>reset</Hyperlink></span></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Value</TableCell>
                        <TableCell>{currentValue !== undefined ? currentValue : ''}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Value range</TableCell>
                        <TableCell>{`[${valueRange[0]}, ${valueRange[1]}]`}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Scale</TableCell>
                        <TableCell>{scale} <span className="noselect"><Hyperlink onClick={handleScaleUp}>zoom in</Hyperlink> <Hyperlink onClick={handleScaleDown}>zoom out</Hyperlink></span></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}

export default VolumeViewControl