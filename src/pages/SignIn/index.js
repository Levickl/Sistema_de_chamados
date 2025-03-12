import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import logo from '../../assets/logo.png'
import { AuthContext } from '../../contexts/auth'
import { auth, db } from '../../services/firebaseConnection';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function SignIn(){
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const navigate = useNavigate();
    const { signIn, loadingAuth, setUser } = useContext(AuthContext);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged( async (value)=>{
            if(value){
                const uid = value.uid;
                const userRef = doc(db, 'users', uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const data = {
                        uid: value.uid,
                        avatarUrl: docSnap.data().avatarUrl,
                        nome: docSnap.data().nome,
                        email: value.email,
                    };
                    setUser(data);
                }
                navigate('/dashboard', { replace: true });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [navigate]);


    async function handleSignIn(e){
        e.preventDefault();
        if (email !== '' && senha !== ''){
            await signIn(email, senha);
        }
    }
    
    return(
        <div className='container-center'>
            <div className='login-area'>
                    <img src={logo} alt='Logo do sistema de chamados'/>
            </div>
            <div className='login'>
                <form onSubmit={handleSignIn}>
                    <h1>Entrar</h1>
                    <input type='email' placeholder='email@email.com' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <input type='password' placeholder='******' 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    />

                    <button type='submit'>
                        {loadingAuth? 'Carregando...' : 'Acessar'}
                    </button>
                </form>
                <Link to='/register'> Criar uma conta</Link>
            </div>
        </div>
    );
}