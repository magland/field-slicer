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

export default ZoomFactorControl