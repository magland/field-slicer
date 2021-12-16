import BaseCanvas from 'FigurlCanvas/BaseCanvas';
import React, { FunctionComponent } from 'react';
import { FieldArrow } from './PlanePanelView';

type Props = {
    width: number
    height: number
    scale1: number
    scale2: number
    focus: [number, number]
    fieldArrows: FieldArrow[]
    arrowScaleFactor: number
}

const paint = (context: CanvasRenderingContext2D, props: Props) => {
    const {width, height, scale1, scale2, focus, fieldArrows, arrowScaleFactor} = props
    
    context.clearRect(0, 0, width, height)

    const c1 = 0.15
    const c2 = 1.7

    context.strokeStyle = 'yellow'
    context.fillStyle = 'yellow'
    for (let fa of fieldArrows) {
        const x = width / 2 + (fa.x - focus[0]) * scale1
        const y = height / 2 - (fa.y - focus[1]) * scale2
        const dx = fa.dx * arrowScaleFactor
        const dy = - fa.dy * arrowScaleFactor
        const a = -dy
        const b = dx
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(x + dx, y + dy)
        context.stroke()

        const arrowHead = new Path2D()
        arrowHead.moveTo(x + dx, y + dy)
        arrowHead.lineTo(x + dx + c1 * (a - c2 * dx), y + dy + c1 * (b - c2 * dy))
        arrowHead.lineTo(x + dx - c1 * (a + c2 * dx), y + dy - c1 * (b + c2 * dy))
        arrowHead.closePath()
        context.fill(arrowHead)
    }
}

const PlanePanelFieldArrowsView: FunctionComponent<Props> = (props) => {
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

export default PlanePanelFieldArrowsView