import { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Header } from '../components/navigation/Header.js';
import { Messenger } from "./Messenger.page"
import { MessengerProvider } from '../components/messenger/MessengerProvider'


const Dashboard = () => {
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => { if (!userInfo) navigate('/login') }, [userInfo]);

    return (

        <Container fluid className="bg-dark min-vh-100 p-0">
            {userInfo && <>
                <MessengerProvider />
                <Header />
                <Messenger /></>}
        </Container>
    );
}

export { Dashboard };