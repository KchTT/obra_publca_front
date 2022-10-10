import React, { useEffect, useState, forwardRef, useContext } from 'react';
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Web3Storage } from 'web3.storage'
import moment from 'moment';
import { ContextData } from "./App";
import DragDropFile from '../components/drag_drop'
import useWeb3Storage from '../hooks/useWeb3Storeage';

interface DateButtonProps {
    children?: React.ReactNode;
    value?: string;
    onClick?: any
}

const FromSelect = forwardRef<HTMLButtonElement, DateButtonProps>((props, ref) => (
    <button className="btn btn-sm btn-primary" onClick={props.onClick} ref={ref}>
        FROM: {props.value}
    </button>
));

const ToSelect = forwardRef<HTMLButtonElement, DateButtonProps>(({ value, onClick }, ref) => (
    <button className="btn btn-sm btn-primary" onClick={onClick} ref={ref}>
        TO: {value}
    </button>
));

const Inicio = forwardRef<HTMLButtonElement, DateButtonProps>(({ value, onClick }, ref) => (
    <button className="btn btn-sm btn-primary w-100" onClick={onClick} ref={ref}>
        INICIO: {value}
    </button>
));

const Fin = forwardRef<HTMLButtonElement, DateButtonProps>(({ value, onClick }, ref) => (
    <button className="btn btn-sm btn-primary w-100" onClick={onClick} ref={ref}>
        FINALIZA: {value}
    </button>
));

