import * as React from 'react';
import {  INearContext } from '../@types/';
export const NearContext = React.createContext<INearContext | null>(null);
/*
interface Props {
    children: React.ReactNode;
}

const NearProvider: React.FC<Props> = ({ children }) => {
  const [near, setNear] = React.useState<INearContext>(
    {
        nearConnection: null,
		walletConn: null,
		contractObraPublica: null,
		currentUser:null,
    }
  );

  const init = () => {
    
  };

  const signWallet = () => {
    
  };

  const contractConn = (contract: string) => {}

  return <NearProvider.Provider value={{ near, init, signWallet,contractConn }}>{children}</NearProvider.Provider>;
};

export default NearProvider;
*/