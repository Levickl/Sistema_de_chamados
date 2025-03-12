import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';



export default function SignUp(){
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const { singUp, loadingAuth } = useContext(AuthContext);

    async function handleSubmit(e){
        e.preventDefault();
        if(nome !== '' && email !== '' && senha !== ''){
            await singUp(email, senha, nome);
        };
    }

    return(
        <div className='container-center'>
            <div className='login-area'>
                    <img src={logo} alt='Logo do sistema de chamados'/>
            </div>
            <div className='login'>
                

                <form onSubmit={handleSubmit}>
                    <h1>Nova conta</h1>
                    <input type='text' placeholder='Seu nome' 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    />
                    
                    <input type='email' placeholder='email@email.com' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <input type='password' placeholder='******' 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    />

                    <button type='submit'>{loadingAuth ? 'Caregando...' : 'Cadastrar'}</button>
                </form>
                <Link to='/'>Já possui uma conta? Faça login</Link>
                
            </div>
        </div>
    );
}