const Proyectos = (props: any) => {

    let tipos = ["TODOS", "VENTA - BOOKING ID", "VENTA - WALKIN", "COMPRAS"]
    let estados = ["SELECCIONAR", "NEW", "CANCEL", "BORRADO"]

    const proyecto_default = {
        nombre: "",
        ubicacion: "",
        descripcion: "",
        apertura_licitacion: moment().unix(),
        fecha_limite_licitacion: moment().unix(),
        hash_pliego: "XXX",
        estado: 1
    }

    const contexto = useContext(ContextData)
    const [archivo, setArchivo, storeFiles] = useWeb3Storage(null);

    const [pliego, setPliego] = useState(null)
    const [proyecto, setProyecto] = useState(proyecto_default)
    const [modalVisible, setModalVisible] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [data, setData] = useState(null)
    const [filtradas, setFiltradas] = useState([])
    const [size, setSize] = useState(50);
    const [cant, setCant] = useState(50);
    const [msj, setMsj] = useState("");
    const [sujeto_valor_auto, setSujetoValorAuto] = useState("");
    const [desde, setDesde] = useState(moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'));
    const [hasta, setHasta] = useState(moment().format('YYYY-MM-DD'));
    const [filtros, setFiltros] = useState({
        tipo: "",
        code_sujeto: "",
        term: ""
    });

    const [combos, setCombos] = useState({
        arr_sujetos: [],
    })

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            await trae()
        })()
    }, []);

    useEffect(() => {
        console.log(proyecto)
    });

    useEffect(() => {
        (async function () {
            await trae()
        })();
    }, [desde, hasta]);

    const verMas = () => {
        setSize(size + cant)
    }

    const abreModal = async (_id: any) => {
        //var r = (_id != null && filtradas) ? filtradas.find(c => c.id == _id) : proyecto_default;
        setProyecto(proyecto_default);
        setModalVisible(true);
    };

    const cierraModal = () => {
        setProyecto(proyecto_default);
        setPliego(null)
        setModalVisible(false);
    };

    const cambia = (e: any) => {
        setProyecto({ ...proyecto, [e.target.name]: e.target.value });
    };

    const handleChangeFilter = (e: any) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value })
    }

    const saveProyecto = async () => {
        if (proyecto.nombre == "") {
            setMsj("DEBE COMPLETAR EL NOMBRE");
        } else if (proyecto.ubicacion == "") {
            setMsj("DEBE COMPLETAR LA UBICACION")
        } else if (proyecto.descripcion == "") {
            setMsj("DEBE COMPLETAR LA DESCRIPCION")
        } else if (!pliego) {
            setMsj("DEBE AGREGAR EL DOCUMENTO QUE CONTIENE EL PROYECTO")
        } else {
            setEnviando(true)
            setMsj("")
            try {
                const client = new Web3Storage({ token: String(process.env.REACT_APP_WEB3STORAGE_TOKEN) })
                const _hash_pliego = await client.put([pliego])
               const response = await contexto.contractObraPublica.add_obra({
                    nombre: proyecto.nombre,
                    ubicacion: proyecto.ubicacion,
                    descripcion: proyecto.descripcion,
                    apertura_licitacion: proyecto.apertura_licitacion,
                    fecha_limite_licitacion: proyecto.fecha_limite_licitacion,
                    hash_pliego: _hash_pliego,
                    estado: proyecto.estado
                });
                await trae()
            } catch (error) {
                console.log(error)
            } finally {
                setEnviando(false)
            }
            cierraModal()
        }
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

    const trae = async () => {
        const response = await contexto.contractObraPublica.get_all_proyectos({});
        console.log(response)
        setFiltradas(response)
        setData(response)
    }

    const filtraData = () => {
        /*let filtrados = [];
        console.log(filtros)
        for (let t of data) {
            console.log(t)
            //let term = t.name + t.lastname + t.booking_n
            let pasa = 1;
            //pasa = (pasa == 0 || (parseInt(filtros.tipo) > 0 && t.tipo != filtros.tipo)) ? 0 : 1
            //pasa = (pasa == 0 || (filtros.code_sujeto != "" && t.code_sujeto != filtros.code_sujeto)) ? 0 : 1
            //pasa = (pasa == 0 || (filtros.term != "" && !term.toLowerCase().replace(/\s+/g, '').includes(filtros.term.toLowerCase().replace(/\s+/g, '')))) ? 0 : 1
            if (pasa == 1) filtrados.push(t)
        }
        //return filtrados
        setFiltradas(filtrados)*/
    };

    const setFile = (file: any) => {
        console.log(file)
        setPliego(file)
    }

    return <ContextData.Consumer>
        {
            (data) => {
                return <div className="container">
                    <div className="row mt-3 border-bottom border-top align-items-end p-2">

                        <div className="col-auto">
                            <h5 className='p-0 m-0'>Proyectos</h5>
                        </div>

                        <div className="col-auto">
                            <DatePicker
                                onChange={(d) => setDesde(moment(d).format('YYYY-MM-DD'))}
                                className="form-control form-control-sm "
                                selected={moment(desde).toDate()}
                                dateFormat="dd/MM/yy"
                                customInput={<FromSelect />} />
                        </div>

                        <div className="col-auto">
                            <DatePicker
                                onChange={(d) => setHasta(moment(d).format('YYYY-MM-DD'))}
                                className="form-control form-control-sm "
                                selected={moment(hasta).toDate()}
                                dateFormat="dd/MM/yy"
                                customInput={<ToSelect />}
                            />
                        </div>

                        <div className="col-auto">
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => filtraData()}
                                aria-label="Close"
                            >
                                FILTRAR
                            </button>
                        </div>
                    </div>
                    <div className="row  pt-5">
                        <button className="btn btn-primary btn-believe " onClick={() => abreModal(null)}>
                            <i className="fas fa-plus"></i>
                        </button>
                        {enviando ?
                            <h5>AGUARDE UN INSTANTE...</h5>
                            :
                            <table className="table table-striped" style={{ fontSize: "12px", verticalAlign: "middle" }}>
                                <thead>
                                    <tr>
                                        <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}>FECHA</th>
                                        <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}>NOMBRE</th>
                                        <th scope="col" className="header_sticky naranja text-center" style={{ whiteSpace: "nowrap" }}>UBICACION</th>
                                        <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}>DESCRIPCION #</th>
                                        <th scope="col" className="header_sticky naranja text-center" style={{ whiteSpace: "nowrap" }}>INICIO LICITACION</th>
                                        <th scope="col" className="header_sticky naranja text-center" style={{ whiteSpace: "nowrap" }}>FIN LICITACION</th>
                                        <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}>PLIEGO</th>
                                        <th scope="col" className="header_sticky naranja  text-center" style={{ whiteSpace: "nowrap" }}>ESTADO</th>
                                        <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}></th>
                                        <th scope="col" className="header_sticky naranja" style={{ whiteSpace: "nowrap" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtradas?.slice(0, size).map((e: any, i) => {
                                        return (
                                            <tr key={i}>
                                                <td style={{ whiteSpace: "nowrap" }}>{moment.unix(e.unix_timestamp).format("DD.MM.YY")}</td>
                                                <td style={{ whiteSpace: "nowrap" }}>{e.nombre}</td>
                                                <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.ubicacion}</td>
                                                <td style={{ whiteSpace: "nowrap" }}>{e.descripcion}</td>
                                                <td style={{ whiteSpace: "nowrap" }} className="text-center">{moment.unix(e.apertura_licitacion).format("DD.MM.YY")}</td>
                                                <td style={{ whiteSpace: "nowrap" }} className="text-center">{moment.unix(e.fecha_limite_licitacion).format("DD.MM.YY")}</td>
                                                <td style={{ whiteSpace: "nowrap" }}><button className="btn btn-sm btn-outline-primary" onClick={(evt)=>{retrieve(String(e?.hash_pliego))}}>{e.hash_pliego}</button></td>
                                                <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.estado}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-primary btn-believe" onClick={() => abreModal(e.id)}>
                                                        <i className="fas fa-pencil-alt"></i>
                                                    </button>
                                                </td>
                                                <td>
                                                    <Link to={"/obra_publica/proyectos/" + e.unix_timestamp} state={{ proyecto: e }} className="btn btn-sm btn-primary btn-believe" >
                                                        <i className="far fa-eye"></i>
                                                    </Link>
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

                    {modalVisible && (
                        <div className="modal show  modal-open " style={{ display: "block " }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title naranja">PROYECTO</h5>
                                        <button type="button" className="btn-close" onClick={() => cierraModal()} aria-label="Close"></button>
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
                                                            <input type="text" name="nombre" className="form-control" value={proyecto.nombre} onChange={(e) => cambia(e)} />
                                                            <label>Nombre</label>
                                                        </div>
                                                    </div>

                                                    <div className="col-6 col-md-6">
                                                        <div className="form-floating">
                                                            <input type="text" name="ubicacion" className="form-control" value={proyecto.ubicacion} onChange={(e) => cambia(e)} />
                                                            <label>Ubicacion</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="col-12 col-md-12 mt-2">
                                                        <div className="form-floating">
                                                            <textarea name="descripcion" className="form-control" value={proyecto.descripcion} onChange={(e) => cambia(e)} />
                                                            <label>Descripcion</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mt-3 mb-3">
                                                    <div className="col-6 col-md-6 mt-2">
                                                        <DatePicker
                                                            onChange={(d) => setProyecto({ ...proyecto, apertura_licitacion: moment(d).unix() })}
                                                            className="form-control form-control-sm "
                                                            selected={moment.unix(proyecto.apertura_licitacion).isValid() ? moment.unix(proyecto.apertura_licitacion).toDate() : null}
                                                            dateFormat="dd/MM/yy HH:mm"
                                                            showTimeInput
                                                            customInput={<Inicio />}
                                                        />
                                                    </div>
                                                    <div className="col-6 col-md-6 mt-2">
                                                        <DatePicker
                                                            onChange={(d) => setProyecto({ ...proyecto, fecha_limite_licitacion: moment(d).unix() })}
                                                            className="form-control form-control-sm "
                                                            selected={moment.unix(proyecto.fecha_limite_licitacion).isValid() ? moment.unix(proyecto.fecha_limite_licitacion).toDate() : null}
                                                            dateFormat="dd/MM/yy HH:mm"
                                                            showTimeInput
                                                            customInput={<Fin />}
                                                        />
                                                    </div>

                                                </div>

                                                <DragDropFile agregaArchivosAct={setFile} archivo={pliego} eliminaArchivoAct={setPliego} desc="Ajunte el documento del proyeto" />

                                                <button type="button" className="btn btn-secondary btn-believe mt-3 w-100" onClick={() => saveProyecto()}>
                                                    SAVE
                                                </button>

                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => cierraModal()}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }}
    </ContextData.Consumer>

}



export default Proyectos;
