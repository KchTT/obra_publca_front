import React, { useEffect, useState, forwardRef, useContext } from 'react';
import { ContextData } from "./App";

const FormEvaluacion = (props: any) => {
    const contexto = useContext(ContextData)
    const [enviando, setEnviando] = useState(false)
    const [msj, setMsj] = useState("");
    const [evaluacion, setEvaluacion] = useState({
        index_obra: props.index_obra,
        index_licitacion: props.index_licitacion,
        valoracion: 0,
        justificacion: "",
        estado: 1
    })

    const cambia = (e: any) => {
        setEvaluacion({ ...evaluacion, [e.target.name]:e.target.name==="valoracion"?parseInt(e.target.value):e.target.value });
    };

    const saveEvaluacion = async () => {
        if (evaluacion.valoracion === 0) {
            setMsj("DEBE COMPLETAR EL NOMBRE");
        } else if (evaluacion.justificacion === "") {
            setMsj("DEBE COMPLETAR LA UBICACION")
        } else if (evaluacion.estado < 2) {
            setMsj("DEBE COMPLETAR LA DESCRIPCION")
        } else {
            setEnviando(true)
            setMsj("")
            try {
                const response = await contexto.contractObraPublica.evaluar_licitacion(evaluacion);
            } catch (error) {
                console.log(error)
            } finally {
                setEnviando(false)
                props.cierraModalAct()
            }
        }
    };

    return <div className="modal show  modal-open " style={{ display: "block " }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title naranja">Evaluacion</h5>
                    <button type="button" className="btn-close" onClick={() => props.cierraModal()} aria-label="Close"></button>
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
                                        <select className="form-select" value={String(evaluacion.valoracion)} name="valoracion" onChange={(e) => cambia(e)}>
                                            {[1, 2, 3, 4, 5].map((e, i) => {
                                                return (
                                                    <option value={e} key={i}>
                                                        {e}
                                                    </option>
                                                );
                                            })
                                            }
                                        </select>
                                        <label>Valoracion</label>
                                    </div>
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="form-floating">
                                        <select className="form-select" value={evaluacion.estado} name="estado" onChange={(e) => cambia(e)}>
                                            {[{ id: 2, etiqueta: "APROBADO" }, { id: 3, etiqueta: "DESCARTADO" }].map((e, i) => {
                                                return (
                                                    <option value={e.id} key={i}>
                                                        {e.etiqueta}
                                                    </option>
                                                );
                                            })
                                            }
                                        </select>
                                        <label>Estado</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-12 col-md-12 mt-2">
                                    <div className="form-floating">
                                        <textarea name="descripcion" className="form-control" value={evaluacion.justificacion} onChange={(e) => cambia(e)} />
                                        <label>Justificacion</label>
                                    </div>
                                </div>
                            </div>

                            <button type="button" className="btn btn-secondary btn-believe mt-3 w-100" onClick={() => saveEvaluacion()}>
                                SAVE
                            </button>

                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => props.cierraModal()}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
}

export default FormEvaluacion