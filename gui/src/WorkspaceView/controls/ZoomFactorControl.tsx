import Hyperlink from 'components/Hyperlink/Hyperlink';
import React, { FunctionComponent } from 'react';

type Props = {
    value: number
    onZoom: (direction: number) => void
}

const ZoomFactorControl: FunctionComponent<Props> = ({value, onZoom}) => {
    const v = value >= 1 ? `${value}` : (
        `1/${Math.round(1 / value)}`
    )
    return (
        <div>
            <div>
                Zoom factor: {v}
            </div>
            <div style={{userSelect: 'none'}}>
                <Hyperlink onClick={() => onZoom(1)}>Zoom in</Hyperlink>
                &nbsp;&nbsp;
                <Hyperlink onClick={() => onZoom(-1)}>Zoom out</Hyperlink>
            </div>
        </div>
    )
}

type BrightnessProps = {
    value: number
    onBrighten: (direction: number) => void
}

export const BrightnessFactorControl: FunctionComponent<BrightnessProps> = ({value, onBrighten}) => {
    const v = value >= 1 ? `${value}` : (
        `1/${Math.round(1 / value)}`
    )
    return (
        <div>
            <div>
                Brightness factor: {v}
            </div>
            <div style={{userSelect: 'none'}}>
                <Hyperlink onClick={() => onBrighten(1)}>Brighten</Hyperlink>
                &nbsp;&nbsp;
                <Hyperlink onClick={() => onBrighten(-1)}>Darken</Hyperlink>
            </div>
        </div>
    )
}

type ArrowScaleProps = {
    value: number
    onScaleArrows: (direction: number) => void
}

export const ArrowScaleFactorControl: FunctionComponent<ArrowScaleProps> = ({value, onScaleArrows}) => {
    const v = value >= 1 ? `${value}` : (
        `1/${Math.round(1 / value)}`
    )
    return (
        <div>
            <div>
                Arrow scale factor: {v}
            </div>
            <div style={{userSelect: 'none'}}>
                <Hyperlink onClick={() => onScaleArrows(1)}>Lengthen</Hyperlink>
                &nbsp;&nbsp;
                <Hyperlink onClick={() => onScaleArrows(-1)}>Shorten</Hyperlink>
            </div>
        </div>
    )
}

export default ZoomFactorControl