import { TextField } from '@material-ui/core';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { FieldArrowOpts } from './PlaneView/PlaneView';

type Props = {
    fieldArrowOpts: FieldArrowOpts
    setFieldArrowOpts: (o: FieldArrowOpts) => void
}

const FieldArrowsScaleControl: FunctionComponent<Props> = ({fieldArrowOpts, setFieldArrowOpts}) => {
    const [value, setValue] = useState<string>('')
    const handleChange = useCallback((e: React.ChangeEvent<{
        value: string;
    }>) => {
        const v = Number(e.target.value)
        if (v > 0) {
            setFieldArrowOpts({...fieldArrowOpts, scale: v})
        }
        setValue(e.target.value)
    }, [setFieldArrowOpts, fieldArrowOpts])
    useEffect(() => {
        setValue(`${fieldArrowOpts.scale}`)
    }, [fieldArrowOpts.scale])
    return (
        <div>
            <TextField disabled={!fieldArrowOpts.show} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} label="Scale" value={value} onChange={handleChange} />
        </div>
    )
}

export default FieldArrowsScaleControl