import './App.css'
import {useHistory} from "react-router-dom";
import Firebase from "firebase";
import {Button, Col, Container, Row} from "react-bootstrap";

const firebaseConfig = {
    apiKey: "AIzaSyDXTUzYFOYVqECboZGjY7j2DCw4V_-INcU",
    authDomain: "localhost",
    databaseURL: "https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/",
    storageBucket: "gs://cardproject-e6ad3.appspot.com"
}

Firebase.initializeApp(firebaseConfig);

export default function Start() {

    const history = useHistory()
    console.log(history)

    return (
    <div>
        <Container>
            <Row>
                <Col>
                    <h1>Haben sie bereits ein Konto?</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant={"secondary"} onClick={()=>history.push("/signup")}>Sign Up</Button>
                </Col>
                <Col>
                    <Button variant={"secondary"} onClick={()=>history.push("/login")}>Login</Button>
                </Col>
            </Row>
        </Container>
    </div>
);
}
