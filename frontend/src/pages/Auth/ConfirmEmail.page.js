import axios from "axios";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";


const ConfirmEmail = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (code) {
            axios.post(`/api/account/confirm-email/${code}/`).then((response) => {
                console.log(response);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            })
                .catch((error) => {
                    console.log(error.response);
                });
        }
    }, [code]);


    return (
        <Container fluid className="d-flex bg-dark min-vh-100 justify-content-center align-items-center">
            <h3 className="text-white">Your email address is now confirmed.</h3><br/>
            <p className="text-white">You will be redirected to the login page in 3 seconds.</p>
        </Container>
    );
}

export { ConfirmEmail };