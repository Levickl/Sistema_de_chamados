import {useContext, useState} from 'react';
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiSettings, FiUpload } from "react-icons/fi";
import avatar from '../../assets/avatar.png'
import { AuthContext } from "../../contexts/auth"; 
import './style.css'
import { toast } from 'react-toastify';

import {db, storage } from '../../services/firebaseConnection'
import { doc, updateDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile(){

    const {user, setUser, logout} = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);

    const [imageAvatar, setImageAvatar] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

    
    function handleFile(e){
        if (e.target.files[0]){
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            }else{
                alert('Envie uma imagem do tipo PNG ou JPEG');
                setImageAvatar(null);
                return;
            }
        } 
    }

    async function handleUpload() {
        const currentUid = user.uid;
        const uploadRef = ref(storage, `images/${currentUid}/imagem_perfil`)

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then( async (donwloadURL)=>{
                let urlFoto = donwloadURL;

                const docRef = doc(db, 'users', user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome,
                })
                .then(()=>{
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto,
                    }

                    setUser(data);
                    
                })
            })
        })
        await toast.promise(uploadTask, {
            pending: "Atualizando dados...",
            success: "Atualizado com sucesso! 🎉",
            error: (error) => `Erro ao atualizar 😢 ${error.message}`,
        });
    }

    async function handleSubmit(e){
        e.preventDefault();
        
        if(imageAvatar === null && nome !== ''){
            //Atualizar apenas o nome
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, {
                nome: nome,
            })
            .then(() => {
                let data ={
                    ...user,
                    nome: nome,
                }               
                setUser(data);
                toast.success("Atualizado com sucesso!")
            })
            .catch((error)=>{
                console.log(error);
            })
        }else if( imageAvatar !== null && nome !== '' ){
            //Atualizar o nome e a foto
            handleUpload();
        }
    }
    return(
        <div>
            
            <Header />
            
            <div className="content">
                <Title name={'Minha conta'}>
                    <FiSettings size={25}/>
                </Title>
            
                <div className="container">
                    <form className="form-profile" onSubmit={handleSubmit}>

                        <label className="label-avatar">
                            <span>
                                <FiUpload color="white" size={25}/>
                        
                            </span>

                            <input type='file' accept="image/*" onChange={handleFile}/> <br/>
                            {avatarUrl === null ? (
                                <img src={avatar} alt='foto de perfil' width={250} height={250}/>
                            ) : (
                                <img src={avatarUrl} alt='foto de perfil' width={250} height={250}/>
                            )}

                        </label>
                        
                        <label>Nome</label>
                        <input type='text' placeholder='Seu nome' value={nome} onChange={(e) => setNome(e.target.value) }/>
                        <label>Email</label>
                        <input type='text' placeholder='nome@email.com' disabled={true} value={email} />

                        <button type='submit'>Salvar</button>

                       

                    
                    </form>
                </div>
                <div className='container'>
                    <button className='logout-btn' onClick={() => logout()}>Sair</button>
                </div>
                 
            </div> 
            
        </div>  
    )
}