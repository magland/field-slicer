import { Coord3 } from 'FourPanelVolumeView/FourPanelVolumeView';
import React, { FunctionComponent, useCallback, useMemo, useRef } from 'react';
import PlaneDataView from './PlaneDataView';
import PlaneFrameView from './PlaneFrameView';

type Plane = 'XY' | 'XZ' | 'YZ'

type Props = {
    volumeData: number[][][][]
    componentIndex: number
    plane: Plane
    focusPosition: Coord3
    setFocusPosition: (p: Coord3) => void
    valueRange: [number, number]
    width: number
    height: number
    scale: number
}

type DragState = {
    dragging?: boolean
    anchorMousePosition?: [number, number]
    anchorFocusPoint?: [number, number]
}

const PlaneView: FunctionComponent<Props> = ({volumeData, componentIndex, plane, focusPosition, setFocusPosition, valueRange, width, height, scale}) => {
    const {Nx, Ny, Nz} = useMemo(() => {
        return {Nx: volumeData[0].length, Ny: volumeData[0][0].length, Nz: volumeData[0][0][0].length}
    }, [volumeData])
    const margin = 8
    const innerWidth = width - margin * 2
    const innerHeight = height - margin * 2
    const {N1, N2, planeData, focus12, setFocus12} = useMemo(() => {
        const c = componentIndex
        if (plane === 'XY') {
            const N1 = Nx
            const N2 = Ny
            const N3 = Nz
            const focus12: [number, number] = [focusPosition[0], focusPosition[1]]
            const setFocus12 = (x: [number, number]) => {
                setFocusPosition([x[0], x[1], focusPosition[2]])
            }
            const planeData = allocateZeros2d(N1, N2)
            if ((0 <= focusPosition[2]) && (focusPosition[2] < N3)) {
                for (let i1 = 0; i1 < N1; i1++) {
                    for (let i2 = 0; i2 < N2; i2++) {
                        planeData[i1][i2] = volumeData[c][i1][i2][focusPosition[2]]
                    }
                }
            }
            return {N1, N2, planeData, focus12, setFocus12}
        }
        else if (plane === 'XZ') {
            const N1 = Nx
            const N2 = Nz
            const N3 = Ny
            const focus12: [number, number] = [focusPosition[0], focusPosition[2]]
            const setFocus12 = (x: [number, number]) => {
                setFocusPosition([x[0], focusPosition[1], x[1]])
            }
            const planeData = allocateZeros2d(N1, N2)
            if ((0 <= focusPosition[1]) && (focusPosition[1] < N3)) {
                for (let i1 = 0; i1 < N1; i1++) {
                    for (let i2 = 0; i2 < N2; i2++) {
                        planeData[i1][i2] = volumeData[c][i1][focusPosition[1]][i2]
                    }
                }
            }
            return {N1, N2, planeData, focus12, setFocus12}
        }
        else if (plane === 'YZ') {
            const N1 = Ny
            const N2 = Nz
            const N3 = Nx
            const focus12: [number, number] = [focusPosition[1], focusPosition[2]]
            const setFocus12 = (x: [number, number]) => {
                setFocusPosition([focusPosition[0], x[0], x[1]])
            }
            const planeData = allocateZeros2d(N1, N2)
            if ((0 <= focusPosition[0]) && (focusPosition[0] < N3)) {
                for (let i1 = 0; i1 < N1; i1++) {
                    for (let i2 = 0; i2 < N2; i2++) {
                        planeData[i1][i2] = volumeData[c][focusPosition[0]][i1][i2]
                    }
                }
            }
            return {N1, N2, planeData, focus12, setFocus12}
        }
        else {
            throw Error('Unexpected')
        }
    }, [volumeData, componentIndex, plane, focusPosition, setFocusPosition, Nx, Ny, Nz])
    const outerParentDivStyle: React.CSSProperties = useMemo(() => ({
        position: 'absolute',
        width,
        height,
        overflow: 'hidden',
        background: 'black'
    }), [width, height])
    const innerParentDivStyle: React.CSSProperties = useMemo(() => ({
        position: 'absolute',
        left: margin,
        top: margin,
        width: innerWidth,
        height: innerHeight,
        overflow: 'hidden',
        background: 'rgb(50,50,70)'
    }), [innerWidth, innerHeight])
    const childDivStyle: React.CSSProperties = useMemo(() => ({
        position: 'absolute',
        left: innerWidth / 2 - focus12[0] * scale,
        top: innerHeight / 2 - focus12[1] * scale,
        width: N1 * scale,
        height: N2 * scale
    }), [N1, N2, focus12, innerWidth, innerHeight, scale])

    const dragState = useRef<DragState>({})

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        dragState.current.dragging = true
        dragState.current.anchorMousePosition = [e.clientX, e.clientY]
        dragState.current.anchorFocusPoint = focus12
    }, [focus12])
    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        dragState.current.dragging = false
    }, [])
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!dragState.current.dragging) return
        const a = dragState.current.anchorMousePosition
        if (!a) return
        const f = dragState.current.anchorFocusPoint
        if (!f) return
        const p = [e.clientX, e.clientY]
        const dx = a[0] - p[0]
        const dy = a[1] - p[1]
        setFocus12([f[0] + Math.floor(dx / scale), f[1] + Math.floor(dy / scale)])
    }, [setFocus12, scale])
    const handleMouseLeave = useCallback((e: React.MouseEvent) => {
        dragState.current.dragging = false
    }, [])
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        dragState.current.dragging = false
        const element = e.currentTarget
        const x = e.clientX - element.getBoundingClientRect().x
        const y = e.clientY - element.getBoundingClientRect().y
        const p12: [number, number] = [Math.floor(focus12[0] + (x - innerWidth / 2) / scale), Math.floor(focus12[1] + (y - innerHeight / 2) / scale)]
        setFocus12(p12)
    }, [focus12, setFocus12, scale, innerWidth, innerHeight])

    return (
        <div
            style={outerParentDivStyle}
        >
            <div
                style={innerParentDivStyle}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onDoubleClick={handleDoubleClick}
            >
                
                <div style={childDivStyle}>
                    <PlaneDataView
                        N1={N1}
                        N2={N2}
                        scale={scale}
                        planeData={planeData}
                        valueRange={valueRange}
                    />
                </div>
                <PlaneFrameView
                    width={innerWidth}
                    height={innerHeight}
                />
            </div>
        </div>
    )
}

export const allocateZeros3d = (N1: number, N2: number, N3: number) => {
    const ret: number[][][] = []
    for (let i1 = 0; i1 < N1; i1++) {
        ret.push(allocateZeros2d(N2, N3))
    }
    return ret
}

export const allocateZeros2d = (N1: number, N2: number) => {
    const ret: number[][] = []
    for (let i1 = 0; i1 < N1; i1++) {
        ret.push(allocateZeros1d(N2))
    }
    return ret
}

export const allocateZeros1d = (N: number) => {
    const ret: number[] = []
    for (let i = 0; i < N; i++) ret.push(0)
    return ret
}

export default PlaneView