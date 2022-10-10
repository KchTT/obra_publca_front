import React, { useEffect, useState,useContext } from 'react';
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import { ContextData } from "./App";

const Header = (props: any) => {
    const navigate = useNavigate();
    const contexto = useContext(ContextData)

    const sale = () => {
        contexto.walletConn.signOut()
        navigate('/', { replace: true })
    }

    return <header>
        <nav className="navbar navbar-expand-lg navbar-light" style={{ height: "70px", backgroundColor: "#fff" }}>
            <div className="navbar-brand">
                SMART CONSTRUCT
                <img src="./imgs/ic_believe.jpg" height="45" className="d-inline-block align-top" alt="" />
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end align-self-center" id="navbarSupportedContent"
                style={{ justifyContent: "flex-end", textAlign: "end" }}
            >
                {contexto.walletConn.isSignedIn &&
                    <ul className="navbar-nav align-items-center" style={{ backgroundColor: "#fff" }}>
                        <li className="nav-item  naranja me-2"><Link className='nav-link' to="mis_licitaciones">MIS LICITACIONES</Link></li>
                        <li className="nav-item  naranja me-2"><Link className='nav-link' to="proyectos">PROYECTOS</Link></li>
                        <li className="nav-item  naranja me-2"><Link className='nav-link' to="configuracion">CONFIGURACION</Link></li>
                        <li className="nav-item  naranja me-2"> <div style={{lineHeight: "14px",fontSize: "12px",fontWeight:"700"}}>{props.titular ? "TITULAR" : "USUARIO"}<br/>{contexto.walletConn.getAccountId()}</div></li>
                        <li className="nav-item  naranja "><button onClick={() => sale()} className="btn btn-sm btn-outline-primary"> SALIR</button></li>
                    </ul>
                }

            </div>
        </nav>
    </header>
}

export default Header