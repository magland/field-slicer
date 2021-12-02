import { handleTaskStatusUpdate } from "./initiateTask"
import { handleNewSubfeedMessages } from "./subfeedManager"
import { FigurlResponseMessage, isMessageToChild } from "./viewInterface/MessageToChildTypes"
import { handleFigurlResponse } from "./sendRequestToParent"
import { handleSetCurrentUser } from "./useSignedIn"
import { isMessageToParent } from "./viewInterface/MessageToParentTypes"
import { GetFigureDataResponse, GetFileDataResponse } from "./viewInterface/FigurlRequestTypes"
import { sleepMsecNum } from "./util/sleepMsec"

const urlSearchParams = new URLSearchParams(window.location.search)
const queryParams = Object.fromEntries(urlSearchParams.entries())

if (!queryParams.parentOrigin) {
    // self-contained bundle
    const s = document.createElement("script");
    s.setAttribute("src", "figurlData.js");
    document.body.appendChild(s);
}

const waitForFigurlData = async () => {
    while (true) {
        if ((window as any).figurlData) return
        await sleepMsecNum(200)
    }
}

const startListeningToParent = () => {
    window.addEventListener('message', e => {
        const msg = e.data
        if (isMessageToChild(msg)) {
            if (msg.type === 'figurlResponse') {
                handleFigurlResponse(msg)
            }
            else if (msg.type === 'taskStatusUpdate') {
                handleTaskStatusUpdate(msg)
            }
            else if (msg.type === 'newSubfeedMessages') {
                handleNewSubfeedMessages(msg)
            }
            else if (msg.type === 'setCurrentUser') {
                handleSetCurrentUser({userId: msg.userId, googleIdToken: msg.googleIdToken})
            }
        }
        else if (isMessageToParent(msg)) {
            // this is relevant for standalone (self-contained) figures
            if (queryParams.parentOrigin) {
                console.warn('Got message to parent even though parentOrigin is defined')
                return
            }
            waitForFigurlData().then(() => {
                if (msg.type === 'figurlRequest') {
                    const req = msg.request
                    if (req.type === 'getFigureData') {
                        const figureData = (window as any).figurlData.figure
                        const resp: GetFigureDataResponse = {
                            type: 'getFigureData',
                            figureData
                        }
                        const msg2: FigurlResponseMessage = {
                            type: 'figurlResponse',
                            requestId: msg.requestId,
                            response: resp
                        }
                        window.postMessage(msg2, '*')
                    }
                    else if (req.type === 'getFileData') {
                        const fileData = (window as any).figurlData.sha1[req.sha1.toString()]
                        const resp: GetFileDataResponse = {
                            type: 'getFileData',
                            fileData
                        }
                        const msg2: FigurlResponseMessage = {
                            type: 'figurlResponse',
                            requestId: msg.requestId,
                            response: resp
                        }
                        window.postMessage(msg2, '*')
                    }
                    else if (req.type === 'initiateTask') {
                        console.warn(`Unable to handle request of type ${req.type} for self-contained figures`)
                    }
                    else if (req.type === 'subscribeToSubfeed') {
                        console.warn(`Unable to handle request of type ${req.type} for self-contained figures`)
                    }
                }
            })
        }
        else {
            console.log('Unhandled message', e)
        }
    })
}

export default startListeningToParent