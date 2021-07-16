import './App.css';
import {useEffect, useState} from "react";
import {Button, Toast} from "react-bootstrap";
import Firebase from "firebase";
import * as NumericInput from "react-numeric-input";

export default function UeberUnter7() {
    const [restartButtonDisable, setRestartButtonDisable] = useState(true)
    const [finish, setFinish] = useState('')

    const [creditUser, setCreditUser] = useState(0)
    const [einsatz, setEinsatz] = useState(1)
    const [drawButtonDisable, setDrawButtonDisable] = useState(false)
    const [einsatzDisable, setEinsatzDisable] = useState(false)
    const [allInButtonDisable, setAllInButtonDisable] = useState(false)
    let wuerfel1a = 0
    let wuerfel2a = 0
    const [wuerfel1, setWuerfel1] = useState(0)
    const [wuerfel2, setWuerfel2] = useState(0)

    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);


    useEffect(() => {
        Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
            .on("value", (snapshot) => {
                setCreditUser( parseInt(snapshot.val()?.credit))
            })
    }, [])

    const btHandler = (number) => {
        setEinsatzDisable(true)
        setDrawButtonDisable(true)
        setAllInButtonDisable(true)
        wuerfel1a = Math.floor(Math.random() * 5 + 1)
        wuerfel2a = Math.floor(Math.random() * 5 + 1)
        setWuerfel1(wuerfel2a)
        setWuerfel2(wuerfel1a)

        if ((number === 6 && wuerfel1a + wuerfel2a < 7) || (number === 8 && wuerfel2a + wuerfel1a > 7)){
            finishGame('You Won', einsatz)
        } else if (number === 7 && wuerfel1a + wuerfel2a === 7){
            finishGame('You Won', einsatz * 3)
        } else{
            finishGame('You Lose', -einsatz)
        }
    }

    function finishGame(m, n) {
        setFinish(m)
        setRestartButtonDisable(false)
        Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
            .on("value", (snapshot) => {
                setCreditUser( creditUser + n)
            })

        Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
            .update({
                credit: creditUser + n
            })
    }

    function restartBtHandler() {

        if (creditUser > 0){
            setEinsatz(1)
            setEinsatzDisable(false)
            setDrawButtonDisable(false)
            setAllInButtonDisable(false)
            setRestartButtonDisable(true)
            setFinish('')
        } else {
            setEinsatz(1)
            setEinsatzDisable(true)
            setDrawButtonDisable(false)
            setAllInButtonDisable(false)
            setRestartButtonDisable(true)
            toggleShowA()
        }
    }

    return (
        <div>
            <Toast show={showA} onClose={toggleShowA} animation={true}>
                <Toast.Header>
                    <strong>No Credits</strong>
                </Toast.Header>
                <Toast.Body>You don't have any Credits now, go and get some new Credits!</Toast.Body>
            </Toast>
            <h1>Over-Under 7</h1>
            <br/>
            <h3>Stake</h3>
            <NumericInput step={1} value={einsatz} disabled={einsatzDisable} strict={true} max={creditUser} min={1} onChange={e => setEinsatz(parseInt(e))}/>
            <Button variant={"danger"} onClick={() => setEinsatz(creditUser)} disabled={allInButtonDisable}>All in</Button>

            <br/>
            <br/>
            <Button variant={"primary"} onClick={() => btHandler(6)} disabled={drawButtonDisable}>under 7</Button>
            <> </>
            <Button variant={"primary"} onClick={() => btHandler(7)} disabled={drawButtonDisable}>7</Button>
            <> </>
            <Button variant={"primary"} onClick={() => btHandler(8)} disabled={drawButtonDisable}>over 7</Button>
            <br/>
            <br/>
            Würfel 1: {wuerfel1}  Würfel 2: {wuerfel2}
            <br/>
            <br/>
            <h3>{finish}</h3>
            <br/>
            <br/>
            <Button variant={"primary"} onClick={restartBtHandler} disabled={restartButtonDisable}>Again</Button>
        </div>
    );
}
