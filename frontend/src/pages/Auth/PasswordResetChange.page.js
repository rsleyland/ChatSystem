import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { resetPasswordChange } from "../../redux/actions/userActions";
import { Form, Container, Col, Button, Stack } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../../components/LoadingOverlay.js";
import { useParams } from "react-router-dom";

const PasswordResetChange = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const { code } = useParams();
    const userResetPasswordChange = useSelector(state => state.userResetPasswordChange);
    const { success, loading, error } = userResetPasswordChange;

    useEffect(() => {
        if (userInfo) navigate('/dashboard');
    }, [userInfo]);

    useEffect(() => {
        if (error) console.log(error);
    }, [error]);

    useEffect(() => {
        if (success) 
        setTimeout(() => {
            navigate('/login');
        }, 1500);
    }, [success]);


    const handleSubmit = (e) => {
        e.preventDefault();
        let email = e.target?.email?.value;
        let password = e.target?.password?.value;
        let password_confirm = e.target?.password_confirm?.value;
        if (!email || !password || !password_confirm) return console.log("ERROR - missing fields");
        if (password !== password_confirm) return console.log("ERROR - passwords do not match");
        dispatch(resetPasswordChange(email, code, password));
    }

    return (
        <Container fluid className="d-flex bg-dark min-vh-100 justify-content-center align-items-center">
            <LoadingOverlay loading={loading} />
            <Container className="d-flex justify-content-center">
                <Col xs={12} md={8} lg={6} xl={5} className="bg-light rounded p-4">
                    <h3 className="mb-3">Password Reset</h3>
                    {success ? <><p>Your password has been changed.</p><p>Redirecting...</p></>:
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" />
                        </Form.Group>
                        <Form.Group controlId="password_confirm">
                            <Form.Label>Password Confirm</Form.Label>
                            <Form.Control type="password" placeholder="Confirm password" />
                        </Form.Group>
                        <Stack direction="horizontal" className="justify-content-center my-3 mt-4">
                            <Button type="submit" className="w-50">Submit</Button>
                        </Stack>
                    </Form>}
                </Col>
            </Container>
        </Container>
    )
}
        
export { PasswordResetChange };