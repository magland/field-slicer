import { MenuItem, Select } from '@material-ui/core';
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
        setComponentIndex(e.target.value as number)
    }, [setComponentIndex])
    return (
        <Select
            value={componentIndex}
            onChange={handleChange}
        >
            {
                componentNames.map((componentName, ii) => (
                    <MenuItem value={ii}>{componentName}</MenuItem>
                ))
            }
        </Select>
    )
}

export default ComponentSelect