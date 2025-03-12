import {useState} from 'react';
import Title from '../../components/Title';
import Header from '../../components/Header';
import { FiUser } from 'react-icons/fi';
import {db} from '../../services/firebaseConnection';
import {addDoc, collection} from 'firebase/firestore';
import { toast } from 'react-toastify';


export default function Customers(){
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');
    const [loading, setLoading] = useState(false);
    
    async function handleRegister(e){
        e.preventDefault();
        if(nome !== '' && cnpj !== '' && endereco !== ''){
            setLoading(true);
            const addCustomerPromise = addDoc(collection(db, 'customers'), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco: endereco,
            }).then(()=>{
                setNome('');
                setCnpj('');
                setEndereco('');
                setLoading(false);
            });
            await toast.promise(addCustomerPromise, {
                pending: "Adicionando cliente...",
                success: "Cliente adicionado com sucesso! 🎉",
                error: (error) => `Erro ao adicionar cliente: ${error.message}`,
            });            
        }else{
            toast.error(`Preencha todos os campos!`);
        }

    }

    return(
        <div>
            <Header />

            <div className='content'>
                <Title name='Clientes'>
                    <FiUser size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        
                        <label>Nome do cliente:</label>
                        <input 
                            type='text'
                            placeholder='Nome'
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <label>CNPJ:</label>
                        <input 
                            maxLength={14}                           
                            type='text'
                            placeholder='CNPJ'
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                        />

                        <label>Endereço:</label>
                        <input
                            type='text'
                            placeholder='Endereço da empresa'
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />

                        <button type='submit' disabled={loading}>
                            Adicionar cliente
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}