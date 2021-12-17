import { Vec3 } from 'FourPanelView/FourPanelView';
import React, { FunctionComponent, useCallback, useMemo, useRef } from 'react';
import { WorkspaceGrid } from 'VolumeViewData';
import { PlaneViewOpts } from 'WorkspaceView/workspaceViewSelectionReducer';
import PlanePanelDataView from './PlanePanelDataView';
import PlanePanelFieldArrowsView from './PlanePanelFieldArrowsView';
import PlanePanelFrameView from './PlanePanelFrameView';

export type PlaneName = 'XY' | 'XZ' | 'YZ'

export type FieldArrow = {
    x: number
    y: number
    dx: number
    dy: number
}

type Props = {
    width: number
    height: number
    plane: PlaneName
    grid: WorkspaceGrid
    scalarData: number[][][]
    scalarDataRange: [number, number]
    arrowData?: number[][][][]
    arrowDataMax: number
    focusPosition: Vec3
    setFocusPosition: (p: Vec3) => void
    planeViewOpts: PlaneViewOpts
    onZoom: (direction: number) => void
}

type DragState = {
    dragging?: boolean
    anchorMousePosition?: [number, number]
    anchorFocusPoint?: [number, number]
}

const PlanePanelView: FunctionComponent<Props> = ({width, height, plane, grid, scalarData, scalarDataRange, arrowData, arrowDataMax, focusPosition, setFocusPosition, planeViewOpts, onZoom}) => {
    const zoomFactor = planeViewOpts.zoomFactor
    const {N1, N2, planeData, focus12, setFocus12, scale1, scale2} = useMemo(() => {
        if (plane === 'XY') {
            const N1 = grid.Nx
            const N2 = grid.Ny
            const N3 = grid.Nz
            const scale1 = grid.dx * zoomFactor
            const scale2 = grid.dy * zoomFactor
            const focus12: [number, number] = [focusPosition[0], focusPosition[1]]
            const setFocus12 = (x: [number, number]) => {
                setFocusPosition([x[0], x[1], focusPosition[2]])
            }
            const planeData = allocateZeros2d(N1, N2)
            if ((0 <= focusPosition[2]) && (focusPosition[2] < N3)) {
                for (let i1 = 0; i1 < N1; i1++) {
                    for (let i2 = 0; i2 < N2; i2++) {
                        planeData[i1][i2] = scalarData[i1][i2][focusPosition[2]]
                    }
                }
            }
            return {N1, N2, planeData, focus12, setFocus12, scale1, scale2}
        }
        else if (plane === 'XZ') {
            const N1 = grid.Nx
            const N2 = grid.Nz
            const N3 = grid.Ny
            const scale1 = grid.dx * zoomFactor
            const scale2 = grid.dz * zoomFactor
            const focus12: [number, number] = [focusPosition[0], focusPosition[2]]
            const setFocus12 = (x: [number, number]) => {
                setFocusPosition([x[0], focusPosition[1], x[1]])
            }
            const planeData = allocateZeros2d(N1, N2)
            if ((0 <= focusPosition[1]) && (focusPosition[1] < N3)) {
                for (let i1 = 0; i1 < N1; i1++) {
                    for (let i2 = 0; i2 < N2; i2++) {
                        planeData[i1][i2] = scalarData[i1][focusPosition[1]][i2]
                    }
                }
            }
            return {N1, N2, planeData, focus12, setFocus12, scale1, scale2}
        }
        else if (plane === 'YZ') {
            const N1 = grid.Ny
            const N2 = grid.Nz
            const N3 = grid.Nx
            const scale1 = grid.dy * zoomFactor
            const scale2 = grid.dz * zoomFactor
            const focus12: [number, number] = [focusPosition[1], focusPosition[2]]
            const setFocus12 = (x: [number, number]) => {
                setFocusPosition([focusPosition[0], x[0], x[1]])
            }
            const planeData = allocateZeros2d(N1, N2)
            if ((0 <= focusPosition[0]) && (focusPosition[0] < N3)) {
                for (let i1 = 0; i1 < N1; i1++) {
                    for (let i2 = 0; i2 < N2; i2++) {
                        planeData[i1][i2] = scalarData[focusPosition[0]][i1][i2]
                    }
                }
            }
            return {N1, N2, planeData, focus12, setFocus12, scale1, scale2}
        }
        else {
            throw Error('Unexpected')
        }
    }, [scalarData, plane, focusPosition, setFocusPosition, grid, zoomFactor])

    const fieldArrows: FieldArrow[] | undefined = useMemo(() => {
        if (!arrowData) return undefined
        const fieldArrows: FieldArrow[] = []
        const stride = planeViewOpts.arrowStride
        const stride2 = Math.floor(stride / 2)
        const arrowScale = 20 / arrowDataMax * zoomFactor // 20 is hard-coded for now
        if (plane === 'XY') {
            if ((0 <= focusPosition[2]) && (focusPosition[2] < grid.Nz)) {
                for (let i = 0; i < grid.Nx; i += stride) {
                    for (let j = (i/stride % 2) === 0 ? 0 : stride2; j < grid.Ny; j += stride) {
                        fieldArrows.push({
                            x: i,
                            y: j,
                            dx: arrowData[0][i][j][focusPosition[2]] * arrowScale,
                            dy: arrowData[1][i][j][focusPosition[2]] * arrowScale
                        })
                    }
                }
            }
        }
        else if (plane === 'XZ') {
            if ((0 <= focusPosition[1]) && (focusPosition[1] < grid.Ny)) {
                for (let i = 0; i < grid.Nx; i += stride) {
                    for (let j = (i/stride % 2) === 0 ? 0 : stride2; j < grid.Nz; j += stride) {
                        fieldArrows.push({
                            x: i,
                            y: j,
                            dx: arrowData[0][i][focusPosition[1]][j] * arrowScale,
                            dy: arrowData[2][i][focusPosition[1]][j] * arrowScale
                        })
                    }
                }
            }
        }
        else if (plane === 'YZ') {
            if ((0 <= focusPosition[0]) && (focusPosition[0] < grid.Nx)) {
                for (let i = 0; i < grid.Ny; i += stride) {
                    for (let j = (i/stride % 2) === 0 ? 0 : stride2; j < grid.Nz; j += stride) {
                        fieldArrows.push({
                            x: i,
                            y: j,
                            dx: arrowData[1][focusPosition[0]][i][j] * arrowScale,
                            dy: arrowData[2][focusPosition[0]][i][j] * arrowScale
                        })
                    }
                }
            }
        }
        return fieldArrows
    }, [plane, grid, focusPosition, arrowData, arrowDataMax, planeViewOpts.arrowStride, zoomFactor])
    
    const margin = 8
    const innerWidth = width - margin * 2
    const innerHeight = height - margin * 2
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
        left: innerWidth / 2 - focus12[0] * scale1,
        top: innerHeight / 2 - (N2 - 1 - focus12[1]) * scale2,
        width: N1 * scale1,
        height: N2 * scale2
    }), [N1, N2, focus12, innerWidth, innerHeight, scale1, scale2])

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
        const dy = -(a[1] - p[1])
        setFocus12([f[0] + Math.floor(dx / scale1), f[1] + Math.floor(dy / scale2)])
    }, [setFocus12, scale1, scale2])
    const handleMouseLeave = useCallback((e: React.MouseEvent) => {
        dragState.current.dragging = false
    }, [])
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        dragState.current.dragging = false
        const element = e.currentTarget
        const x = e.clientX - element.getBoundingClientRect().x
        const y = e.clientY - element.getBoundingClientRect().y
        const x0 = Math.floor(focus12[0] + (x - innerWidth / 2) / scale1)
        const y0 = N2 - 1 - Math.floor((N2 -1 - focus12[1]) + (y - innerHeight / 2) / scale2)
        const p12: [number, number] = [x0, y0]
        setFocus12(p12)
    }, [focus12, setFocus12, innerWidth, innerHeight, N2, scale1, scale2])

    const handleWheel: React.WheelEventHandler<HTMLDivElement> = useCallback((evt) => {
        onZoom(evt.deltaY > 0 ? -1 : 1)
    }, [onZoom])

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
                onWheel={handleWheel}
            >
                
                <div style={childDivStyle}>
                    <PlanePanelDataView
                        N1={N1}
                        N2={N2}
                        scale1={scale1}
                        scale2={scale2}
                        brightnessFactor={planeViewOpts.brightnessFactor}
                        planeData={planeData}
                        planeDataRange={scalarDataRange}
                    />
                </div>
                <PlanePanelFrameView
                    width={innerWidth}
                    height={innerHeight}
                    plane={plane}
                />
                {
                    fieldArrows && (
                        <PlanePanelFieldArrowsView
                            width={innerWidth}
                            height={innerHeight}
                            scale1={scale1}
                            scale2={scale2}
                            focus={focus12}
                            fieldArrows={fieldArrows}
                            arrowScaleFactor={planeViewOpts.arrowScaleFactor}
                        />
                    )
                }
            </div>
        </div>
    )
}

export const allocateZeros4d = (N1: number, N2: number, N3: number, N4: number) => {
    const ret: number[][][][] = []
    for (let i1 = 0; i1 < N1; i1++) {
        ret.push(allocateZeros3d(N2, N3, N4))
    }
    return ret
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

export default PlanePanelView