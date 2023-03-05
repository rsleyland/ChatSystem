import { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Header } from '../components/navigation/Header.js';


const Dashboard = () => {
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {if (!userInfo) navigate('/login')}, [userInfo]);

    return (
        
        <Container fluid className="bg-dark min-vh-100">
            <Header />
            <h1 className="text-white">Dashboard</h1>
            <p className="text-white">Welcome </p>
        </Container>
    );
}

export { Dashboard };