import './style.css'
import Header from '../../components/Header';
import Title from '../../components/Title';
import { db } from '../../services/firebaseConnection';

import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore';
import { format } from 'date-fns';
import Modal from '../../components/Modal';

export default function Dashboard() {

    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [details, setDetails] = useState();

    const chamadosRef = collection(db, 'chamados');

    useEffect(() => {
        async function loadingChamados() {
            const chamadosRef = collection(db, 'chamados');
            const q = query(chamadosRef, orderBy('created', 'desc'), limit(5))

            const querySnapshot = await getDocs(q);
            setChamados([]); //por causa do React.StrictMode, se quiser tirar fique a vontede.

            await updateState(querySnapshot);
            setLoading(false);

        }
        loadingChamados();

        return () => { }
    }, [])

    async function updateState(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            querySnapshot.forEach(doc => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento,
                });
            });
            
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] //pegando o ultimo item
            //console.log(lista);
            setLastDocs(lastDoc);
            setChamados(chamados => [...chamados, ...lista]);

        } else {
            setIsEmpty(true);
        }
        setLoadingMore(false);
    }

    async function handleMore(){
        setLoadingMore(true);
        
        const q = query(chamadosRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5));
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);
    }

    function toggleModal(item){
        setShowModal(!showModal);
        setDetails(item);
    }

    if (loading) {
        return (
            <div>
                <Header />
                <div className='content'>
                    <Title name='Tickets'>
                        <FiMessageSquare size={25} />
                    </Title>
                    <div className='container dashboard'>
                        <span>Buscando chamados</span>
                    </div>
                </div>
            </div>

        )
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name='Tickets'>
                    <FiMessageSquare size={25} />
                </Title>
                
                <>
            
                    {chamados.length === 0 ? (
                        <div className='container dashboard'>
                            <span>Nenhum chamado encontrado</span>

                            <Link to='/new' className='new'>
                                <FiPlus color='white' size={25} />
                                Novo chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to='/new' className='new'>
                                <FiPlus color='white' size={25} />
                                Novo chamado
                            </Link>
                            
                            <table>
                                <thead>
                                    <tr>
                                        <th scope='col'>Cliente</th>
                                        <th scope='col'>Assunto</th>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>Cadastrando em</th>
                                        <th scope='col'>#</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map((item, index) => {

                                        return (
                                            <tr key={index}>
                                                <td data-label='Cliente'>{item.cliente}</td>
                                                <td data-label='Assunto'>{item.assunto}</td>
                                                <td data-label='Status'>
                                                    <span className='badge' style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td data-label='Cadastrado'>{item.createdFormat}</td>
                                                <td data-label='#'>
                                                    <button className='action' onClick={() => toggleModal(item)} style={{ backgroundColor: '#3583f6'}}>
                                                        <FiSearch color='white' size={17} />
                                                    </button>
                                                    <Link to={`/new/${item.id}`} className='action' style={{ backgroundColor: '#f6a935' }}>
                                                        <FiEdit2 color='white' size={17} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            {loadingMore && <h3>Buscando mais chamados...</h3>}
                            {!loadingMore && !isEmpty && <button onClick={handleMore} className='btn-more'>Buscar mais</button>}
                        </>
                    )
                    }
                </>
            </div>

            {showModal && (
                <Modal conteudo={details} close={() => setShowModal(!showModal)}/>
            )}
        </div>
    )
}