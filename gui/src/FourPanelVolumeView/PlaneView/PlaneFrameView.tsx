import BaseCanvas from 'FigurlCanvas/BaseCanvas';
import React, { FunctionComponent, useMemo } from 'react';
import { Plane } from './PlaneView';

type Props = {
    width: number
    height: number
    plane: Plane
}

type PaintProps = {
    width: number
    height: number
    plane: Plane
}

const paint = (context: CanvasRenderingContext2D, props: PaintProps) => {
    const {width, height, plane} = props
    // context.fillStyle = 'rgb(215, 215, 245)'
    // context.fillRect(0, 0, width, height)

    context.clearRect(0, 0, width, height)

    context.strokeStyle = colorFromDirection(plane[0])
    drawLine(context, width / 2, height / 2, width, height / 2)
    
    context.strokeStyle = colorFromDirection(plane[1])
    drawLine(context, width / 2, height / 2, width / 2, 0)
}

const colorFromDirection = (a: string) => {
    if (a === 'X') return 'red'
    else if (a === 'Y') return 'green'
    else if (a === 'Z') return 'blue'
    return 'white'
}

const planeLabelStyle: React.CSSProperties = {
    color: 'lightgray',
    padding: 15,
    fontSize: 25,
    userSelect: 'none'
}

const PlaneFrameView: FunctionComponent<Props> = ({width, height, plane}) => {
    const paintProps = useMemo(() => ({width, height, plane}), [width, height, plane])
    return (
        <div>
            <div style={planeLabelStyle}>{plane}</div>
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