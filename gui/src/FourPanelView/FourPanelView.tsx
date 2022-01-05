import React, { FunctionComponent, useMemo } from 'react';
import { WorkspaceGrid } from 'VolumeViewData';
import { PanelLayoutMode, PlaneViewOpts, Scene3DOpts } from 'WorkspaceView/workspaceViewSelectionReducer';
import PanelMenu from './PanelMenu';
import PlanePanelView from './PlanePanelView/PlanePanelView';
import Scene3DPanelView, { SurfaceData } from './Scene3DPanelView/Scene3DPanelView';

export type Vec3 = [number, number, number]

type Props = {
    grid?: WorkspaceGrid
    focusPosition?: Vec3
    setFocusPosition: (v: Vec3) => void
    scalarData?: number[][][]
    scalarDataRange: [number, number]
    arrowData?: number[][][][]
    arrowDataMax: number
    surfacesData: SurfaceData[]
    surfaceScalarDataRange: [number, number]
    scene3DOpts: Scene3DOpts
    planeViewOpts: PlaneViewOpts
    panelLayoutMode: PanelLayoutMode
    setPanelLayoutMode: (mode: PanelLayoutMode) => void
    onZoom: (direction: number) => void
    width: number
    height: number
}

const FourPanelView: FunctionComponent<Props> = ({grid, focusPosition, setFocusPosition, scalarData, scalarDataRange, arrowData, arrowDataMax, surfacesData, surfaceScalarDataRange, scene3DOpts, planeViewOpts, panelLayoutMode, setPanelLayoutMode, onZoom, width, height}) => {
    const divStyles: {[key: string]: (React.CSSProperties & {width: number, height: number}) | undefined} = useMemo(() => {
        if (panelLayoutMode === '4-panel') {
            const W = width / 2
            const H = height / 2
            return {
                parent: {position: 'absolute', width, height},
                W11: {position: 'absolute', width: W, height: H},
                W12: {position: 'absolute', width: W, height: H, left: W},
                W21: {position: 'absolute', width: W, height: H, top: H},
                W22: {position: 'absolute', width: W, height: H, left: W, top: H}
            }
        }
        else if (panelLayoutMode === '3d-scene') {
            return {
                parent: {position: 'absolute', width, height},
                W11: {position: 'absolute', width, height}
            }
        }
        else if (panelLayoutMode === 'XY') {
            return {
                parent: {position: 'absolute', width, height},
                W12: {position: 'absolute', width, height}
            }
        }
        else if (panelLayoutMode === 'YZ') {
            return {
                parent: {position: 'absolute', width, height},
                W21: {position: 'absolute', width, height}
            }
        }
        else if (panelLayoutMode === 'XZ') {
            return {
                parent: {position: 'absolute', width, height},
                W22: {position: 'absolute', width, height}
            }
        }
        else {
            throw Error('Invalid panel layout mode')
        }
    }, [width, height, panelLayoutMode])

    return (
        <div style={divStyles.parent}>
            <div style={divStyles.W11}>
                {divStyles.W11 && (
                    <Scene3DPanelView
                        width={divStyles.W11.width}
                        height={divStyles.W11.height}
                        surfacesData={surfacesData}
                        surfaceScalarDataRange={surfaceScalarDataRange}
                        grid={grid}
                        focusPosition={focusPosition}
                        scene3DOpts={scene3DOpts}
                    />
                )}
            </div>
            <div style={divStyles.W12}>
                {grid && scalarData && focusPosition && divStyles.W12 && (
                    <PlanePanelView
                        width={divStyles.W12.width}
                        height={divStyles.W12.height}
                        plane="XY"
                        grid={grid}
                        scalarData={scalarData}
                        scalarDataRange={scalarDataRange}
                        arrowData={arrowData}
                        arrowDataMax={arrowDataMax}
                        focusPosition={focusPosition}
                        setFocusPosition={setFocusPosition}
                        planeViewOpts={planeViewOpts}
                        onZoom={onZoom}
                    />
                )}
            </div>
            <div style={divStyles.W21}>
                {grid && scalarData && focusPosition && divStyles.W21 && (
                    <PlanePanelView
                        width={divStyles.W21.width}
                        height={divStyles.W21.height}
                        plane="YZ"
                        grid={grid}
                        scalarData={scalarData}
                        scalarDataRange={scalarDataRange}
                        arrowData={arrowData}
                        arrowDataMax={arrowDataMax}
                        focusPosition={focusPosition}
                        setFocusPosition={setFocusPosition}
                        planeViewOpts={planeViewOpts}
                        onZoom={onZoom}
                    />
                )}
            </div>
            <div style={divStyles.W22}>
                {grid && scalarData && focusPosition && divStyles.W22 && (
                    <PlanePanelView
                        width={divStyles.W22.width}
                        height={divStyles.W22.height}
                        plane="XZ"
                        grid={grid}
                        scalarData={scalarData}
                        scalarDataRange={scalarDataRange}
                        arrowData={arrowData}
                        arrowDataMax={arrowDataMax}
                        focusPosition={focusPosition}
                        setFocusPosition={setFocusPosition}
                        planeViewOpts={planeViewOpts}
                        onZoom={onZoom}
                    />
                )}
            </div>

            {/* Important to set height to zero here so that mouse clicks still go through to the panel */}
            <div style={{...divStyles.W11, height: 0}}>
                {divStyles.W11 && grid && (
                    <PanelMenu
                        panelLayoutMode={panelLayoutMode}
                        setPanelLayoutMode={setPanelLayoutMode}
                        targetPanelLayoutMode="3d-scene"
                    />
                )}
            </div>
            <div style={{...divStyles.W12, height: 0}}>
                {divStyles.W12 && (
                    <PanelMenu
                        panelLayoutMode={panelLayoutMode}
                        setPanelLayoutMode={setPanelLayoutMode}
                        targetPanelLayoutMode="XY"
                    />
                )}
            </div>
            <div style={{...divStyles.W21, height: 0}}>
                {divStyles.W21 && (
                    <PanelMenu
                        panelLayoutMode={panelLayoutMode}
                        setPanelLayoutMode={setPanelLayoutMode}
                        targetPanelLayoutMode="YZ"
                    />
                )}
            </div>
            <div style={{...divStyles.W22, height: 0}}>
                {divStyles.W22 && (
                    <PanelMenu
                        panelLayoutMode={panelLayoutMode}
                        setPanelLayoutMode={setPanelLayoutMode}
                        targetPanelLayoutMode="XZ"
                    />
                )}
            </div>
        </div>
    )
}

export default FourPanelView