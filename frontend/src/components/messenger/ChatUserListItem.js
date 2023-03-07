import "./styles.css";
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { MESSENGER_CHATS_CLEAR, MESSENGER_CHATS_SUCCESS } from '../../redux/constants/messengerConstants'

const ChatUserListItem = ({ data, onClick, new_msg_count = 0 }) => {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;


    let today = new Date()
    let date = new Date(data.time || data.user.last_login)
    let online_today = (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear())
    const [showOptions, setShowOptions] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const dispatch = useDispatch()


    const handleDeleteChat = async () => {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            },
        };
        const resp = await axios.post(
            "/api/messenger/delete-chat/",
            {chat_name: data.chat_name},
            config
        );
        if (resp.status != 200) return
        let new_chats = data.chats.filter(c => c.name != data.chat_name)
        if (new_chats.length > 0) {
            dispatch({
                type: MESSENGER_CHATS_SUCCESS,
                payload: new_chats
            })
        }
        else {

            dispatch({
                type: MESSENGER_CHATS_CLEAR
            })
        }
    }

    return (<>
        <div onMouseEnter={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)} className="d-flex align-items-center justify-content-between w-100 p-2 px-4 px-lg-3 border-bottom border-1 hover-chat-item" onClick={onClick}>
            <div className="d-flex align-items-center">
                <img src={data.user.profile.image} height={'50px'} className={"rounded-circle"} />
                <div className="d-flex flex-column align-items-start ms-4">
                    <h6 className={new_msg_count > 0 ? "text-primary" : ""}>{data.user.first_name}</h6>
                    <small className={new_msg_count > 0 ? "text-primary" : ""}>{data.message}</small>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-between h-100" style={{ position: "relative" }}>
                {new_msg_count > 0 ? <>
                    {!showOptions && <p style={{ padding: "1px 8px" }} className={'text-white bg-primary rounded-circle new-msg-counter'}>{new_msg_count < 100 ? new_msg_count : "99+"}</p>}
                    <div onClick={e => e.stopPropagation()}>
                        {showOptions && <Dropdown className="chat-list-item-options-behind-counter">
                            <Dropdown.Toggle ><i className="fas fa-ellipsis text-white"></i></Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#" onClick={() => setShowProfile(true)}><i className="fas fa-user me-2 text-success"></i> Profile</Dropdown.Item>
                                <Dropdown.Item href="#" onClick={() => setShowDelete(true)}><i className="fas fa-trash me-2 text-danger"></i> Delete Chat</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>}
                    </div>
                    <small className={'text-primary'}>Last login: {online_today ? date.toTimeString().substring(0, 5) : date.toDateString()}</small>
                </> :
                    <>
                        <div onClick={e => e.stopPropagation()}>
                            <Dropdown className="chat-list-item-options">
                                <Dropdown.Toggle ><i className="fas fa-ellipsis text-white"></i></Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#" onClick={() => setShowProfile(true)}><i className="fas fa-user me-2 text-success"></i> Profile</Dropdown.Item>
                                    <Dropdown.Item href="#" onClick={() => setShowDelete(true)}><i className="fas fa-trash me-2 text-danger"></i> Delete Chat</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <small>Last login: {online_today ? date.toTimeString().substring(0, 5) : date.toDateString().substring(4, 16)}</small>
                    </>}
            </div>


        </div>

        {/* PROFILE MODAL */}
        <Modal show={showProfile} onHide={() => setShowProfile(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Neighbor Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="m-2">Name: <strong>{data.user.name}</strong></h5>
                    <div className="d-flex justify-content-center align-items-end" style={{ width: "40%" }}>
                        <img src={data.user.profile.image} height={'80px'} className={"rounded-circle"} />
                    </div>
                </div>
                <p className="m-2">Unit: <strong>{}</strong></p>
                <p className="m-2">Building: <strong>{}</strong></p>
                <p className="m-2">Phone #: <strong>514 123 9876</strong></p>
                <p className="m-2">Member since: <strong>{date.toDateString()}</strong></p>

            </Modal.Body>
            <Modal.Footer className="d-flex align-items-end">
                <Button variant="danger" size="sm">
                    Report
                </Button>
                <Button variant="secondary" onClick={() => { setShowProfile(false); }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>

        {/* DELETE MODAL */}
        <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="m-2">Are you sure you want to delete this chat?</h5>
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex align-items-end">
                <Button variant="secondary" onClick={() => setShowDelete(false)}>
                    No
                </Button>
                <Button variant="danger" onClick={() => { handleDeleteChat(); setShowDelete(false); }}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    )

}

export { ChatUserListItem };