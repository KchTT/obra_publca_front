import { net_conn } from './utils/conn'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import * as buffer from 'buffer';
(window as any).Buffer = buffer.Buffer;



(async ()=>{
  net_conn().then(resp=>{
   
    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );

    const data = resp ? resp : ""
    root.render(
      <React.StrictMode>
          <App nearConnection={resp?.nearConnection} walletConn={resp?.walletConn} contractObraPublica={resp?.contractObraPublica} currentUser={resp?.currentUser}/>
      </React.StrictMode>
    );
    //conn={resp?.nearConnection} walletConn={resp?.walletConn} contract={resp?.contractObraPublica} currentUser={resp?.currentUser}
    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
  })
})()