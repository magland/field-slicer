import React, { FunctionComponent, useMemo } from 'react';
import { WorkspaceGrid, WorkspaceSurface } from 'VolumeViewData';
import { ReferencePlaneOpts } from 'WorkspaceView/workspaceViewSelectionReducer';
import PlanePanelView from './PlanePanelView/PlanePanelView';
import Scene3DPanelView from './Scene3DPanelView/Scene3DPanelView';

export type Vec3 = [number, number, number]

type Props = {
    grid?: WorkspaceGrid
    focusPosition?: Vec3
    setFocusPosition: (v: Vec3) => void
    scalarData?: number[][][]
    scalarDataRange: [number, number]
    arrowData?: number[][][][]
    arrowDataMax: number
    surfaces: WorkspaceSurface[]
    referencePlaneOpts: ReferencePlaneOpts
    width: number
    height: number
}

const FourPanelView: FunctionComponent<Props> = ({grid, focusPosition, setFocusPosition, scalarData, scalarDataRange, arrowData, arrowDataMax, surfaces, referencePlaneOpts, width, height}) => {
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

    return (
        <div style={style0}>
            <div style={style1}>
                {grid && focusPosition && (
                    <Scene3DPanelView
                        width={W}
                        height={H}
                        surfaces={surfaces}
                        grid={grid}
                        focusPosition={focusPosition}
                        referencePlaneOpts={referencePlaneOpts}
                    />
                )}
            </div>
            <div style={style2}>
                {grid && scalarData && focusPosition && (
                    <PlanePanelView
                        width={W}
                        height={H}
                        plane="XY"
                        grid={grid}
                        scalarData={scalarData}
                        scalarDataRange={scalarDataRange}
                        arrowData={arrowData}
                        arrowDataMax={arrowDataMax}
                        focusPosition={focusPosition}
                        setFocusPosition={setFocusPosition}
                    />
                )}
            </div>
            <div style={style3}>
                {grid && scalarData && focusPosition && (
                    <PlanePanelView
                        width={W}
                        height={H}
                        plane="YZ"
                        grid={grid}
                        scalarData={scalarData}
                        scalarDataRange={scalarDataRange}
                        arrowData={arrowData}
                        arrowDataMax={arrowDataMax}
                        focusPosition={focusPosition}
                        setFocusPosition={setFocusPosition}
                    />
                )}
            </div>
            <div style={style4}>
                {grid && scalarData && focusPosition && (
                    <PlanePanelView
                        width={W}
                        height={H}
                        plane="XZ"
                        grid={grid}
                        scalarData={scalarData}
                        scalarDataRange={scalarDataRange}
                        arrowData={arrowData}
                        arrowDataMax={arrowDataMax}
                        focusPosition={focusPosition}
                        setFocusPosition={setFocusPosition}
                    />
                )}
            </div>
        </div>
    )
}

export default FourPanelView