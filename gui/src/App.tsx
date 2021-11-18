import { getFigureData, useWindowDimensions } from 'figurl';
import React, { useEffect, useState } from 'react';
import VolumeView from './VolumeView';
import VolumeViewData, { isVolumeViewData } from './VolumeViewData';

function App() {
  const [data, setData] = useState<VolumeViewData>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const {width, height} = useWindowDimensions()

  useEffect(() => {
    getFigureData().then((data: any) => {
      if (!isVolumeViewData(data)) {
        setErrorMessage(`Invalid figure data`)
        console.error('Invalid figure data', data)
        return
      }
      setData(data)
    }).catch(err => {
      setErrorMessage(`Error getting figure data`)
      console.error(`Error getting figure data`, err)
    })
  }, [])

  if (errorMessage) {
    return <div style={{color: 'red'}}>{errorMessage}</div>
  }

  if (!data) {
    return <div>Waiting for data</div>
  }

  return (
    <VolumeView
      data={data}
      width={width - 10}
      height={height - 5}
    />
  )
}

export default App;
