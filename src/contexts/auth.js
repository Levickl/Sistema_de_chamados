import {useState, useEffect, createContext } from 'react';
import {auth, db} from '../services/firebaseConnection';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {doc, getDoc, setDoc} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider( {children} ){
    const [user, setUser] = useState({});
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();


    useEffect(()=> {
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
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [])

    //Deslogar
    async function logout() {
        await signOut(auth);
        setUser(null);
    }

    //Logar usuario
    async function signIn(email, password){
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then(async (value) => {
            let uid = value.user.uid;
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef)

            let data = {
                uid: uid,
                avatarUrl: docSnap.data().avatarUrl,
                nome: docSnap.data().nome,
                email: value.user.email,
                
            };
            setUser(data);
            setLoadingAuth(false);
            toast.success(`Bem-vindo(a) novamente ${data.nome}!`);
            navigate('/dashboard');
        }).catch((error) => {
            console.log(error);
            
            setLoadingAuth(false);
            toast.error("Ops! Algo deu errado.");            
        });
    }

    //Cadastrar usuario
    async function singUp(email, password, name){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value) => {
            let uid = value.user.uid;
            await setDoc(doc(db, 'users', uid), {
                nome: name,
                avatarUrl: null
            })
            .then(() => {
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email
                };

                setUser(data);
                setLoadingAuth(false);
                toast.success(`Bem-vindo(a) ${data.nome}!`);
                navigate('/dashboard');
            })
        })
        .catch((error) => {
            console.log(error);
            switch(error.code){
                case "auth/too-many-requests":
                    toast.error("Muitas tentativas! Tente novamente mais tarde.");
                    break;
                default:
                    toast.error("Ops! Algo deu errado.");
            }
            setLoadingAuth(false);
        });
    }

    return(
        <AuthContext.Provider value={{
            signed: user, 
            user, 
            signIn, 
            singUp,
            logout,
            setUser,
            loadingAuth
            }}>
                {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;