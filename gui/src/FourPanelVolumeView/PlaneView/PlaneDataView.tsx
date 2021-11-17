import BaseCanvas from 'FigurlCanvas/BaseCanvas';
import React, { FunctionComponent, useMemo } from 'react';

type Props = {
    planeData: number[][]
    N1: number
    N2: number
    valueRange: [number, number]
    scale: number
}

type PaintProps = {
    imageData: ImageData
    scale: number
}

const paint = (context: CanvasRenderingContext2D, props: PaintProps) => {
    const {imageData, scale} = props

    // Draw scaled version of image
    // See: https://stackoverflow.com/questions/3448347/how-to-scale-an-imagedata-in-html-canvas
    const canvas = document.createElement('canvas')
    canvas.width = imageData.width
    canvas.height = imageData.height
    const c = canvas.getContext('2d')
    if (!c) return
    c.putImageData(imageData, 0, 0)
    context.save()
    context.scale(scale, scale)
    context.drawImage(canvas, 0, 0)
    context.restore()
}

const PlaneDataView: FunctionComponent<Props> = ({planeData, N1, N2, valueRange, scale}) => {
    const imageData = useMemo(() => {
        const imageData = new ImageData(N1, N2)
        let i = 0
        for (let i2=0; i2<N2; i2++) {
            for (let i1=0; i1<N1; i1++) {
                const v = planeData[i1][i2]
                const frac = Math.max(0, Math.min(1, (v - valueRange[0]) / (valueRange[1] - valueRange[0])))
                const a = Math.floor(frac * 255)
                imageData.data[i + 0] = a
                imageData.data[i + 1] = a
                imageData.data[i + 2] = a
                imageData.data[i + 3] = 255
                i += 4
            }
        }
        return imageData
    }, [N1, N2, planeData, valueRange])
    const paintProps = useMemo(() => ({
        imageData, scale
    }), [imageData, scale])
    return (
        <div>
            <BaseCanvas<PaintProps>
                width={N1 * scale}
                height={N2 * scale}
                draw={paint}
                drawData={paintProps}
            />
        </div>
    )
}

export default PlaneDataView