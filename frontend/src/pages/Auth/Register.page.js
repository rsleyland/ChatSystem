import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { register } from "../../redux/actions/userActions";
import { Form, Container, Col, Button, Stack } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../../components/LoadingOverlay.js";
import { LinkContainer } from 'react-router-bootstrap';
import { InputWithIcon } from '../../components/InputWithIcon.js';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRegister = useSelector(state => state.userRegister);
    const { success, loading, error } = userRegister;
    const [passwordToggle, setPasswordToggle] = useState(true);
    const [confirmPasswordToggle, setConfirmPasswordToggle] = useState(true);

    const [inputErrors, setInputErrors] = useState({
        email: false,
        password: false,
        password_confirm: false,
        first_name: false,
        last_name: false
    });
    const [inputValues, setInputValues] = useState({
        email: "",
        password: "",
        password_confirm: "",
        first_name: "",
        last_name: ""
    });


    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch({ type: 'USER_REGISTER_CLEAR' });
                navigate('/login');
            }, 4000);
        }
    }, [success]);

    useEffect(() => {
        if (error) console.log(error);
    }, [error]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const inputErrorsFound = validateInputs()
        if (inputErrorsFound) return;
        let email = inputValues.email;
        let password = inputValues.password;
        let password_confirm = inputValues.password_confirm;
        let first_name = inputValues.first_name;
        let last_name = inputValues.last_name;
        if (!email || !password || !password_confirm || !first_name) return;
        if (email.length > 0 && password.length > 0 && first_name.length > 0 && password === password_confirm) {
            dispatch(register(email, password, first_name, last_name));
        }
    }

    const validateInputs = () => {
        let isErrors = false;
        setInputErrors({ email: false, password: false });
        // Check if any of the inputValues are empty
        for (let val in inputValues) {
            if (inputValues[val].length === 0) {
                let value = val.replace('_', ' ');
                setInputErrors((prev) => ({
                    ...prev,
                    [val]: " Required",
                }));
                isErrors = true;
            }
        }
        // Password confirm validation
        if (inputValues.password_confirm !== inputValues.password) {
            setInputErrors((prev) => ({
                ...prev,
                password_confirm: " Passwords do not match",
            }));
            isErrors = true;
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
        return isErrors;
    }


    return (
        <Container fluid className="d-flex bg-dark min-vh-100 justify-content-center align-items-center">
            <LoadingOverlay loading={loading} />
            <Container className="d-flex justify-content-center">
                <Col xs={12} md={8} lg={6} xl={5} className="bg-light rounded p-4">
                    <h3 className="mb-3">Register</h3>
                    {success ? <p className="text-success">Please follow the instructions in the email we just sent you in order to verify your email address.</p> : 
                    <Form onSubmit={handleSubmit} noValidate>
                        <Stack direction="horizontal" className="justify-content-between my-2">
                            <InputWithIcon
                                icon="fas fa-user"
                                name="first_name"
                                placeholder="First name *"
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.first_name}
                                autoFocus={true}
                            />
                            <InputWithIcon
                                icon="fas fa-user"
                                name="last_name"
                                placeholder="Last name *"
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.last_name}
                                autoFocus={true}
                            />
                        </Stack>
                        <InputWithIcon
                            icon="fas fa-envelope"
                            name="email"
                            placeholder="Email *"
                            setInputValues={setInputValues}
                            type="email"
                            error={inputErrors.email}
                            autoFocus={true}
                        />
                        <Stack direction="horizontal" className="justify-content-between my-2">
                            <InputWithIcon
                                onClick={() => setPasswordToggle((p) => !p)}
                                icon={"password fas " + (passwordToggle ? "fa-eye" : "fa-eye-slash")}
                                name="password"
                                placeholder="Password *"
                                setInputValues={setInputValues}
                                type={passwordToggle ? "password" : "text"}
                                error={inputErrors.password}
                            />
                            <InputWithIcon
                                onClick={() => setConfirmPasswordToggle((p) => !p)}
                                icon={"password fas " + (confirmPasswordToggle ? "fa-eye" : "fa-eye-slash")}
                                name="password_confirm"
                                placeholder="Confirm Password *"
                                setInputValues={setInputValues}
                                type={confirmPasswordToggle ? "password" : "text"}
                                error={inputErrors.password_confirm}
                            />
                        </Stack>
                        <Stack direction="horizontal" className="justify-content-center my-3">
                            <Button type="submit" className="w-75">Register</Button>
                        </Stack>
                        <Stack direction="horizontal" className="justify-content-between my-3">
                            <LinkContainer to="/login" role={'button'}>
                                <small>Already have an account? Login</small>
                            </LinkContainer>
                        </Stack>
                        {error && Object.entries(error).map(([key, value]) => (
                            <div key={"error-"+key} className="d-flex justify-content-center"><Button variant="danger" className="w-75">{error[key]}</Button></div>))}
                    </Form>}
                </Col>
            </Container>
        </Container>
    );

}

export { Register };