import { useEffect, useState } from "react"
import sendRequestToParent from "./sendRequestToParent"
import { GetFileDataRequest, isGetFileDataResponse } from "./viewInterface/FigurlRequestTypes"
import { Sha1Hash } from "./viewInterface/kacheryTypes"

const getFileData = async (uriOrSha1: string | Sha1Hash) => {
    const sha1 = uriOrSha1.startsWith('sha1://') ? sha1FromUri(uriOrSha1.toString()) : uriOrSha1 as any as Sha1Hash
    const request: GetFileDataRequest = {
        type: 'getFileData',
        sha1
    }
    const response = await sendRequestToParent(request)
    if (!isGetFileDataResponse(response)) throw Error('Invalid response to getFigureData')
    return response.fileData
}

const sha1FromUri = (uri: string) => {
    const a = uri.split('/')[2]
    if (!a) throw Error(`Problem in sha1FromUri: ${uri}`)
    return a as any as Sha1Hash
}

export const useFileData = (uriOrSha1: string | Sha1Hash) => {
    const [fileData, setFileData] = useState<any | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    useEffect(() => {
        setErrorMessage(undefined)
        setFileData(undefined)
        getFileData(uriOrSha1).then(data => {
            setFileData(data)
        }).catch(err => {
            setErrorMessage(err.message)
        })
    }, [uriOrSha1])
    return {fileData, errorMessage}
}

export default getFileData