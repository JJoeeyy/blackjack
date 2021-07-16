import './App.css';
import {useEffect, useState} from "react";
import Firebase from "firebase";
import {Button} from "react-bootstrap";

export default function Account() {

    const [credits, setCredits] = useState(0);
    const [eMail, setEMail] = useState(0);
    const [debt, setDebt] = useState(0);
    const [m, setM] = useState("");

    useEffect(() => {
        Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
            .on("value", (snapshot) => {
                setCredits(snapshot.val()?.credit)
                setEMail(Firebase.app().auth().currentUser?.email)
                setDebt(snapshot.val()?.debts)
            })
    }, [])

    function payDebts(number) {
        if (credits > number){
            if(debt - number >= 0){
                setM("")
                Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
                    .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
                    .update({
                        credit: credits - number,
                        debts: debt - number
                    })
            } else {
                setM("too little debts")
            }
        } else {
            setM("too little Credits")
        }
    }

    return (
        <div>
            <h1>Your Account</h1>
            <br/>
            <h3>Credits: {credits}</h3>
            <br/>
            <h3>E-Mail: {eMail}</h3>
            <br/>
            <h3>Debts: {debt}</h3>
            <br/>
            <br/>
            <h4>{m}</h4>
            <br/>
            <Button onClick={() => payDebts(50)}>Pay 50 debts</Button>
            <br/><br/>
            <Button onClick={() => payDebts(20)}>Pay 20 debts</Button>
            <br/><br/>
            <Button onClick={() => payDebts(10)}>Pay 10 debts</Button>
            <br/><br/>
            <Button onClick={() => payDebts(1)}>Pay 1 debt</Button>

        </div>
    );
}
