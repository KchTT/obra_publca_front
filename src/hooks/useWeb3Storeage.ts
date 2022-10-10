
import { useState, useEffect } from 'react';
import { Web3Storage, getFilesFromPath, File } from 'web3.storage'

const useWeb3Store = (props: any) => {

    const [archivo, setArchivo] = useState(null)
    const [_token, setToken] = useState("")

    useEffect(() => {
       //setArchivo(makeFileObjects())
    }, []);

    const getAccessToken = (): string => {
        // If you're just testing, you can paste in a token
        // and uncomment the following line:
        // return 'paste-your-token-here'

        // In a real app, it's better to read an access token from an
        // environement variable or other configuration that's kept outside of
        // your code base. For this to work, you need to set the
        // WEB3STORAGE_TOKEN environment variable before you run your code.
        return String(process.env.REACT_APP_WEB3STORAGE_TOKEN)
    }

    const makeStorageClient = () => {
        return new Web3Storage({ token: getAccessToken() })
    }

    const getFiles = async (path: any) => {
        const files = await getFilesFromPath(path)
        console.log(`read ${files.length} file(s) from ${path}`)
        return files
    }

    const makeFileObjects = () => {
        const obj = { hello: 'world' }
        const buffer = Buffer.from(JSON.stringify(obj))
        const file = new File([buffer], 'hello.json')
      
        return file
    }

    const storeFiles = async (files: any) => {
        if (files) {
            const client = makeStorageClient()
            const cid = await client.put(files)
            console.log('stored files with cid:', cid)
            return cid
        }

    }

    return [
        archivo,
        setArchivo,
        storeFiles,
        makeFileObjects
    ]
}

export default useWeb3Store