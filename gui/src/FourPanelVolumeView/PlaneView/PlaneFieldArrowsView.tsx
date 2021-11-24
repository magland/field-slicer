import BaseCanvas from 'FigurlCanvas/BaseCanvas';
import React, { FunctionComponent } from 'react';
import { FieldArrow } from './PlaneView';

type Props = {
    width: number
    height: number
    scale: number
    focus: [number, number]
    fieldArrows: FieldArrow[]
}

const paint = (context: CanvasRenderingContext2D, props: Props) => {
    const {width, height, scale, focus, fieldArrows} = props
    
    context.clearRect(0, 0, width, height)

    const c1 = 0.15
    const c2 = 2.5

    context.strokeStyle = 'yellow'
    context.beginPath()
    for (let fa of fieldArrows) {
        const x = width / 2 + (fa.x - focus[0]) * scale
        const y = height / 2 - (fa.y - focus[1]) * scale
        const dx = fa.dx * scale
        const dy = - fa.dy * scale
        const a = -dy
        const b = dx
        context.moveTo(x, y)
        context.lineTo(x + dx, y + dy)
        context.lineTo(x + dx + c1 * (a - c2 * dx), y + dy + c1 * (b - c2 * dy))
        context.moveTo(x + dx, y + dy)
        context.lineTo(x + dx - c1 * (a + c2 * dx), y + dy - c1 * (b + c2 * dy))
    }
    context.stroke()
}

const PlaneFieldArrowsView: FunctionComponent<Props> = (props) => {
    const {width, height} = props
    return (
        <div>
            <BaseCanvas<Props>
                width={width}
                height={height}
                draw={paint}
                drawData={props}
            />
        </div>
    )
}

export default PlaneFieldArrowsView