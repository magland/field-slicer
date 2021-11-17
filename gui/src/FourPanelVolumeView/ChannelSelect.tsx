import { MenuItem, Select } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';

type Props = {
    channelNames: string[]
    channelIndex: number
    setChannelIndex: (c: number) => void
}

const ChannelSelect: FunctionComponent<Props> = ({channelNames, channelIndex, setChannelIndex}) => {
    const handleChange = useCallback((e: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        setChannelIndex(e.target.value as number)
    }, [setChannelIndex])
    return (
        <Select
            value={channelIndex}
            onChange={handleChange}
        >
            {
                channelNames.map((channelName, ii) => (
                    <MenuItem value={ii}>{channelName}</MenuItem>
                ))
            }
        </Select>
    )
}

export default ChannelSelect