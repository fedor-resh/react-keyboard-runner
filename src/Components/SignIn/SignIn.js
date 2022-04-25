import React, {useRef, useState} from 'react';
import s from './SignIn.module.css'
import {auth, database, signInWithGoogle} from '../../Firebase/firebaseInit';
import {useDispatch, useSelector} from 'react-redux';
import {setUser, setNewUser} from '../../Redux/user';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import Modal from '../../UI/Modal/Modal';
import {setThemeClass} from '../../utils';

const SignIn = () => {
    const [isAlreadyHaveAccount, setIsAlreadyHaveAccount] = useState(true)
    const email = useRef(null)
    const password = useRef(null)

    const dispatch = useDispatch()

    async function handleRegistration(result) {
        let user
        await database.ref('users/' + result.user.uid ).once('value', async snapshot => {
            user = await snapshot.val()
        })
        if (!user.name) {
            const name = prompt('name on english(max length 5): ')
            await dispatch(setNewUser(name))
        } else {
            setUser({
                user:user.name,
                id: result.user.uid,
                theme:user.theme
            })
        }
        console.log(user)

    }

    function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(handleRegistration)
            .catch(err => alert(err))
    }

    function handleSubmit() {
        if (isAlreadyHaveAccount) {
            auth.signInWithEmailAndPassword(email.current.value, password.current.value)
                .then(handleRegistration)
                .catch(() => alert('Account was not found'))
        } else {
            auth.createUserWithEmailAndPassword(email.current.value, password.current.value)
                .then(handleRegistration)
                .catch(() => alert('Account with this email already exist'))
        }
    }

    return (
        <div >
                <div className={s.modal}>
                    <center><h1>{isAlreadyHaveAccount?'enter':'create new account'}</h1></center>
                    <center><input placeholder={'email'} ref={email} type="email"/></center>
                    <center><input placeholder={'password'} ref={password} type='password'/></center>
                    <center><button onClick={handleSubmit}>submit</button></center>
                    <center>
                        <button onClick={isAlreadyHaveAccount
                            ?()=>setIsAlreadyHaveAccount(false)
                            :()=>setIsAlreadyHaveAccount(true)}>
                            {isAlreadyHaveAccount
                                ?'create new account'
                                :'already have account'}
                        </button>
                    </center>
                    <center>
                        <button onClick={signInWithGoogle}>
                            sign in with google
                        </button>
                    </center>
                </div>
            <div className={s.grid}>

            </div>
        </div>

    );
};

export default SignIn;