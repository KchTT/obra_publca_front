import React, { useEffect, useState, forwardRef, useContext } from 'react';
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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


const MisLicitaciones = (props: any) => {

    let tipos = ["TODOS", "VENTA - BOOKING ID", "VENTA - WALKIN", "COMPRAS"]
    let estados = ["SELECCIONAR", "NEW", "CANCEL", "BORRADO"]



    const contexto = useContext(ContextData)

    const [modalVisible, setModalVisible] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [data, setData] = useState(null)
    const [filtradas, setFiltradas] = useState([])
    const [size, setSize] = useState(50);
    const [cant, setCant] = useState(50);
    const [msj, setMsj] = useState("");
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
        (async function () {
            await trae()
        })();
    }, [desde, hasta]);

    const verMas = () => {
        setSize(size + cant)
    }

    const abreModal = async (_id: any) => {
        //var r = (_id != null && filtradas) ? filtradas.find(c => c.id == _id) : proyecto_default;
        setModalVisible(true);
    };

    const cierraModal = () => {
        setModalVisible(false);
    };

    const handleChangeFilter = (e: any) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value })
    }


    const trae = async () => {
        const response = await contexto.contractObraPublica.get_mis_licitaciones({});
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

    return <div className="container">
        <div className="row mt-3 border-bottom border-top align-items-end p-2">

            <div className="col-auto">
                <h5 className='p-0 m-0'>MIS LICITACIONES</h5>
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
                        </tr>
                    </thead>
                    <tbody>
                        {filtradas.map((e: any, i) => {
                            return (
                                <tr key={i}>
                                    <td style={{ whiteSpace: "nowrap" }}>{moment.unix(e.unix_timestamp).format("DD.MM.YY")}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{e.empresa}</td>
                                    <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.cuit}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{e.descripcion}</td>
                                    <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.monto}</td>
                                    <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.tiempo}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>{e.hash_presupuesto}</td>
                                    <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.estado}</td>
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
    </div>


}



export default MisLicitaciones;
