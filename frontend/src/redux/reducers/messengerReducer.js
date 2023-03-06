import {
    MESSENGER_CHATS_REQUEST,
    MESSENGER_CHATS_SUCCESS,
    MESSENGER_CHATS_FAIL,
    MESSENGER_CHATS_CLEAR,
    MESSENGER_NOTIFICATIONS_REQUEST,
    MESSENGER_NOTIFICATIONS_SUCCESS,
    MESSENGER_NOTIFICATIONS_FAIL,
    MESSENGER_NOTIFICATIONS_CLEAR
} from "../constants/messengerConstants";

export const messengerChatsReducer = (state = {}, action) => {
    switch (action.type) {
        case MESSENGER_CHATS_REQUEST:
            return { loading: true };

        case MESSENGER_CHATS_SUCCESS:
            return {
                loading: false,
                chats: action.payload,
                success: true,
            };

        case MESSENGER_CHATS_FAIL:
            return { loading: false, error: action.payload };

        case MESSENGER_CHATS_CLEAR:
            return {chats: []};

        default:
            return state;
    }
};

export const messengerNotificationsReducer = (state = {}, action) => {
    switch (action.type) {
        case MESSENGER_NOTIFICATIONS_REQUEST:
            return { loading: true };

        case MESSENGER_NOTIFICATIONS_SUCCESS:
            return {
                loading: false,
                notifications: action.payload,
                success: true,
            };

        case MESSENGER_NOTIFICATIONS_FAIL:
            return { loading: false, error: action.payload };

        case MESSENGER_CHATS_CLEAR:
            return {};

        default:
            return state;
    }
};
