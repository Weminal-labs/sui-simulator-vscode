// import { messageHandler } from '@estruyf/vscode/dist/client';
import React from "react";
import {useState} from "react";
import "./style.css";

export interface IAppProps { }

export const App: React.FunctionComponent<IAppProps> = ({ }: React.PropsWithChildren<IAppProps>) => {
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    // const sendMessage = () => {
    //     messageHandler.send('POST_DATA', { msg: 'Hello from the webview' });
    // };

    // const requestData = () => {
    //     messageHandler.request<string>('GET_DATA').then((msg) => {
    //         setMessage(msg);
    //     });
    // };

    // const requestWithErrorData = () => {
    //     messageHandler.request<string>('GET_DATA_ERROR')
    //         .then((msg) => {
    //             setMessage(msg);
    //         })
    //         .catch((err) => {
    //             setError(err);
    //         });
    // };

    return (
        <div className='app'>
            <h1>Hello from the React Webview Starter</h1>

            {/* <div className='app__actions'>
                <button onClick={sendMessage}>
                    Send message to extension
                </button>

                <button onClick={requestData}>
                    Get data from extension
                </button>

                <button onClick={requestWithErrorData}>
                    Get data with error
                </button>
            </div> */}

            {/* {message && <p><strong>Message from the extension</strong>: {message}</p>} */}

            {/* {error && <p className='app__error'><strong>ERROR</strong>: {error}</p>} */}
        </div>
    );
};