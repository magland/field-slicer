import FourPanelView, { Vec3 } from 'FourPanelView/FourPanelView';
import { allocateZeros3d } from 'FourPanelView/PlanePanelView/PlanePanelView';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { WorkspaceViewData } from 'VolumeViewData';
import { VectorFieldComponentName, WorkspaceViewSelection, WorkspaceViewSelectionAction } from './workspaceViewSelectionReducer';

type Props = {
    data: WorkspaceViewData
    selection: WorkspaceViewSelection
    selectionDispatch: (a: WorkspaceViewSelectionAction) => void
    width: number
    height: number
}

const findGridScalarFieldByName = (data: WorkspaceViewData, name: string) => {
    return data.gridScalarFields.filter(x => (x.name === name))[0]
}

const findGridVectorFieldByName = (data: WorkspaceViewData, name: string) => {
    return data.gridVectorFields.filter(x => (x.name === name))[0]
}

const extractGridVectorFieldComponent = (data: number[][][][], componentName: VectorFieldComponentName) => {
    const c = componentName === 'X' ? 0 : componentName === 'Y' ? 1 : componentName === 'Z' ? 2 : -1
    
    if (c >= 0) return data[c]

    if (componentName === 'magnitude') {
        const Nx = data[0].length
        const Ny = data[0][0].length
        const Nz = data[0][0][0].length
        const ret = allocateZeros3d(Nx, Ny, Nz)
        for (let ix = 0; ix < Nx; ix++) {
            for (let iy = 0; iy < Ny; iy++) {
                for (let iz = 0; iz < Nz; iz++) {
                    const x0 = data[0][ix][iy][iz]
                    const y0 = data[1][ix][iy][iz]
                    const z0 = data[2][ix][iy][iz]
                    ret[ix][iy][iz] = Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0)
                }
            }
        }
        return ret
    }
    else {
        throw Error('Unexpected component name')
    }
}

const WorkspaceViewMainWindow: FunctionComponent<Props> = ({data, selection, selectionDispatch, width, height}) => {
    const scalarData = useMemo(() => {
        const gs = selection.gridScalar
        if (!gs) return undefined
        if (gs.type === 'scalarField') {
            return findGridScalarFieldByName(data, gs.gridScalarFieldName)?.data
        }
        else if (gs.type === 'vectorFieldComponent') {
            const X = findGridVectorFieldByName(data, gs.gridVectorFieldName)?.data
            if (!X) return undefined
            return extractGridVectorFieldComponent(X, gs.componentName)
        }
    }, [data, selection.gridScalar])
    const {vMin, vMax} = useMemo(() => {
        if (!scalarData) return {vMin: 0, vMax: 1}
        const Nx = scalarData.length
        const Ny = scalarData[0].length
        const Nz = scalarData[0][0].length
        let vMin = scalarData[0][0][0]
        let vMax = scalarData[0][0][0]
        for (let i1=0; i1<Nx; i1++) {
            for (let i2=0; i2<Ny; i2++) {
                for (let i3=0; i3<Nz; i3++) {
                    vMin = Math.min(vMin, scalarData[i1][i2][i3])
                    vMax = Math.max(vMax, scalarData[i1][i2][i3])
                }
            }
        }
        return {vMin, vMax}
    }, [scalarData])
    const scalarDataRange: [number, number] = useMemo(() => ([vMin, vMax]), [vMin, vMax])

    const arrowData = useMemo(() => {
        const name = selection.gridArrowVectorFieldName
        if (!name) return undefined
        return findGridVectorFieldByName(data, name)?.data
    }, [data, selection.gridArrowVectorFieldName])
    const {aMax} = useMemo(() => {
        if (!arrowData) return {aMax: 1}
        const Nx = arrowData[0].length
        const Ny = arrowData[0][0].length
        const Nz = arrowData[0][0][0].length
        let aMax = 0
        for (let i1=0; i1<Nx; i1++) {
            for (let i2=0; i2<Ny; i2++) {
                for (let i3=0; i3<Nz; i3++) {
                    const x0 = arrowData[0][i1][i2][i3]
                    const y0 = arrowData[1][i1][i2][i3]
                    const z0 = arrowData[2][i1][i2][i3]
                    const v = Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0)
                    aMax = Math.max(aMax, v)
                }
            }
        }
        return {aMax}
    }, [arrowData])
    const arrowDataMax = aMax
    
    const setFocusPosition = useCallback((p: Vec3) => {
        selectionDispatch({
            type: 'setFocusPosition',
            focusPosition: p
        })
    }, [selectionDispatch])

    const grid = useMemo(() => {
        if (!selection.gridName) return undefined
        return data.grids.filter(x => (x.name === selection.gridName))[0]
    }, [selection.gridName, data.grids])

    return (
        <FourPanelView
            width={width}
            height={height}
            grid={grid}
            focusPosition={selection.focusPosition}
            scalarData={scalarData}
            scalarDataRange={scalarDataRange}
            arrowData={arrowData}
            arrowDataMax={arrowDataMax}
            setFocusPosition={setFocusPosition}
        />
    )
}

export default WorkspaceViewMainWindow