import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate, Outlet, useOutletContext } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { ContextData } from "./App";


const LayoutPrincipal = (props: any) => {
    const contexto = useContext(ContextData)
    const navigate = useNavigate();
    const isMounted = useRef(false);
    const [titular, setTitular] = useState(false)

    useEffect(() => {
        (async () => {
            console.log(contexto.walletConn.getAccountId())
            console.log(contexto.walletConn.isSignedIn())
            const response = await contexto.contractObraPublica.get_titular({});
            if (response === contexto.walletConn.getAccountId()) setTitular(true)
        })()
    }, [])

    useEffect(() => {
        if (!contexto.walletConn.isSignedIn()) {
            navigate('/', { replace: true })
        }
    })

    return (
        <>
            <Header titular={titular}  />
            <div className="flex-grow-1 p-2" style={{ marginTop: localStorage.getItem("isAuthenticate") ? "90px" : "0px" }}>
                <Outlet />
            </div>
            <Footer />
        </>
    )
}

export default LayoutPrincipal;

