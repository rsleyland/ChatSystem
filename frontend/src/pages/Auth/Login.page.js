import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { login } from "../../redux/actions/userActions";
import { Form, Container, Col, Button, Stack } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../../components/LoadingOverlay.js";
import { LinkContainer } from 'react-router-bootstrap';
import { InputWithIcon } from '../../components/InputWithIcon.js';


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo, loading, error } = userLogin;
    const [passwordToggle, setPasswordToggle] = useState(true);

    const [inputErrors, setInputErrors] = useState({
        email: false,
        password: false,
    });
    const [inputValues, setInputValues] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        if (userInfo) navigate('/dashboard');
    }, [userInfo]);

    useEffect(() => {
        if (error) console.log(error);
    }, [error]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const inputErrorsFound = validateInputs()
        if (inputErrorsFound) return;
        let email = inputValues['email'];
        let password = inputValues['password'];
        if (!email || !password) return;
        if (email.length > 0 && password.length > 0) {
            dispatch(login(email, password));
        }
    }

    const validateInputs = () => {
        let isErrors = false;
        setInputErrors({ email: false, password: false });
        // Check if any of the inputValues are empty
        for (let val in inputValues) {
            if (inputValues[val].length === 0) {
                setInputErrors((prev) => ({
                    ...prev,
                    [val]: "Please enter your " + val[0].toUpperCase() + val.substring(1),
                }));
                isErrors = true;
            }
        }
        // Email validation
        if (inputValues.email) {
            if (!inputValues.email.includes("@")) {
                setInputErrors((prev) => ({
                    ...prev,
                    email: " Incorrect Format, missing '@'",
                }));
                isErrors = true;
            } else {
                let emailSplit = inputValues.email.split("@");
                if (emailSplit[0] && !emailSplit[0].length) {
                    setInputErrors((prev) => ({
                        ...prev,
                        email: " Incorrect Format, no text before '@'",
                    }));
                    isErrors = true;
                } else if (!emailSplit[1].length) {
                    setInputErrors((prev) => ({
                        ...prev,
                        email: " Incorrect Format, no text after '@'",
                    }));
                    isErrors = true;
                } else if (!emailSplit[1].includes(".")) {
                    setInputErrors((prev) => ({
                        ...prev,
                        email: " Incorrect Format, missing '.' after '@'",
                    }));
                    isErrors = true;
                } else {
                    emailSplit = emailSplit[1].split(".");
                    if (!emailSplit[0].length) {
                        setInputErrors((prev) => ({
                            ...prev,
                            email: " Incorrect Format, no text between '@' and '.'",
                        }));
                        isErrors = true;
                    } else if (!emailSplit[1].length) {
                        setInputErrors((prev) => ({
                            ...prev,
                            email: " Incorrect Format, no text after '.'",
                        }));
                        isErrors = true;
                    }
                }
            }
        }
        // Password validation
        if (inputValues.password) {
            if (inputValues.password.length < 6) {
                setInputErrors((prev) => ({
                    ...prev,
                    password: " Password must be at least 6 characters",
                }));
                isErrors = true;
            } else {
                // eslint-disable-next-line
                let specialChars = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
                if (!specialChars.test(inputValues.password)) {
                    setInputErrors((prev) => ({
                        ...prev,
                        password: " Password must contain at least one special character",
                    }));
                    isErrors = true;
                }
            }
        }
        return isErrors;
    }



    return (
        <Container fluid className="d-flex bg-dark min-vh-100 justify-content-center align-items-center">
            <LoadingOverlay loading={loading} />
            <Container className="d-flex justify-content-center">
                <Col xs={12} md={8} lg={6} xl={5} className="bg-light rounded p-4">
                    <h3 className="mb-3">Login</h3>
                    <Form onSubmit={handleSubmit}>
                        <InputWithIcon
                            icon="fas fa-envelope"
                            name="email"
                            placeholder="Email *"
                            setInputValues={setInputValues}
                            type="email"
                            error={inputErrors.email}
                            autoFocus={true}
                        />
                        <InputWithIcon
                            onClick={() => setPasswordToggle((p) => !p)}
                            icon={"password fas " + (passwordToggle ? "fa-eye" : "fa-eye-slash")}
                            name="password"
                            placeholder="Password *"
                            setInputValues={setInputValues}
                            type={passwordToggle ? "password" : "text"}
                            error={inputErrors.password}
                        />
                        <Stack direction="horizontal" className="justify-content-center my-3">
                            <Button type="submit" className="w-75">Login</Button>
                        </Stack>
                        <Stack direction="horizontal" className="justify-content-between my-3">
                            <LinkContainer to="/register" role={'button'}>
                                <small>Don't have an account? Register</small>
                            </LinkContainer>
                            <LinkContainer to="/reset-password" role={'button'}>
                                <small>Forgot password?</small>
                            </LinkContainer>
                        </Stack>
                        {error && <div className="d-flex justify-content-center"><Button variant="danger" className="w-75">{error.error}</Button></div>}
                    </Form>
                </Col>
            </Container>


        </Container>
    )
}

export { Login }