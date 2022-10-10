import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LayoutPublic from "../components/layout_public";
import LayoutPrincipal from "../components/layout_principal";
import Login from '../components/login';
import Home from '../components/home';
import Proyectos from '../components/proyectos'
import Proyecto from '../components/proyecto'
import Configuracion from '../components/configuracion'
import MisLicitaciones from '../components/mis_licitaciones';

interface AppContextInterface {
	nearConnection?: any
	walletConn?: any
	contractObraPublica?: any
	currentUser?: any
}

const ContextData = createContext<AppContextInterface>({});

let data: AppContextInterface = {

}

function App(props: any) {

	data = {
		nearConnection: props?.nearConnection,
		walletConn: props?.walletConn,
		contractObraPublica: props?.contractObraPublica,
		currentUser: props?.currentUser
	}

	const [near_c, setNearConn] = useState(null)

	useEffect(() => {
		data = {
			nearConnection: props?.nearConnection,
			walletConn: props?.walletConn,
			contractObraPublica: props?.contractObraPublica,
			currentUser: props?.currentUser
		}
	}, [])

	return <ContextData.Provider value={data}>

		<BrowserRouter >
			<Routes>
				<Route path="/" element={<LayoutPublic nearConnection={props?.nearConnection} walletConn={props?.walletConn} contractObraPublica={props?.contractObraPublica} currentUser={props?.currentUser} />}>
					<Route index element={<Login />} />
				</Route>
				<Route path="/obra_publica" element={<LayoutPrincipal nearConnection={props?.nearConnection} walletConn={props?.walletConn} contractObraPublica={props?.contractObraPublica} currentUser={props?.currentUser} />}>
					<Route index element={<Home />} />
					<Route path="configuracion" element={<Configuracion />} />
					<Route path="mis_licitaciones" element={<MisLicitaciones />} />
					<Route path="proyectos">
						<Route index element={<Proyectos />} />
						<Route path=":id" element={<Proyecto />} />
					</Route>
				</Route>
				<Route path="*" element={<LayoutPrincipal />}></Route>
			</Routes>
		</BrowserRouter>
	</ContextData.Provider>

}
export { ContextData }

export default App

