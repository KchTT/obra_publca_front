

export type NearContextType = {
  near_context: INearContext;
  init: () => void;
  signWallet: () => void;
  contractConn: (contract: string) => void;
};

export interface INearContext {
  nearConnection?: any
  walletConn?: any
  contractObraPublica?: any
  currentUser?: any,
  init?: () => void;
  signWallet?: () => void;
  contractConn?: (contract: string) => void;
}