import './App.css'
import {useEffect, useState} from "react";
import Firebase from "firebase";
import {Link, NavLink, useHistory} from "react-router-dom";
import SignUp from "./SignUp";

export default function Login() {
    const [eMail, setEMail] = useState()
    const [password, setPassword] = useState()
    const [firebase, setFirebase] = useState()

    const history = useHistory();
    function buttonPressed() {
        if (eMail !== null && password !== null) {
            Firebase.auth()
                .signInWithEmailAndPassword(eMail, password)
                .then(() => history.push('/cardproject'))
                .catch(error => console.error("could not create user: ", error))
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <br/>
            <h4>E-Mail</h4>
            <input onChange={e => setEMail(e.target.value)}/>
            <br/>
            <h4>Passwort</h4>
            <input type="password" name="password" onChange={e => setPassword(e.target.value)}/>
            <br/>
            <button onClick={buttonPressed}>login</button>
            <br/>
            <br/>
            <button onClick={() => history.push('/start')}>Start</button>
        </div>
    );
}
