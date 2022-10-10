import * as nearAPI from "near-api-js";

const { connect, keyStores, WalletConnection, Contract } = nearAPI;

const connectionConfig = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  //contractName:process.env.REACT_APP_CONTRACT,
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
};

export const net_conn = async () => {
    const nearConnection = await connect(connectionConfig);
    const walletConn = new WalletConnection(nearConnection,"obra");
    const contract = process.env.REACT_APP_CONTRACT
    
    if(!walletConn.isSignedIn){
        console.log("NO ESTA LOGUEADO")
        walletConn.requestSignIn(contract)
    }else{
        console.log(walletConn.getAccountId())
        console.log(walletConn.account())
        console.log(process.env.REACT_APP_CONTRACT)

        let currentUser;
        if (walletConn.getAccountId()) {
          currentUser = {
            accountId: walletConn.getAccountId(),
            balance: (await walletConn.account().state()).amount,
          };
        }

        const contractObraPublica = new Contract(
        walletConn.account(),
        process.env.REACT_APP_CONTRACT,
        {
          viewMethods: ["get_proyecto","get_titular","get_all_proyectos","get_arancel","get_cantidad_proyectos","get_licitaciones_activas"], // view methods do not change state but usually return a value
          changeMethods: [  "add_obra",  "limpia_proyectos",  "estado_obra",  "add_licitacion",  "estado_licitacion",  "evaluar_licitacion",  "modifica_arancel",  "modifica_titular"], // change methods modify state
          sender: walletConn.getAccountId(), // account object to initialize and sign transactions.
        }
      );
      
      return {nearConnection,walletConn,contractObraPublica,currentUser}
    }
}