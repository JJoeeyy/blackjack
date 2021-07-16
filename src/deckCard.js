import './App.css';
import {useEffect, useRef, useState} from "react";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";

export default function DeckCard() {

    const [cardDeck, setCardDeck] = useState({})
    const [cards, setCards] = useState({remaining: 52})
    const [drawcards, setDrawCards] = useState([])
    const [drawButtonDisable, setDrawButtonDisable] = useState(false)
    const [spinnerCard, setSpinnerCard] = useState(true)

    useEffect(() => {
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            .then(response => response.json())
            .then(data => setCardDeck(data))
    }, [])

    const orderCards = (c1, c2) => {
        const order = (value) => ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'].indexOf(value)
        return order(c1.value) - order(c2.value)
    }

    const btHandler = () => {
        if (cardDeck && cards.remaining !== 0) {
            setSpinnerCard(false)
            fetch(`https://deckofcardsapi.com/api/deck/${cardDeck.deck_id}/draw/?count=1`)
                .then(response => {
                    if (response.status === 200) {
                        response.json()
                            .then(data => {
                                setSpinnerCard(true)
                                setCards(data)
                                setDrawCards([...drawcards, data.cards[0]])
                                setDrawButtonDisable(false)
                            })
                    } else {
                        setDrawButtonDisable(false)
                    }
                })

            setDrawButtonDisable(true)
        }
    }

    return (
        <div>
            <h1>Deck of Cards</h1>
            <Container>
                <Row>
                    <Col className="offset-4">
                        <Button variant={"secondary"} onClick={btHandler} disabled={drawButtonDisable}>
                            draw Card
                        </Button>
                    </Col>
                    <Col>
                        Bereits gezogene Karten: {52 - cards.remaining}
                    </Col>

                </Row>
            </Container>

            <Spinner animation="border" hidden={spinnerCard}/>
            <br/>
            <br/>
            {['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES']
                .map(group =>
                    <>
                        {drawcards
                            .filter(c => c.suit === group)
                            .sort(orderCards)
                            .map((card, index) =>
                                <img key={index} src={card.image} alt={card.code}
                                     width={"140px"} lenght={"auto"}/>
                            )}
                        <br/>
                    </>
                )}


        </div>
    );
}
