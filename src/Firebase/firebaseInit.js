import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import {useEffect, useState} from 'react';
import results from '../Components/Results/Results';
import {setUser, setUserInDatabase} from '../Redux/user';

const firebaseConfig = {
    apiKey: "AIzaSyA9qTflWVdIkz_tYLf_H0Zj1b7UqHWlCQc",
    authDomain: "typus-69ddd.firebaseapp.com",
    databaseURL: "https://typus-69ddd-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "typus-69ddd",
    storageBucket: "typus-69ddd.appspot.com",
    messagingSenderId: "347165463317",
    appId: "1:347165463317:web:eca71dd710d678d9d58f1c"
};


firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const database = firebase.database();

export function setPositionOfCursorInDatabase(room, curLine, curPosition) {
    if (room === 'testRoom'||!room) return
    database.ref(room + '/users/' + auth.currentUser.uid).update({
        curLine,
        curPosition
    })
}

export function setUserInRoom(room, name) {
    if (room === 'testRoom'||!room) return
    database.ref(room + '/users/' + auth.currentUser.uid).set({
        name: name,
        curLine: 0,
        curPosition: 0
    })
}

export function useUsersFromDatabase(roomId,myName) {
    const [users, setUsers] = useState([])
    useEffect(() => {
        setTimeout(() => {


            const arr = users
            const ref = database.ref(roomId + '/users');
            ref.once('value', (snapshot) => {
                const obj = snapshot.val()
                for (let id in obj) {
                    arr.push(obj[id])
                }
                console.log(arr)
                setUsers(arr)
            });

            ref.on('child_changed', (snapshot) => {
                const arr = users


                const obj = snapshot.val()
                if(obj.name === myName)return
                const oldObj = arr.find(el => el.name === obj.name)
                console.group()
                console.log(arr)
                console.log(oldObj)

                if (oldObj) {
                    arr[arr.indexOf(oldObj)] = obj
                } else {
                    arr.push(obj)
                }
                console.log(arr)
                console.groupEnd()

                setUsers(arr)
            });
        }, 200)

    }, [roomId])
    return users

}

export function setResultsInDatabase(room, name, userId, charPerMinute, PercentageOfRight, ball) {
    database.ref(room + '/results').push().set({
        name,
        charPerMinute,
        PercentageOfRight,
        ball,
    });
}

export function useResultsFromDatabase(roomId) {
    const [results, setResults] = useState([])

    useEffect(() => {
        const ref = database.ref(roomId + '/results');
        ref.once('value', (snapshot) => {
            const res = [...results]

            const obj = snapshot.val()
            for (let id in obj) {
                res.push(obj[id])
            }
            setResults(res)
        });

    }, [])
    return results
}


export function clearResultsInDatabase(room) {
    database.ref(room + '/results').remove();
}

export function clearUsersInRoom(roomId) {
    database.ref(roomId + '/users').remove();
}

// export function useResultsFromDatabase(room) {
//     const [results,setResults] = useState([])
//
//     useEffect(()=>{
//         const res = []
//         const ref = database.ref(room + '/results');
//         ref.once('value', (snapshot) => {
//             const obj = snapshot.val()
//             for(let id in obj){
//                 res.push(obj[id])
//             }
//             setResults(res)
//         });
//     },[])
//
//
//     return results
//
// }

// export function useData(collection){
//     const [state, setState] = useState([])
//     useEffect(() => onSnapshot(firestore.collection(collection), (snapshot) => {
//         setState(snapshot.docs.map((doc)=>({...doc.data(),id:doc.id})))
//     }), [])
//     return state
// }
// export function createNewRoomCollection(roomId) {
//     firestore.collection(roomId).doc('roomSettings').set({
//         roomId
//     })
// }
export const signInWithGoogle = async () => {

}
