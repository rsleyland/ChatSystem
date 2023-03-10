import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Button, Row, Col } from "react-bootstrap";
import { ChatMessage } from "./ChatMessage";
import { InputWithIcon } from "../InputWithIcon"
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Filter from 'bad-words';


const ChatGroupWindow = ({ chat_name, friends, setSelectedChatIndex }) => {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const userProfile = useSelector(state => state.userProfile);
    const { profileInfo } = userProfile;

    const messageFilter = new Filter()

    const [inputValues, setInputValues] = useState({ message: "" });
    const [inputErrors, setInputErrors] = useState({ message: false });
    const [messageHistory, setMessageHistory] = useState([]);
    const [socketUrl, setSocketUrl] = useState(`ws://127.0.0.1:8000/ws/chats/${chat_name}/`);

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        socketUrl, {
        queryParams: {
            token: userInfo ? userInfo.access : "",
        }
    });

    useEffect(() => {
        if (lastMessage !== null) {
            let json = JSON.parse(lastMessage.data)
            if (json.type == "send_chat_history") {
                return setMessageHistory(json.messages.reverse())
            }
            else if (json.type == "send_chat_message") {
                setMessageHistory((prev) => prev.concat(json.message));
            }
        }
    }, [lastMessage, setMessageHistory]);

    useEffect(() => {
        setSocketUrl(`ws://127.0.0.1:8000/ws/chats/${chat_name}/`)
    }, [chat_name])

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValues["message"].length == 0) return
        sendMessage(JSON.stringify({
            'type': "chat_message",
            'message': messageFilter.clean(inputValues["message"]),
            'sender': userInfo.id || -1
        }))
        setInputValues((prev) => ({ ...prev, ["message"]: "" }));

    }

    const concatNames = () => {
        let names = "";
        for (let i = 0; i < friends.length; i++) {
            if (names === "") {
                names = friends[i].first_name
            }
            else {
                names = names + " & " + friends[i].first_name
            }
        }
        return names;
    }

    const getMostRecentFriend = () => {
        let most_recent = 0;
        for (let i = 1; i < friends.length; i++) {
            let next_date = new Date(friends[i].last_login)
            if (next_date > new Date(friends[most_recent].last_login)) {
                most_recent = i
            }
        }
        return most_recent;
    };

    const findFriendById = (id) => {
        return friends.find((f) => f.id === id)
    }

    return <>
        {/* CHAT FRIEND INFO BAR */}
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-dark text-white w-100"
            style={{ position: "absolute", left: 0, right: 0 }}>
            <div className="d-flex align-items-center">
                <Button
                    data-testid="blog-topic-back-button"
                    variant="outline-primary"
                    size={"sm"}
                    className="mb-1 me-4 d-lg-none"
                    onClick={() => setSelectedChatIndex(-1)}
                >
                    <i className="fas fa-arrow-left" /> Back
                </Button>
                <Row className="m-0 p-0 justify-content-center" style={{ width: "80px" }}>
                    {friends && friends.map((f, i) =>
                        <Col key={`group-header-image-${i}`} xs={6} className={'p-0 m-0 d-flex justify-content-center'} style={{ width: "35px" }}>
                            <img src={f.profile.image} height={'30px'} width={'30px'} className={"rounded-circle"} />
                        </Col>
                    )}
                </Row>
                <div className="d-flex flex-column align-items-start ms-4">
                    <h6>{concatNames()}</h6>
                    <small className="text-muted">last online: {new Date(friends[getMostRecentFriend()].last_login).toTimeString().substring(0, 5) + " - " + new Date(friends[0].last_login).toDateString()}</small>
                </div>
            </div>
        </div>

        {/* MESSAGES */}
        <div className="p-3" style={{ overflowY: "scroll", height: "calc(100vh - 220px )", position: "relative", top: '90px', textAlign: "justify" }}>
            {messageHistory && messageHistory.map((msg, i) => {
                // check if last message was sent by same person
                if (i > 0) {
                    let lastSender = messageHistory[i - 1].from_user_name

                    if (lastSender === msg.from_user_name) {
                        if (msg.from_user != userInfo.id) return <ChatMessage key={`chat-msg-${i}`} time={msg.timestamp} image={findFriendById(msg.from_user).image} message={msg.content} sender={msg.from_user_name} include_sender={false} />
                        return <ChatMessage key={`chat-msg-${i}`} time={msg.timestamp} image={userInfo.profile.image} message={msg.content} sender={msg.from_user_name} inbound={false} include_sender={false} />
                    }

                    if (msg.from_user != userInfo.id) return <ChatMessage key={`chat-msg-${i}`} time={msg.timestamp} image={findFriendById(msg.from_user).image} message={msg.content} sender={msg.from_user_name} />
                    return <ChatMessage key={`chat-msg-${i}`} image={userInfo.profile.image} time={msg.timestamp} message={msg.content} sender={msg.from_user_name} inbound={false} />
                }

                if (msg.from_user != userInfo.id) return <ChatMessage key={`chat-msg-${i}`} time={msg.timestamp} image={findFriendById(msg.from_user).image} message={msg.content} sender={msg.from_user_name} />
                return <ChatMessage key={`chat-msg-${i}`} image={userInfo.profile.image} time={msg.timestamp} message={msg.content} sender={msg.from_user_name} inbound={false} />
            })
            }

        </div>

        {/* MESSAGE INPUT */}
        <div className="p-2 d-flex align-items-end justify-content-center" style={{ position: "absolute", bottom: 10, left: 0, right: 0 }}>
            <div style={{ width: "90%" }}>
                <form onSubmit={handleSendMessage}>
                    <InputWithIcon
                        data_testid="new-message-chat-screen" // Added for testing
                        icon="fas fa-comment"
                        name="message"
                        placeholder="Write a message"
                        setInputValues={setInputValues}
                        type="text"
                        error={inputErrors.message}
                        style={{ maxHeight: '46px', marginTop: '5px', backgroundColor: "rgba(0,0,0,0.3)", color: "white" }}
                        value={inputValues["message"]}
                        autoFocus={true}
                    />
                </form>
            </div>

            <i onClick={handleSendMessage} className="fas fa-paper-plane border rounded p-3 ms-2 bg-primary text-white" role={"button"} style={{ height: '46px' }}></i>
        </div>
    </>
}

export { ChatGroupWindow };