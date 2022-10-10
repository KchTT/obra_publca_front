import React, { useEffect, useState, forwardRef,useContext } from 'react';
import { Web3Storage } from 'web3.storage'

import { ContextData } from "./App";
import DragDropFile from '../components/drag_drop'

const FromLicitacion = (props:any) => {
    const contexto = useContext(ContextData)

    const [presupuesto, setPresupuesto] = useState(null)
    const [enviando, setEnviando] = useState(false)
    const [msj, setMsj] = useState("");


    const [licitacion, setLicitacion] = useState({
        index_obra: props.index_obra,
        empresa: "",
        cuit:"",
        descripcion: "",
        monto: 0,
        tiempo: 0,
        hash_presupuesto: "XXX",
        estado: 1
    })

    const cambia = (e:any) => {
        setLicitacion({ ...licitacion, [e.target.name]:(e.target.name==="monto" || e.target.name==="tiempo")?parseFloat(e.target.value): e.target.value });
    };

    const saveLicitacion = async () => {
        if (licitacion.empresa === "") {
            setMsj("DEBE COMPLETAR EL NOMBRE DE LA EMPRESA");
        } else if (licitacion.cuit === "") {
            setMsj("DEBE COMPLETAR EL CUIT DE LA EMPRESA")
        } else if (licitacion.descripcion ==="") {
            setMsj("DEBE COMPLETAR LA DESCRIPCION")
        } else if (licitacion.monto <= 0) {
            setMsj("EL MONTO DEBE SER MAYOR QUE 0")
        } else if (licitacion.tiempo <= 0) {
            setMsj("EL TIEMPO DEBE SER MAYOR QUE 0")
        } else if (!presupuesto) {
            setMsj("DEBE AGREGAR EL PRESUPUESTO DEL DOCUMENTO")
        } else {
            setEnviando(true)
            setMsj("")
            try {
                const client = new Web3Storage({ token: String(process.env.REACT_APP_WEB3STORAGE_TOKEN) })
                const cid = await client.put([presupuesto])
                const lic = { 
                    index_obra:props.index_obra, 
                    empresa:licitacion.empresa, 
                    cuit:licitacion.cuit, 
                    descripcion:licitacion.descripcion, 
                    monto:licitacion.monto, 
                    tiempo:licitacion.tiempo, 
                    hash_presupuesto:cid, 
                    estado:licitacion.estado 
                }
                const response = await contexto.contractObraPublica.add_licitacion(lic,"300000000000000","2000000000000000000000");
                console.log(response)
            } catch (error) {
                console.log(error)
            } finally {
                setEnviando(false)
                setPresupuesto(null)
                props.cierraModalAct()
            }
        }
    }

    const setFile = (file:any)=>{
        console.log(file)
        setPresupuesto(file)
    }

    return <div className="modal show  modal-open " style={{ display: "block " }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title naranja">LICITACION</h5>
                    <button type="button" className="btn-close" onClick={() => props.cierraModalAct()} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                {msj != "" &&
                        <div className="alert alert-danger" role="alert">
                            {msj}
                        </div>
                    }
                    {enviando ? (
                        <h4>AGUARDE UN SEGUNDO...</h4>
                    ) : (
                        <div className="container">

                            <div className="row mt-3">
                                <div className="col-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="text" name="empresa" className="form-control" value={licitacion.empresa} onChange={(e) => cambia(e)} />
                                        <label>Empresa</label>
                                    </div>
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="text" name="cuit" className="form-control" value={licitacion.cuit} onChange={(e) => cambia(e)} />
                                        <label>Cuit</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-12 col-md-12 mt-2">
                                    <div className="form-floating">
                                        <textarea name="descripcion" className="form-control" value={licitacion.descripcion} onChange={(e) => cambia(e)} />
                                        <label>Descripcion</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3 mb-3">
                                <div className="col-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="number" name="monto" className="form-control" value={licitacion.monto} onChange={(e) => cambia(e)} />
                                        <label>Monto</label>
                                    </div>
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="form-floating">
                                        <input type="number" name="tiempo" className="form-control" value={licitacion.tiempo} onChange={(e) => cambia(e)} />
                                        <label>Duracion en dìas</label>
                                    </div>
                                </div>
                            </div>
                            <DragDropFile agregaArchivosAct={setFile} archivo={presupuesto} eliminaArchivoAct={setPresupuesto}  desc="Ajunte el presupuesto"/>
                            <button type="button" className="btn btn-secondary btn-believe mt-3 w-100" onClick={() => saveLicitacion()}>
                                SAVE
                            </button>

                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => props.cierraModalAct()}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default FromLicitacion