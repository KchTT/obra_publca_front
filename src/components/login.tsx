import React, { useEffect, useState, useContext } from 'react';
import { ContextData } from "./App";

const Login = (props: any) => {
    const contexto = useContext(ContextData)
    const login = () => {
        contexto.walletConn.requestSignIn(process.env.REACT_APP_CONTRACT)
    }
    return <div className='d-flex justify-content-center align-items-center' style={{minHeight:"80vh"}}>
        <div className="card">
            <div className="card-body">
                <h5 className='m-0'>Bienvenido!</h5>
                <h1>Smart Contract<span style={{color:"#FF0000"}}>or</span></h1>
                <p>Haciendo la obra pública más equitativa y transparente.</p>
                {contexto.walletConn.isSignedIn &&
                    <button className="btn btn-sm btn-outline-primary" onClick={() => login()}> Ingresar</button>
                }
            </div>
        </div>
    </div>
}

export default Login;