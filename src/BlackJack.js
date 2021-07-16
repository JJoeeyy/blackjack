import './App.css';
import {useEffect, useState} from "react";
import Firebase from "firebase";
import * as NumericInput from "react-numeric-input";
import {Button, Spinner, Toast} from "react-bootstrap";

export default function BlackJack() {

    const [cardDeck, setCardDeck] = useState({})
    const [drawnCard, setDrawnCard] = useState()
    const [drawButtonDisable, setDrawButtonDisable] = useState(false)
    const [finishButtonDisable, setFinishButtonDisable] = useState(false)
    const [restartButtonDisable, setRestartButtonDisable] = useState(true)
    const [allInButtonDisable, setAllInButtonDisable] = useState(false)
    const [score, setScore] = useState(0)
    const scoreDealer = Math.floor(Math.random() * 6 + 17)
    const [finish, setFinish] = useState('')

    const [creditUser, setCreditUser] = useState(0)
    const [einsatz, setEinsatz] = useState(1)
    const [einsatzDisable, setEinsatzDisable] = useState(false)
    const [spinnerCard, setSpinnerCard] = useState(true)

    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);

    useEffect(() => {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2')
            .then(response => response.json())
            .then(data => setCardDeck(data))
        Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
            .on("value", (snapshot) => {
                setCreditUser( parseInt(snapshot.val()?.credit))
            })
    }, [])

    const btHandler = () => {
        setEinsatzDisable(true)
        setAllInButtonDisable(true)

        setSpinnerCard(false)

        fetch(`https://deckofcardsapi.com/api/deck/${cardDeck.deck_id}/draw/?count=1`)
            .then(response => {
                if (response.status === 200) {
                    response.json()
                        .then(data => {
                            setDrawnCard(data)
                            setDrawButtonDisable(false)
                            let cardValue;
                            let value = data.cards[0].value
                            setSpinnerCard(true)

                            if (value === 'KING' || value === 'QUEEN' || value === 'JACK') {
                                cardValue = 10
                            } else if (value === 'ACE') {
                                if (score + 11 > 21) {
                                    cardValue = 1
                                } else {
                                    cardValue = 11
                                }
                            } else {
                                cardValue = value;
                            }
                            setScore(score + parseInt(cardValue))
                            if (score + parseInt(cardValue) > 21) {
                                finishGame('You Lose', -einsatz)
                            }
                        })
                } else {
                    setDrawButtonDisable(false)
                    setSpinnerCard(true)
                }
            })

        setDrawButtonDisable(true)

    }

    function finishBtHandler() {
        if (score > scoreDealer || (scoreDealer > 21 && score <= 21)) {
            finishGame('You Win', einsatz)
        } else {
            finishGame('You Lose', -einsatz)
        }
    }

    function finishGame(m, n) {
        setFinish(m)
        setDrawButtonDisable(true)
        setFinishButtonDisable(true)
        setRestartButtonDisable(false)

        console.log(scoreDealer)

        Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
            .on("value", (snapshot) => {
                setCreditUser( creditUser + n)
            })

        Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
            .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
            .update({
                credit: creditUser + n,
            })
    }

    function restartBtHandler() {

        if (creditUser > 0){
            setEinsatz(1)
            setEinsatzDisable(false)
            setAllInButtonDisable(false)
            setFinishButtonDisable(false)
            setDrawButtonDisable(false)
            setRestartButtonDisable(true)
            setScore(0)
            setDrawnCard(null)
            setFinish('')
            fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2')
                .then(response => response.json())
                .then(data => setCardDeck(data))
        } else {
            setEinsatz(1)
            setEinsatzDisable(true)
            setAllInButtonDisable(true)
            setFinishButtonDisable(true)
            setDrawButtonDisable(true)
            setRestartButtonDisable(true)
            setScore(0)
            setDrawnCard(null)
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
            <h1>Black Jack</h1>
            <br/>
            <h3>Stake</h3>
            <NumericInput step={1} value={einsatz} disabled={einsatzDisable} strict={true} max={creditUser} min={1} onChange={e => setEinsatz(parseInt(e))}/>
            <Button variant={"danger"} onClick={() => setEinsatz(creditUser)} disabled={allInButtonDisable}>All in</Button>
            <br/>
            <br/>
            <Button variant={"primary"} onClick={btHandler} disabled={drawButtonDisable}>take a Card</Button>
            <br/>
            <br/>
            <Spinner animation="border" hidden={spinnerCard}/>
            <br/>
            {drawnCard ? drawnCard.cards.map((card, index) => <img key={index} src={card.image} alt={card.code}
                                                                   width={"140px"}
                                                                   length={"auto"}/>) : "no Card taken"}
            <br/>
            <br/>
            <Button variant={"primary"} onClick={finishBtHandler} disabled={finishButtonDisable}>finish</Button>
            <br/>
            Score: {score}
            <br/>
            <br/>
            <h3>{finish}</h3>
            <br/>
            <br/>
            <br/>
            <Button variant={"primary"} onClick={restartBtHandler} disabled={restartButtonDisable}>Again</Button>
        </div>
    );
}
