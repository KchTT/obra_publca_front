import React, { useEffect, useState, forwardRef, useContext } from 'react';
import { useLocation, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { ContextData } from "./App";
import FormLicitacion from "../components/form_licitacion"
import FormEvaluacion from "../components/form_evaluacion"
import { Web3Storage } from 'web3.storage'


const Proyecto = (props: any) => {

    let estados = ["STAND BY", "ACTIVA", "FINALIZADA", "CANCELADA"]

    const proyecto_default = {
        pos: 0,
        nombre: "",
        ubicacion: "",
        descripcion: "",
        apertura_licitacion: moment().unix(),
        fecha_limite_licitacion: moment().unix(),
        hash_pliego: "XXX",
        licitaciones: [],
        estado: 1
    }

    const contexto = useContext(ContextData)

    const [proyecto, setProyecto] = useState(proyecto_default)
    const [modalLicitacionVisible, setModalLicitacionVisible] = useState(false)
    const [modalEvaluacionVisible, setModalEvaluacionVisible] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [msj, setMsj] = useState("");
    const [licitacion, setLicitacion] = useState({
        index_obra: 0,
        pos:0,
        empresa: "",
        cuit:"",
        descripcion: "",
        monto: 0,
        tiempo: 0,
        hash_presupuesto: "XXX",
        estado: 1
    })

    const location = useLocation();
    const params = useParams()

    useEffect(() => {
        (async () => {
            console.log(location)
            if (location.state && location.state.hasOwnProperty("proyecto")) {
                const { proyecto } = location.state;
                console.log(proyecto);
                setProyecto(proyecto)
            } else {
                const response = await contexto.contractObraPublica.get_all_proyectos({ unix_timestamp: params.id });
                setProyecto(response[0])
            }
        })()
    }, []);

    useEffect(() => {
        console.log(proyecto)
    });

    const abreModalLicitacion = async (_id: any) => {
        //var r = (_id != null && filtradas) ? filtradas.find(c => c.id == _id) : proyecto_default;
        //setProyecto(proyecto_default);
        setModalLicitacionVisible(true);
    };

    const abreModalEvaluacion = async (_licitacion: any) => {
        //var r = (_id != null && filtradas) ? filtradas.find(c => c.id == _id) : proyecto_default;
        setLicitacion(_licitacion);
        setModalLicitacionVisible(true);
    };

    const cierraModal = () => {
        //setProyecto(proyecto_default);
        setModalLicitacionVisible(false);
        setModalEvaluacionVisible(false);
    };

    async function retrieve (cid:string) {
        const client = new Web3Storage({ token: String(process.env.REACT_APP_WEB3STORAGE_TOKEN) })
        const res = await client.get(cid)
        console.log(`Got a response! [${res?.status}] ${res?.statusText}`)
        if (!res?.ok) {
          throw new Error(`failed to get ${cid}`)
        }
        console.log(res)
        const files = await res.files()
        for (const file of files) {
            console.log(file)
            window.open(`https://${cid}.ipfs.w3s.link/${file.name}`, '_blank', 'noopener,noreferrer');
        }
            
      }

    return <div className="container">
        <div className="row mt-3 border-bottom border-top align-items-end p-2">
            <div className="col-auto">
                <h5 className='p-0 m-0'>Proyecto</h5>
            </div>
        </div>
        <div className="row mt-3  border-top align-items-end p-2">
            <div className="col-3">
                <h5 className='p-0 m-0'>{proyecto.nombre}</h5>
            </div>
            <div className="col-3">
                <h5 className='p-0 m-0'>{proyecto.ubicacion}</h5>
            </div>
            <div className="col-3">
                <h5 className='p-0 m-0'>{moment.unix(proyecto.apertura_licitacion).format("DD.MM.YY")}</h5>
            </div>
            <div className="col-3">
                <h5 className='p-0 m-0'>{moment.unix(proyecto.fecha_limite_licitacion).format("DD.MM.YY")}</h5>
            </div>
        </div>
        <div className="row mt-3 border-bottom  align-items-end p-2">
            <div className="col-auto">
                <p className='p-0 m-0'>{proyecto.descripcion}</p>
            </div>
        </div>

        <button className="btn btn-sm btn-outline-primary mt-2" onClick={(evt)=>{retrieve(String(proyecto.hash_pliego))}}>{proyecto.hash_pliego}</button>
        
        <div className="row  pt-5">
            <button className="btn btn-primary btn-believe " onClick={() => abreModalLicitacion(null)}>
                <i className="fas fa-plus"></i>
            </button>
            {enviando ?
                <h5>AGUARDE UN INSTANTE...</h5>
                :
                <table className="table table-striped" style={{ fontSize: "12px", verticalAlign: "middle" }}>
                    <thead>
                        <tr>
                            <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}>FECHA</th>
                            <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}>EMPRESA</th>
                            <th scope="col" className="header_sticky naranja text-center" style={{ whiteSpace: "nowrap" }}>CUIT</th>
                            <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}>DESCRIPCION</th>
                            <th scope="col" className="header_sticky naranja text-center" style={{ whiteSpace: "nowrap" }}>COSTO</th>
                            <th scope="col" className="header_sticky naranja text-center" style={{ whiteSpace: "nowrap" }}>TIEMPO</th>
                            <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}>PRESUPUESTO</th>
                            <th scope="col" className="header_sticky naranja  text-center" style={{ whiteSpace: "nowrap" }}>ESTADO</th>
                            <th scope="col" className="header_sticky naranja  text-center" style={{ whiteSpace: "nowrap" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {proyecto?.licitaciones?.map((e: any, i) => {
                            return (
                                <tr key={i}>
                                    <td style={{ whiteSpace: "nowrap" }}>{moment.unix(e.unix_timestamp).format("DD.MM.YY")}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{e.empresa}</td>
                                    <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.cuit}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{e.descripcion}</td>
                                    <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.monto}</td>
                                    <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.tiempo}</td>
                                    <td style={{ whiteSpace: "nowrap" }}><button className="btn btn-sm btn-outline-primary" onClick={(evt)=>{retrieve(String(e?.hash_presupuesto))}}>{e.hash_presupuesto}</button></td>
                                    <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.estado}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary btn-believe" onClick={() => abreModalEvaluacion(e)}>
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={12} className="text-end"></td>
                        </tr>
                    </tfoot>
                </table>
            }
        </div>

        {modalLicitacionVisible && (
            <FormLicitacion index_obra={proyecto.pos} cierraModalAct={cierraModal} />
        )}
        {modalEvaluacionVisible && (
            <FormEvaluacion licitacion={licitacion} cierraModalAct={cierraModal} />
        )}
    </div>

}



export default Proyecto;
