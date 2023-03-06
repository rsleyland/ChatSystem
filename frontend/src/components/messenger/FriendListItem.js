import "./styles.css";
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { useState } from "react";

const FriendListItem = ({ data, handleAddChat, i }) => {
    
    let date = new Date(data.date_joined)
    const [showProfile, setShowProfile] = useState(false);

    return (<>
        <div className="d-flex align-items-center justify-content-between w-100 p-2 px-4 px-lg-3 border-bottom border-1 hover-chat-item-friends">
            <div className="d-flex align-items-center">
                <img src={data.profile.image} height={'50px'} className="rounded-circle no-select-hl" />
                <div className="d-flex flex-column align-items-start ms-4">
                    <h6 className="no-select-hl text-white">{data.first_name}</h6>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-between h-100" style={{ position: "relative" }}>
                <div onClick={e => e.stopPropagation()}>
                    <Dropdown className="chat-list-item-options">
                        <Dropdown.Toggle><i className="fas fa-ellipsis text-white"></i></Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu">
                            <Dropdown.Item href="#" onClick={() => setShowProfile(true)}><i className="fas fa-user me-2 text-success"></i> Profile</Dropdown.Item>
                            <Dropdown.Item href="#" onClick={() => handleAddChat(i)}><i className="fas fa-message me-2 text-primary"></i> Send message</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <small className="no-select-hl text-white">Joined: {date.toUTCString().substring(4, 16)}</small>
            </div>


        </div>



        <Modal show={showProfile} onHide={() => setShowProfile(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Neighbor Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="m-2">Name: <strong>{data.first_name}</strong></h5>
                    <div className="d-flex justify-content-center align-items-end" style={{ width: "40%" }}>
                        <img src={data.image} height={'80px'} className="rounded-circle" />
                    </div>
                </div>
                <p className="m-2">Unit: <strong>{}</strong></p>
                <p className="m-2">Building: <strong>{}</strong></p>
                <p className="m-2">Birthday: <strong>22nd February</strong></p>
                <p className="m-2">Member since: <strong>{date.toUTCString().substring(4, 16)}</strong></p>

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
    </>
    )

}

export { FriendListItem };