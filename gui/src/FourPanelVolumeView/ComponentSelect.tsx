import { Radio } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';

type Props = {
    componentNames: string[]
    componentIndex: number
    setComponentIndex: (c: number) => void
}

const ComponentSelect: FunctionComponent<Props> = ({componentNames, componentIndex, setComponentIndex}) => {
    const handleChange = useCallback((e: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        setComponentIndex(Number(e.target.value))
    }, [setComponentIndex])
    return (
        <div>
            {
                componentNames.map((componentName, ii) => (
                    <span key={ii}><Radio value={ii} checked={componentIndex === ii} onChange={handleChange} /> {componentName}&nbsp;&nbsp;&nbsp;</span>
                ))
            }
        </div>
    )
}

export default ComponentSelect