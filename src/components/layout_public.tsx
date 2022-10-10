import React, { ReactElement, useEffect,useContext } from 'react';
import { Outlet, Link, useNavigate, useParams , useOutletContext} from "react-router-dom";
import { ContextData } from "./App";

const LayoutPublic = (props: any) => {
    const navigate = useNavigate()
    const contexto = useContext(ContextData)
    /*useEffect(() => {
        (async()=>{
            //console.log(props)
            const c:any =  await net_conn()
            console.log(c)
            console.log(c.walletConn.isSignedIn)
            const response = await c.contractObraPublica.get_titular();
            console.log(response);
            if(c.walletConn.isSignedIn) navigate('/obra_publica', { replace: true })
        }
        //console.log(c[1].getAccoutId())
        )()
        //dispatch(fetchCheck())
    }, [])*/

    useEffect(() => {
        console.log(props)
        if(!contexto.walletConn.isSignedIn()){
             //props.walletConn.requestSignIn(process.env.REACT_APP_CONTRACT)
        }else{
            navigate('/obra_publica', { replace: true })
        }
        //if (localStorage.getItem("isAuthenticate") && localStorage.getItem('isAuthenticate') === "true") navigate('/obra_publica', { replace: true })
    })

    return <>
        <Outlet/>
    </>
}

export default LayoutPublic
