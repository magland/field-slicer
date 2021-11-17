import BaseCanvas from 'FigurlCanvas/BaseCanvas';
import React, { FunctionComponent, useMemo } from 'react';

type Props = {
    width: number
    height: number
}

type PaintProps = {
    width: number
    height: number
}

const paint = (context: CanvasRenderingContext2D, props: PaintProps) => {
    const {width, height} = props
    context.fillStyle = 'rgb(215, 215, 245)'
    context.fillRect(0, 0, width, height)

    context.strokeStyle = 'blue'
    drawLine(context, width / 2, 0, width / 2, height)
    drawLine(context, 0, height / 2, width, height / 2)
}

const PlaneFrameView: FunctionComponent<Props> = ({width, height}) => {
    const paintProps = useMemo(() => ({width, height}), [width, height])
    return (
        <div>
            <BaseCanvas<PaintProps>
                width={width}
                height={height}
                draw={paint}
                drawData={paintProps}
            />
        </div>
    )
}

const drawLine = (context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.stroke()
}

export default PlaneFrameView