import {BrowserRouter as Router, Link, Route, useHistory, useParams} from 'react-router-dom';
import './Header.css';
import NewCredits from "./NewCredits";
import Firebase from "firebase";
import {Redirect} from 'react-router-dom'
import UeberUnter7 from "./ueberUnter7";
import {Button, CardDeck} from "react-bootstrap";
import Login from "./Login";
import Account from "./Account";
import BlackJack from "./BlackJack";
import DeckCard from "./deckCard";

export default function CardProject() {
    let history = useHistory()

    Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
        .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
        .get()
        .then(snapshot => {
            Firebase.app().database('https://cardproject-e6ad3-default-rtdb.europe-west1.firebasedatabase.app/')
                .ref(`users/${Firebase.app().auth().currentUser?.uid}`)
                .update( {
                    credit: parseInt(snapshot.val()?.credit)? parseInt(snapshot.val()?.credit): 50,
                    debts: parseInt(snapshot.val()?.debts)? parseInt(snapshot.val()?.debts): 0
                })
        })

    const Home = () => (
        <div>
            <h2>Home</h2>
            <br/>
            <br/>
            <Button onClick={() => history.push('/login')}>Login</Button>
            <br/>
            <br/>
            <Button onClick={() => history.push('/signup')}>Sign up</Button>
        </div>
    );

    const HeaderLink = ({ page }, props) => {
        const title = page.charAt(0).toUpperCase() + page.slice(1);
        return <Link to={`/${page}`} className='headerlink-title'>
            {title}
            <div className={props.selected ? 'headerlink-dot-active' : 'headerlink-dot'}>•</div>
        </Link>;
    };

    const Header = () => {
        const page = useParams().page || 'home';

        return (
            <div className='header'>
                <HeaderLink page='home' selected={page === 'home'} />
                <HeaderLink page='carddeck' selected={page === 'carddeck'} />
                <HeaderLink page='blackjack' selected={page === 'blackjack'} />
                <HeaderLink page='ueberunter7' selected={page === 'ueberunter7'} />
                <HeaderLink page='newcredits' selected={page === 'newcredits'} />
                <HeaderLink page='account' selected={page === 'account'} />
            </div>
        );
    };

    return (
        <div className='App'>
            <Router>
                <Route path='/:page' component={Header} />
                <Route exact path='/cardproject' component={Home} />

                <Route exact path='/' component={Home} />
                <Route exact path='/home' component={Home} />
                <Route exact path='/carddeck' component={DeckCard} />
                <Route exact path='/blackjack' component={BlackJack} />
                <Route exact path='/ueberunter7' component={UeberUnter7} />
                <Route exact path='/newcredits' component={NewCredits} />
                <Route exact path='/account' component={Account} />
            </Router>
            {
                !Firebase.app().auth().currentUser && <Redirect to={"/login"}/>
            }
        </div>
    );
}
