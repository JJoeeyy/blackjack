import './App.css';
import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import Firebase from "firebase";

export default function NewCredits() {

    const [cardDeck, setCardDeck] = useState({})

    useEffect(() => {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setCardDeck(data))
    }, [])

    const btHandler = () => {
        Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
            .get()
            .then(snapshot => {
                Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
                    .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
                    .update( {
                        credit: parseInt(snapshot.val()?.credit) + 50,
                        debts: parseInt(snapshot.val()?.debts) + 50
                    })
            })
    }

    return (
        <div>
            <h1>New Credits</h1>
            <br/>
            <br/>
            <Button variant={"primary"} onClick={btHandler}>get new Credits</Button>
        </div>
    );
}
