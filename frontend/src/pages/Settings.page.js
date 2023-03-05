import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUser, updateUserProfile } from '../redux/actions/userActions.js';
import { LoadingOverlay } from '../components/LoadingOverlay.js';
import { Button, Container, Col, Row, Stack, ListGroup } from "react-bootstrap";
import { Header } from '../components/navigation/Header.js';
import { InputWithIcon } from '../components/InputWithIcon.js'

const Settings = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [passwordToggle, setPasswordToggle] = useState(true);
    const [oldPasswordToggle, setOldPasswordToggle] = useState(true);
    const [passwordConfirmToggle, setPasswordConfirmToggle] = useState(true);
    const avatarRef = useRef(null);
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const userProfile = useSelector(state => state.userProfile);
    const { profileInfo, loading, error } = userProfile;
    const userUpdate = useSelector(state => state.userUpdate);
    const { success: updateSuccess, loading: updateLoading, error: updateError } = userUpdate;
    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success: updateProfileSuccess, loading: updateProfileLoading, error: updateProfileError } = userUpdateProfile;

    const [inputErrors, setInputErrors] = useState({
        email: false,
        password: false,
        password_confirm: false,
        old_password: false,
        first_name: false,
        last_name: false,
        phone: false,
        address: false,
        city: false,
        state: false,
        zip_code: false,
        country: false,
        avatar: false
    });
    const [inputValues, setInputValues] = useState({
        email: "",
        password: "",
        password_confirm: "",
        old_password: "",
        first_name: "",
        last_name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        avatar: null
    });

    useEffect(() => {
        if (!userInfo) return navigate('/login');
        setInputValues((prev) => ({
            email: userInfo.email,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name
        }));
        dispatch(getUserProfile());
    }, [userInfo, navigate]);

    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    useEffect(() => {
        if (profileInfo) {
            setInputValues((prev) => ({
                ...prev,
                phone: profileInfo.phone,
                address: profileInfo.address,
                city: profileInfo.city,
                state: profileInfo.state,
                zip_code: profileInfo.zip_code,
                country: profileInfo.country,
                avatar: profileInfo.image
            }));
        }
    }, [profileInfo]);

    useEffect(() => {
        if (updateError) {
            console.log(updateError);
        }
    }, [updateError]);

    useEffect(() => {
        if (updateProfileError) {
            console.log(updateProfileError);
        }
    }, [updateProfileError]);

    


    const handleUpdate = (e) => {
        e.preventDefault();
        // const inputErrorsFound = validateInputs();
        // if (inputErrorsFound) return;
        let email = inputValues.email;
        let password = inputValues.password;
        let password_confirm = inputValues.password_confirm;
        let old_password = inputValues.old_password;
        let first_name = inputValues.first_name;
        let last_name = inputValues.last_name;
        let phone = inputValues.phone;
        let address = inputValues.address;
        let city = inputValues.city;
        let state = inputValues.state;
        let zip_code = inputValues.zip_code;
        let country = inputValues.country;
        let avatar = inputValues.avatar;


        if (email !== userInfo.email || first_name !== userInfo.first_name || last_name !== userInfo.last_name ) {
            console.log('validate & update user');
            dispatch(updateUser({ email, first_name, last_name }));
        }
        if (phone !== profileInfo.phone || address !== profileInfo.address || city !== profileInfo.city || state !== profileInfo.state || zip_code !== profileInfo.zip_code || country !== profileInfo.country || avatarRef.current.files[0]) {
            console.log('validate & update profile');
            dispatch(updateUserProfile({ phone, address, city, state, zip_code, country, image:avatarRef.current.files[0] }));
        }
        if (password && password_confirm && old_password && password === password_confirm) {
            console.log('validate & update user password');
            dispatch(updateUser({ password, old_password }));
        }
    }

    const handleAvatarChange = () => {
        setInputValues((prev) => ({
            ...prev,
            ['avatar']: URL.createObjectURL(avatarRef.current.files[0])
        }));
    }



    return (
        <Container fluid className="bg-dark min-vh-100">
            <Header />
            <LoadingOverlay loading={loading} />
            <Row className="justify-content-evenly mt-3">
                <Col lg={2} className="d-none d-lg-block">
                    <ListGroup className="sticky-top">
                        <ListGroup.Item className="bg-dark border-0"><Button href="#account" variant='secondary' className="w-100">Account</Button></ListGroup.Item>
                        <ListGroup.Item className="bg-dark border-0"><Button href="#profile" variant='secondary' className="w-100">Profile</Button></ListGroup.Item>
                        <ListGroup.Item className="bg-dark border-0"><Button href="#passwords" variant='secondary' className="w-100">Password</Button></ListGroup.Item>
                        <ListGroup.Item className="bg-dark border-0"><Button href="#passwords" variant='secondary' className="w-100">Remove</Button></ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col xs={11} lg={6} className="col-offset-2">
                    {userInfo && profileInfo && <>
                        <h4 className='text-white'>Update user details</h4>
                        <Stack className="align-items-center my-3" id="account">
                            <img src={inputValues.avatar} alt="User avatar" style={{ width: "180px", height: "180px" }} className="rounded-circle" />
                            <input className="bg-light border rounded my-3" type="file" ref={avatarRef} name="avatar" onChange={handleAvatarChange} />
                        </Stack>
                        <InputWithIcon
                            icon="fas fa-envelope"
                            name="email"
                            placeholder="Email"
                            setInputValues={setInputValues}
                            type="email"
                            value={inputValues.email || ""}
                            error={inputErrors.email}
                        />
                        <Stack direction="horizontal">
                            <InputWithIcon
                                icon="fas fa-user"
                                name="first_name"
                                placeholder="First Name"
                                setInputValues={setInputValues}
                                value={inputValues.first_name || ""}
                                type="text"
                                error={inputErrors.first_name}
                            />
                            <InputWithIcon
                                icon="fas fa-user"
                                name="last_name"
                                placeholder="Last Name"
                                value={inputValues.last_name || ""}
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.last_name}
                            />
                        </Stack>
                        <InputWithIcon
                            icon="fas fa-phone"
                            name="phone"
                            placeholder="Phone"
                            value={inputValues.phone || ""}
                            setInputValues={setInputValues}
                            type="text"
                            error={inputErrors.phone}
                        />
                        <Stack direction="horizontal" id="profile">
                            <InputWithIcon
                                icon="fas fa-earth-americas"
                                name="address"
                                placeholder="Address"
                                value={inputValues.address || ""}
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.address}
                            />
                            <InputWithIcon
                                icon="fas fa-earth-americas"
                                name="city"
                                placeholder="City"
                                value={inputValues.city || ""}
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.city}
                            />
                        </Stack>
                        <InputWithIcon
                            icon="fas fa-earth-americas"
                            name="zip_code"
                            placeholder="Zipcode"
                            value={inputValues.zip_code || ""}
                            setInputValues={setInputValues}
                            type="text"
                            error={inputErrors.zip_code}
                        />
                        <Stack direction="horizontal">
                            <InputWithIcon
                                icon="fas fa-earth-americas"
                                name="state"
                                placeholder="State"
                                value={inputValues.state || ""}
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.state}
                            />
                            <InputWithIcon
                                icon="fas fa-earth-americas"
                                name="country"
                                placeholder="Country"
                                value={inputValues.country || ""}
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.country}
                            />
                        </Stack>

                        <Button variant="primary" className="w-100 mt-3" onClick={handleUpdate}>Update</Button>

                        <hr className="text-white mt-5" />
                        <h4 className='text-white mt-5'>Change Password</h4>

                        <InputWithIcon
                            onClick={() => setOldPasswordToggle((p) => !p)}
                            icon={"password fas " + (oldPasswordToggle ? "fa-eye" : "fa-eye-slash")}
                            name="old_password"
                            placeholder="Old Password *"
                            setInputValues={setInputValues}
                            type={oldPasswordToggle ? "password" : "text"}
                            error={inputErrors.old_password}
                        />
                        <Stack direction="horizontal" id="passwords">
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
                                onClick={() => setPasswordConfirmToggle((p) => !p)}
                                name="password_confirm"
                                icon={"password fas " + (passwordConfirmToggle ? "fa-eye" : "fa-eye-slash")}
                                placeholder="Confirm Password *"
                                setInputValues={setInputValues}
                                type={passwordConfirmToggle ? "password" : "text"}
                                error={inputErrors.password_confirm}
                            />
                        </Stack>
                        <Button variant="primary" className="w-100 my-3">Update</Button>
                    </>}
                </Col>
            </Row>

        </Container>
    );
}

export { Settings };