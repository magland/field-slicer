import { Checkbox } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import { FieldArrowOpts } from './PlaneView/PlaneView';

type Props = {
    fieldArrowOpts: FieldArrowOpts
    setFieldArrowOpts: (o: FieldArrowOpts) => void
}

const FieldArrowsShowControl: FunctionComponent<Props> = ({fieldArrowOpts, setFieldArrowOpts}) => {
    const handleClick = useCallback(() => {
        setFieldArrowOpts({...fieldArrowOpts, show: !fieldArrowOpts.show})
    }, [fieldArrowOpts, setFieldArrowOpts])
    return (
        <div>
            <Checkbox checked={fieldArrowOpts.show} onClick={handleClick} /> Show field arrows
        </div>
    )
}

export default FieldArrowsShowControl