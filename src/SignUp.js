import './App.css'
import {useState} from "react";
import Firebase from "firebase";
import {useHistory} from "react-router-dom";

export default function SignUp() {
    const [eMail, setEMail] = useState()
    const [password, setPassword] = useState()
    const [password2, setPassword2] = useState()

    const history = useHistory()

    function checkPassword() {
        if (password === password2) {
            Firebase.auth()
                .createUserWithEmailAndPassword(eMail, password)
                .then(() => Firebase.auth().signInWithEmailAndPassword(eMail, password).then(() => history.push('/cardproject')))
                .catch(error => console.error("could not create user: ", error))
        } else {
            console.log('Passwort stimmt nicht über ein')
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <br/>
            <h4>E-Mail</h4>
            <input onChange={e => setEMail(e.target.value)}/>
            <br/>
            <h4>Passwort</h4>
            <input type="password" name="password" onChange={e => setPassword(e.target.value)}/>
            <h4>Passwort bestätigen</h4>
            <input type="password" name="password" onChange={e => setPassword2(e.target.value)}/>
            <br/>
            <br/>
            <button onClick={checkPassword}>Sign Up</button>
            <br/>
            <br/>
            <button onClick={() => history.push('/start')}>Start</button>
        </div>
    );
}
