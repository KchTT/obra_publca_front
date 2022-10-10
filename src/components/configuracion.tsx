
import React, { useEffect, useState, forwardRef, useContext } from 'react';
import { ContextData } from "./App";

const Configuracion = (props: any) => {
    const contexto = useContext(ContextData)
    const [enviando, setEnviando] = useState(false)
    const [titular, setTitular] = useState("")
    const [arancel, setArancel] = useState("")

    useEffect(() => {
        (async()=>{
            const _titular = await contexto.contractObraPublica.get_titular();
            const _arancel = await contexto.contractObraPublica.get_arancel();
            setTitular(_titular)
            setArancel(_arancel)
        }
        )()
    }, [])

    const saveTitular = () => {
    }

    const saveArancel = () => {
    }

    return <div>
        <h1>CONFIGURACION</h1>
        <div className="row mt-3">
            <div className="col-6 col-md-6">
                <div className="form-floating">
                    <input type="text" name="titular" className="form-control" value={titular} onChange={(e) => setTitular(e.target.value)} />
                    <label>Cuenta Titular</label>
                </div>
            </div>

            <div className="col-6 col-md-6">
                <button type="button" className="btn btn-primary btn-believe mt-3 w-100" onClick={() => saveTitular()}>
                    GUARDA TITULAR
                </button>
            </div>
        </div>

        <div className="row mt-3">
            <div className="col-6 col-md-6">
                <div className="form-floating">
                    <input type="number" name="arancel" className="form-control" value={arancel} onChange={(e) => setArancel(e.target.value)} />
                    <label>Arancel</label>
                </div>
            </div>

            <div className="col-6 col-md-6">
                <button type="button" className="btn btn-primary btn-believe mt-3 w-100" onClick={() => saveArancel()}>
                    GUARDA ARANCEL
                </button>
            </div>
        </div>

    </div>

}

export default Configuracion