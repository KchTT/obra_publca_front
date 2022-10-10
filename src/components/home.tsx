import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import moment from 'moment'
import { ContextData } from "./App";

const Home = (props: any) => {
    const navigate = useNavigate();
    const contexto = useContext(ContextData)
    const [obras, setObras] = useState([])

    useEffect(() => {
        (async () => {
            console.log("HOME")
            const _proyectos_activos = await contexto.contractObraPublica.get_licitaciones_activas();
            console.log(_proyectos_activos)
            setObras(_proyectos_activos)
        }
        )()
    }, [])

    return <>
        <h2>PROYECTOS ABIERTOS PARA LICITAR</h2>
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
                </tr>
            </thead>
            <tbody>
                {obras.map((e: any, i) => {
                    return (
                        <tr key={i}>
                            <td style={{ whiteSpace: "nowrap" }}>{moment.unix(e.unix_timestamp).format("DD.MM.YY")}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{e.nombre}</td>
                            <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.ubicacion}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{e.descripcion}</td>
                            <td style={{ whiteSpace: "nowrap" }} className="text-center">{moment.unix(e.apertura_licitacion).format("DD.MM.YY")}</td>
                            <td style={{ whiteSpace: "nowrap" }} className="text-center">{moment.unix(e.fecha_limite_licitacion).format("DD.MM.YY")}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{e.hash_pliego}</td>
                            <td style={{ whiteSpace: "nowrap" }} className="text-center">{e.estado}</td>
                            <td>
                                <Link className="btn btn-sm btn-primary btn-believe" to={"/obra_publica/proyectos/" + e.unix_timestamp} state={{ proyecto: e }}>
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
    </>
}

export default Home;