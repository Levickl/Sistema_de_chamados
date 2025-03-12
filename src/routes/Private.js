import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../contexts/auth';

export default function Private({ children }){

    const { user, signed, loading } = useContext(AuthContext);

    if(loading){
        return(
            <div>
                Carregando...
            </div>
        )
    }

    if (!signed){
        return <Navigate to={'/'} />
    }
    //console.log("Entrou: ", user);

    return children;
}