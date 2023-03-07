import { useEffect, useState } from "react";
import { Container, Col, Row, Spinner, Modal, Button } from "react-bootstrap";
import { InputWithIcon } from "../components/InputWithIcon"
import { useSelector, useDispatch } from 'react-redux';
import { ChatUserListItem } from "../components/messenger/ChatUserListItem";
import { FriendListItem } from "../components/messenger/FriendListItem";
import { FavouritesListItem } from "../components/messenger/FavouritesListItem";
import axios from 'axios';
import { ChatWindow } from "../components/messenger/ChatWindow";
import { MESSENGER_NOTIFICATIONS_SUCCESS } from '../redux/constants/messengerConstants'
import { FriendModalListItem } from "../components/messenger/FriendModalListItem";



let favourites = [
    {
        name: "Phil Dumphy",
        last_online: "2023-02-25T21:13:00",
        image: "profile_img_src"
    },
    {
        name: "Karen Halpert",
        last_online: "2023-02-25T21:13:00",
        image: "profile_img_src"
    }
]


const Messenger = () => {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const messengerChats = useSelector(state => state.messengerChats);
    const { chats } = messengerChats;

    const messengerNotifications = useSelector((state) => state.messengerNotifications);
    const { notifications } = messengerNotifications;

    const [inputValues, setInputValues] = useState({ search: "", message: "", search_archives: "", search_users: "", search_favourites: "" });
    const [inputErrors, setInputErrors] = useState({ search: false, message: false, search_archives: false, search_users: false, search_favourites: false });
    const [selectedChatIndex, setSelectedChatIndex] = useState(-1);
    const [menuSelection, setMenuSelection] = useState("chats");
    const [filteredFavourites, setFilteredFavourites] = useState(favourites);
    const [users, setUsers] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState(null);
    const [_chats, setChats] = useState(chats);
    const [chatAdded, setChatAdded] = useState([]);
    const [filteredChats, setFilteredChats] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [showAddChat, setShowAddChat] = useState(false)
    const [showAddGroupChat, setShowAddGroupChat] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        setLoadingUsers(true);
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            },
        };
        const data = await axios.get(
            "/api/messenger/get-users/",
            config
        );
        setUsers(data.data)
    }

    useEffect(() => {
        if (chats)
            setChats(chats)
    }, [chats])

    const addChat = async (friend_id) => {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            },
        };
        const data = await axios.post(
            "/api/messenger/create-chat/", {
            friend_id: friend_id
        },
            config
        );
        setChats((prev) => [...prev, data.data])
        setChatAdded([friend_id])
    }

    const addGroupChat = async (friend_ids) => {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            },
        };
        const data = await axios.post(
            "/api/messenger/create-group-chat/", {
            friend_ids: friend_ids
        },
            config
        );
        setChats((prev) => [...prev, data.data])
        setChatAdded(friend_ids)
    }

    const setChatRead = async (i) => {
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`
            },
        };
        const data = await axios.post(
            "/api/messenger/set-chat-read/", {
            chat_name: _chats[i].name
        },
            config
        );
    }


    const handleChatUserListItemSelected = (i) => {
        setSelectedChatIndex(i);
        let count = 0
        const readAndIncremement = (msg) => {
            if (msg.read == false) {
                count += 1
                msg.read = true
            }
            return msg
        }
        _chats[i].messages.forEach(msg => (msg.from_user != userInfo.id) ? readAndIncremement(msg) : null);
        setChatRead(i);
        dispatch({
            type: MESSENGER_NOTIFICATIONS_SUCCESS,
            payload: notifications - count,
        });
    }

    const searchChats = () => {
        setLoading(true);
        let query = inputValues["search"]
        let filtered = _chats
        if (query.length > 0) {
            filtered = _chats.filter((c) => c.participants.every(p => p.first_name.toLowerCase().includes(query?.toLowerCase().trim())))
        }
        setTimeout(() => {
            setFilteredChats(filtered)
        }, 800)

    }

    const searchUsers = () => {
        setLoadingUsers(true);
        let query = inputValues["search_users"]
        let filtered = users
        if (query.length > 0) {
            filtered = users.filter((u) => u?.first_name?.toLowerCase().includes(query?.toLowerCase().trim()))
        }
        setTimeout(() => {
            setSelectedUsers([])
            setFilteredUsers(filtered)
            setLoadingUsers(false);
        }, 800)
    }

    const searchFavourites = () => {
        setLoading(true);
        let query = inputValues["search_favourites"]
        let filtered = favourites.filter((fav) => fav?.name?.toLowerCase().includes(query?.toLowerCase().trim()))
        setTimeout(() => {
            setFilteredFavourites(filtered)
            setLoading(false);
        }, 800)
    }

    useEffect(() => {
        if (users) searchUsers();
    }, [users])

    useEffect(() => {
        if (_chats) {
            searchChats();
        }
    }, [_chats])

    useEffect(() => {
        if (filteredChats) {
            if (chatAdded.length == 1) {
                let index = _chats.findIndex((c) => (c.participants[0].id == chatAdded[0]))
                setSelectedChatIndex(index);
                setMenuSelection("chats")
                setChatAdded([])
            }
            else if (chatAdded.length > 1) {
                const findIndexHelper = (c) => {
                    let participants = c.participants
                    let p_ids = participants.map(p => p.id)
                    if (p_ids.length != chatAdded.length) return false
                    for (let i = 0; i < p_ids.length; ++i) {
                        if (chatAdded.includes(p_ids[i]) === false) return false;
                    }
                    return true
                }
                let index = _chats.findIndex((c) => (findIndexHelper(c)))
                setSelectedChatIndex(index);
                setMenuSelection("chats")
                setChatAdded([])
            }
            setLoading(false);
        }
    }, [filteredChats])

    useEffect(() => {
        if (!firstLoad) searchChats();
        else setFirstLoad(false)
    }, [inputValues["search"]])
    useEffect(() => { if (!firstLoad) searchUsers(); }, [inputValues["search_users"]])
    useEffect(() => { if (!firstLoad) searchFavourites(); }, [inputValues["search_favourites"]])


    const handleAddChat = async (i = -1) => {
        let friend = null
        if (i > -1) {
            friend = filteredUsers[i]
        }
        else friend = filteredUsers[selectedUsers[0]]
        let index = _chats.findIndex((c) => (c.participants.length == 1 && c.participants[0].id == friend.id))
        let exists = index > -1
        if (exists) {
            setSelectedChatIndex(index);
            setMenuSelection("chats")
        }
        else {
            addChat(friend.id)
        }
        setShowAddChat(false)
        setSelectedUsers([]);
        setInputValues(prev => ({ ...prev, ["search_users"]: "" }));
    }

    const handleAddGroupChat = async () => {
        let friends = selectedUsers.map(item => filteredUsers[item])
        let f_ids = friends.map(f => f.id)
        const findIndexHelper = (c) => {
            let participants = c.participants
            let p_ids = participants.map(p => p.id)
            if (p_ids.length != f_ids.length) return false
            for (let i = 0; i < p_ids.length; ++i) {
                if (f_ids.includes(p_ids[i]) === false) return false;
            }
            return true
        }
        let index = _chats.findIndex((c) => (findIndexHelper(c)))
        let exists = index > -1
        if (exists) {
            setSelectedChatIndex(index);
            setMenuSelection("chats")
        }
        else {
            addGroupChat(f_ids)
        }
        setShowAddGroupChat(false);
        setSelectedUsers([]);
        setInputValues(prev => ({ ...prev, ["search_users"]: "" }));
    }

    const handleToggleListItem = (i, group = false) => {
        if (selectedUsers.includes(i)) {
            if (!group) {
                setSelectedUsers([])
            }
            else setSelectedUsers(selectedUsers.filter(item => item !== i))
        }
        else {
            if (!group) {
                setSelectedUsers([i])
            }
            else setSelectedUsers(prev => [...prev, i])
        }
    }




    return (<>
        <Container fluid style={{ height: "calc(100vh - 60px)", position: 'relative', width: "100vw" }}>
            <Row className="h-100">

                {/* CHAT MENU CHOICES */}
                <Col xl={1} className="border-end border-1 border-light flex-column align-items-center d-none d-xl-flex pt-5">
                    <h5 data-content="Chats" onClick={() => setMenuSelection("chats")} className={"hover-chat-item hover-chat-item-tooltip mb-4 py-3 px-4 rounded " + (menuSelection == "chats" ? "text-primary" : "")} style={menuSelection == "chats" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}}><i className="fas fa-comments"></i></h5>
                    <h5 data-content="Users" onClick={() => setMenuSelection("users")} className={"hover-chat-item hover-chat-item-tooltip mb-4 py-3 px-4 rounded " + (menuSelection == "users" ? "text-success" : "")} style={menuSelection == "users" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}}><i className="fas fa-user"></i></h5>
                    {/* <h5 data-content="Favourites" onClick={() => setMenuSelection("favourites")} className={"hover-chat-item hover-chat-item-tooltip mb-4 py-3 px-4 rounded " + (menuSelection == "favourites" ? "text-warning" : "")} style={menuSelection == "favourites" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}}><i className="fas fa-star"></i></h5> */}
                </Col>


                {/* SELECTED SUB MENU */}
                <Col xs={12} lg={4} xl={3} className={selectedChatIndex >= 0 ? "d-none d-lg-flex border-end border-1 border-light flex-column align-items-center pt-3 pe-0 ps-0" : "border-end border-1 border-light flex-column align-items-center pt-3 pe-0 ps-0 d-flex"}>

                    {/* CHAT SUBMENU */}
                    {menuSelection == "chats" && <>
                        <div style={{ width: "80%", marginBottom: '20px' }}>

                            <div className="d-flex d-xl-none justify-content-center align-items-center mb-3 pb-4 border-bottom">
                                <p data-content="Chats" onClick={() => setMenuSelection("chats")} className={"hover-chat-item hover-chat-item-tooltip m-0 mx-2 py-2 px-2 rounded " + (menuSelection == "chats" ? "text-primary" : "")} style={menuSelection == "chats" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}}><i className="fas fa-comments"></i></p>
                                <p data-content="Users" onClick={() => setMenuSelection("users")} className={"hover-chat-item hover-chat-item-tooltip m-0 mx-2 py-2 px-2 rounded " + (menuSelection == "users" ? "text-success" : "")} style={menuSelection == "users" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}} ><i className="fas fa-user"></i></p>
                                {/* <p data-content="Favourites" onClick={() => setMenuSelection("favourites")} className={"hover-chat-item hover-chat-item-tooltip m-0 mx-2 py-2 px-2 rounded " + (menuSelection == "favourites" ? "text-warning" : "")} style={menuSelection == "favourites" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}} ><i className="fas fa-star"></i></p> */}
                            </div>

                            <div className="d-flex justify-content-between">
                                <h4 className="text-white">Chats</h4>
                                <div className="d-flex">
                                    {_chats && _chats.length > 0 && <>
                                        <h6 onClick={() => setShowAddChat(true)} data-content="New chat" className="mb-2 p-2 rounded border hover-chat-item hover-chat-item-tooltip-small"><i className="fas fa-square-plus"></i></h6>
                                        <h6 onClick={() => setShowAddGroupChat(true)} data-content="New group chat" className="ms-2 mb-2 p-2 rounded border hover-chat-item hover-chat-item-tooltip-small2"><i className="fas fa-users"></i></h6>
                                    </>}
                                </div>
                            </div>
                            <InputWithIcon
                                data_testid="search-chat-chats-screen" // Added for testing
                                icon="fas fa-search"
                                name="search"
                                placeholder="Search chats"
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.search}
                                style={{ maxHeight: '46px', marginTop: '5px', backgroundColor: "rgba(0,0,0,0.3)", color: "white" }}
                                loading={loading}
                            />

                        </div>

                        {filteredChats && filteredChats.length > 0 ? filteredChats.map((chat, i) => {
                            let lastMessageIndex = chat.messages.map(m => (m.from_user != userInfo.id && m.deleted_by.findIndex(u => u.id == userInfo.id) == -1)).indexOf(true)
                            let lastMessage = "";
                            let time = null;
                            if (lastMessageIndex > -1) {
                                lastMessage = chat.messages[lastMessageIndex].content
                                time = chat.messages[lastMessageIndex].timestamp
                            }
                            let unseen_msg_count = chat.messages.filter(m => m.read === false && m.from_user != userInfo.id && m.deleted_by.findIndex(u => u.id == userInfo.id) == -1).length

                            // return <ChatUserListItem new_msg_count={unseen_msg_count} onClick={() => handleChatUserListItemSelected(i)} key={"chat-list-item-" + i} data={{ name: chat.user.name, message: lastMessage, time: chat.lastReceived }} />
                            return <ChatUserListItem
                                new_msg_count={unseen_msg_count}
                                onClick={() => handleChatUserListItemSelected(i)}
                                key={"chat-list-item-" + i}
                                data={{ user: chat.participants[0], message: lastMessage, time: time, chat_name: chat.name, chats: chats }}
                            />

                        }) : loading ? <Spinner animation="border" size="xl" className={"input-loading-icon text-primary"} /> :
                            <div className="d-flex flex-column align-items-center w-100">
                                <h5>{inputValues.search.length > 0 ? "No search results" : "No chats"}</h5>
                                {inputValues.search.length == 0 && <div className="d-flex justify-content-evenly w-75">
                                    <h4 onClick={() => setShowAddChat(true)} data-content="Start new chat" className="mt-2 mb-2 p-3 rounded border hover-chat-item hover-chat-item-tooltip-add-lg"><i className="fas fa-square-plus"></i></h4>
                                    <h4 onClick={() => setShowAddGroupChat(true)} data-content="Start group chat" className="mt-2 mb-2 p-3 rounded border hover-chat-item hover-chat-item-tooltip-add-lg"><i className="fas fa-users"></i></h4>
                                </div>}
                            </div>}


                    </>}

                    {/* USERS SUBMENU */}
                    {menuSelection == "users" && <>
                        <div style={{ width: "80%", marginBottom: '20px' }}>

                            <div className="d-flex d-xl-none justify-content-center align-items-center mb-3 pb-4 border-bottom">
                                <p data-content="Chats" onClick={() => setMenuSelection("chats")} className={"hover-chat-item hover-chat-item-tooltip m-0 mx-2 py-2 px-2 rounded " + (menuSelection == "chats" ? "text-primary" : "")} style={menuSelection == "chats" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}}><i className="fas fa-comments"></i></p>
                                <p data-content="Users" onClick={() => setMenuSelection("users")} className={"hover-chat-item hover-chat-item-tooltip m-0 mx-2 py-2 px-2 rounded " + (menuSelection == "users" ? "text-success" : "")} style={menuSelection == "users" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}} ><i className="fas fa-user"></i></p>
                                {/* <p data-content="Favourites" onClick={() => setMenuSelection("favourites")} className={"hover-chat-item hover-chat-item-tooltip m-0 mx-2 py-2 px-2 rounded " + (menuSelection == "favourites" ? "text-warning" : "")} style={menuSelection == "favourites" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}} ><i className="fas fa-star"></i></p> */}
                            </div>
                            <div className="d-flex justify-content-between">
                                <h4 className="mb-3 text-white">Users</h4>
                                {/* <h6 data-content="Add user" className="me-2 p-2 rounded border hover-chat-item  hover-chat-item-tooltip-small"><i className="fas fa-user-plus"></i></h6> */}
                            </div>
                            <InputWithIcon
                                data_testid="search-users-chat-screen" // Added for testing
                                icon="fas fa-search"
                                name="search_users"
                                placeholder="Search users"
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.search_users}
                                style={{ maxHeight: '46px', marginTop: '5px', backgroundColor: "rgba(0,0,0,0.3)", color: "white" }}
                                loading={loadingUsers}
                            />
                        </div>
                        {filteredUsers && filteredUsers.map((user, i) => {
                            return <FriendListItem key={`friend-list-item-${i}`} i={i} handleAddChat={handleAddChat} data={{...user}} />
                        })}


                    </>}

                    {/* FAVOURITES SUBMENU */}
                    {menuSelection == "favourites" && <>
                        <div style={{ width: "80%", marginBottom: '20px' }}>

                            <div className="d-flex d-xl-none justify-content-center align-items-center mb-3 pb-4 border-bottom">
                                <p data-content="Chats" onClick={() => setMenuSelection("chats")} className={"hover-chat-item hover-chat-item-tooltip m-0 mx-2 py-2 px-2 rounded " + (menuSelection == "chats" ? "text-primary" : "")} style={menuSelection == "chats" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}}><i className="fas fa-comments"></i></p>
                                <p data-content="Users" onClick={() => setMenuSelection("users")} className={"hover-chat-item hover-chat-item-tooltip m-0 mx-2 py-2 px-2 rounded " + (menuSelection == "users" ? "text-success" : "")} style={menuSelection == "users" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}} ><i className="fas fa-user"></i></p>
                                {/* <p data-content="Favourites" onClick={() => setMenuSelection("favourites")} className={"hover-chat-item hover-chat-item-tooltip m-0 mx-2 py-2 px-2 rounded " + (menuSelection == "favourites" ? "text-warning" : "")} style={menuSelection == "favourites" ? { backgroundColor: "rgba(0, 0, 0, 0.15" } : {}} ><i className="fas fa-star"></i></p> */}
                            </div>
                            <h4 className="mb-3">Favourites</h4>
                            <InputWithIcon
                                data_testid="search-chat-favourites-screen" // Added for testing
                                icon="fas fa-search"
                                name="search_favourites"
                                placeholder="Search favourites"
                                setInputValues={setInputValues}
                                type="text"
                                error={inputErrors.search_favourites}
                                style={{ maxHeight: '46px', marginTop: '5px' }}
                                loading={loading}
                            />
                        </div>

                        {filteredFavourites && filteredFavourites.map((fav, i) => {
                            return <FavouritesListItem key={`favourites-list-item-${i}`} data={{ name: fav.name, time: fav.last_online }} />
                        })}

                    </>}

                </Col>


                {/* MAIN CHAT COLUMN */}
                <Col xs={12} lg={8} className={selectedChatIndex === -1 && "d-none d-lg-block"} style={{ position: 'relative' }}>

                    {_chats && _chats.length > 0 && selectedChatIndex >= 0 ?

                        <ChatWindow friend={_chats[selectedChatIndex].participants[0]} chat_name={_chats[selectedChatIndex].name} setSelectedChatIndex={setSelectedChatIndex} />

                        :

                        <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <img className="mb-4" src="unselected_chat_img.svg" width={"200px"} height={"200px"} />
                            <p className="mb-4 text-muted">Select a chat to read messages</p>
                        </div>}
                </Col>

            </Row>

            {/* START NEW CHAT MODAL */}
            <Modal scrollable={true} show={showAddChat} onHide={() => { setShowAddChat(false); setSelectedUsers([]); setInputValues(prev => ({ ...prev, ["search_users"]: "" })) }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Start New Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "450px" }}>
                    <h6>Select a user from the list below</h6>
                    <InputWithIcon
                        data_testid="search-users-chat-modal-screen" // Added for testing
                        icon="fas fa-search"
                        name="search_users"
                        placeholder="Search users"
                        setInputValues={setInputValues}
                        type="text"
                        error={inputErrors.search_users}
                        style={{ maxHeight: '46px', marginTop: '5px' }}
                        loading={loadingUsers}
                    />

                    <div className="d-flex flex-column mt-3">
                        {filteredUsers && filteredUsers.map((user, i) => {
                            return (
                                <div key={`user-add-chat-item-${i}`} role={'button'} onClick={() => handleToggleListItem(i)}>
                                    <FriendModalListItem active={selectedUsers[0] == i} key={`friend-modal-list-item-${i}`} i={i} data={{...user}} />
                                    </div>)
                        })}

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowAddChat(false); setSelectedUsers([]); setInputValues(prev => ({ ...prev, ["search_users"]: "" })) }}>
                        Close
                    </Button>
                    <Button variant="success" disabled={selectedUsers.length === 0} onClick={handleAddChat}>
                        Chat
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* START NEW GROUP CHAT MODAL */}
            <Modal scrollable={true} show={showAddGroupChat} onHide={() => { setShowAddGroupChat(false); setSelectedUsers([]); setInputValues(prev => ({ ...prev, ["search_users"]: "" })) }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Start New Group Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: "450px" }}>
                    <div className="">
                        <h6>Select users from the list below</h6>
                        <InputWithIcon
                            data_testid="search-users-chat-modal-screen" // Added for testing
                            icon="fas fa-search"
                            name="search_users"
                            placeholder="Search users"
                            setInputValues={setInputValues}
                            type="text"
                            error={inputErrors.search_users}
                            style={{ maxHeight: '46px', marginTop: '5px' }}
                            loading={loadingUsers}
                        />

                        <div className="d-flex flex-column mt-3" style={{ maxHeight: "300px", }}>
                            {filteredUsers && filteredUsers.map((user, i) => {
                                return (
                                    <div key={`user-add-group-chat-item-${i}`} role={'button'} onClick={() => handleToggleListItem(i, true)}>
                                        <FriendModalListItem active={selectedUsers.includes(i)} key={`friend-group-modal-list-item-${i}`} i={i} data={{...user}} /></div>)
                            })}

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowAddGroupChat(false); setSelectedUsers([]); setInputValues(prev => ({ ...prev, ["search_users"]: "" })) }}>
                        Close
                    </Button>
                    <Button variant="success" disabled={selectedUsers.length < 2} onClick={handleAddGroupChat}>
                        Chat
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>

    </>
    )
};

export { Messenger };