import { FiPlusCircle } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title'
import { useContext, useEffect, useState } from 'react';
import './style.css'

import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { useNavigate, useParams } from 'react-router-dom';

const listRef = collection(db, 'customers');

export default function New() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();

    const [loadCustomer, setLoadCustomer] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);
    const [customers, setCustomers] = useState([]);

    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [idCustomer, setIdCustomer] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        async function loadCustomers() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia,
                        })
                    })
                    if (snapshot.docs.size === 0) {
                        console.log("nenhuma empresa encontrada");
                        setCustomers([{ id: 1, nomeFantasia: 'Teste' }])
                        setLoadCustomer(false);
                        return;
                    }
                    setCustomers(lista);
                    setLoadCustomer(false);

                    if (id) {
                        loadId(lista);
                    }

                }).catch((error) => {
                    console.log('ocorreu um erro ao buscar os clientes', error);
                    setLoadCustomer(false);
                    setCustomers([{ id: 1, nomeFantasia: 'Teste' }])
                })
        }

        loadCustomers();
    }, [id]);

    async function loadId(lista) {
        const docRef = doc(db, 'chamados', id);
        await getDoc(docRef)
            .then((snapshot) => {
                setAssunto(snapshot.data().assunto);
                setStatus(snapshot.data().status);
                setComplemento(snapshot.data().complemento);

                let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
                setCustomerSelected(index);
                setIdCustomer(true);
            })
            .catch((error) => {
                setIdCustomer(false);
                console.log(error);
            })
    }

    async function handleRegister(e) {
        e.preventDefault();

        //atualizar chamado(doc)
        if (idCustomer) {
            const docRef = doc(db, 'chamados', id);
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid,
            }).then(()=>{
                toast.info('Chamado atualizado com sucesso!');
                navigate('/dashboard');
            }).catch((error)=>{
                toast.error('Não foi possivel atualizar:', error.message);
            })
            return;
        }

        //registar documento
        const chamadoDoc = addDoc(collection(db, 'chamados'), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,
        }).then(() => {
            setComplemento('');
            setStatus('Aberto');
            setCustomerSelected(0);
            setAssunto('Suporte');
        });

        await toast.promise(chamadoDoc, {
            pending: "Registrando chamado...",
            success: "Chamado registrado!",
            error: (error) => `Erro ao registrar 😢 ${error.message}`,
        });
    }

    return (
        <div>
            <Header />

            <div className='content'>
                <Title name={idCustomer ? 'Editando chamado': 'Novo chamado'}>
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type='text' disabled={true} value='Carregando...' />
                            ) : (
                                <select value={customerSelected} onChange={(e) => setCustomerSelected(e.target.value)}>
                                    {customers.map((item, index) => {
                                        return (
                                            <option key={index} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    })}
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={(e) => setAssunto(e.target.value)}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita Tecnica'>Visita Tecnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            <input
                                type='radio'
                                name='radio'
                                value='Aberto'
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === 'Aberto'}
                            />
                            <span>Aberto</span>

                            <input
                                type='radio'
                                name='radio'
                                value='Progresso'
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === 'Progresso'}

                            />
                            <span>Progresso</span>

                            <input
                                type='radio'
                                name='radio'
                                value='Atendido'
                                onChange={(e) => setStatus(e.target.value)}
                                checked={status === 'Atendido'}
                            />
                            <span>Atendido</span>

                        </div>

                        <label>Complemento</label>

                        <textarea
                            type='text'
                            placeholder='Descreva seu problema (opcional).'
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />


                        <button type='submit'>
                            {idCustomer ? 'Atualizar' : 'Registrar' }
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}