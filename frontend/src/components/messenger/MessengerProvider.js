import { useDispatch, useSelector } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket'; 
import { useState, useEffect } from "react";
import { MESSENGER_CHATS_REQUEST, MESSENGER_CHATS_SUCCESS, MESSENGER_NOTIFICATIONS_REQUEST, MESSENGER_NOTIFICATIONS_SUCCESS } from '../../redux/constants/messengerConstants'



const MessengerProvider = () => {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    const [socketUrl] = useState(`ws://127.0.0.1:8000/ws/notifications/`);
    const dispatch = useDispatch()

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        socketUrl, {
        queryParams: {
            token: userInfo ? userInfo.access : "",
        }
    });

    useEffect(() => {
        dispatch({
            type: MESSENGER_CHATS_REQUEST
        });
        dispatch({
            type: MESSENGER_NOTIFICATIONS_REQUEST
        });
    }, [])

    useEffect(() => {
        if (lastMessage !== null) {
            let json = JSON.parse(lastMessage.data)

            if (json.type == "send_notification_count")
                dispatch({
                    type: MESSENGER_NOTIFICATIONS_SUCCESS,
                    payload: json.notifications,
                });

            if (json.type == "send_chats")
                dispatch({
                    type: MESSENGER_CHATS_SUCCESS,
                    payload: json.chats,
                });
        }
    }, [lastMessage]);

    return null
}

export { MessengerProvider };