import axios from "axios";
import { useDispatch } from "react-redux";
import { USER_IN_STORAGE, USER_LOGIN_SUCCESS } from "./redux/constants/userConstants";

// axios config utilty function
const GenerateAxiosConfig = () => {
    if (localStorage.getItem(USER_IN_STORAGE)) {
        const user = JSON.parse(localStorage.getItem(USER_IN_STORAGE));
        if (user.access) {
            return {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${user.access}`
                },
                withCredentials: true
            };
        }
    }
    else {
        return {
            headers: {
                "Content-type": "application/json",
            }
        };
    }
}

// used when access token expires and refresh token is needed to get a new access token
const AxiosResponseInterceptor = (error) => {
    const dispatch = useDispatch();

    // Add a response interceptor for axios - saves refreshed access token to local storage/redux store
    axios.interceptors.response.use(function (response) {

        if (response?.headers?.new_access_token) {
            let prev = JSON.parse(localStorage.getItem(USER_IN_STORAGE));
            prev['access'] = response.headers.new_access_token;
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: prev,
            });
            localStorage.setItem(USER_IN_STORAGE, JSON.stringify(prev));
        }
        return response;
    }, function (error) {
        return Promise.reject(error);
    });
};

const AxiosRequestInterceptor = () => {
    // Add a request interceptor for axios - adds access token to request header
    axios.interceptors.request.use(function (request) {
        if (request?.url == "/api/account/update-profile/") {
            request.headers['Content-Type'] = "multipart/form-data";    //uploading image
        }
        else request.headers['Content-Type'] = 'application/json';
        if (localStorage.getItem(USER_IN_STORAGE)) {
            request.headers['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem(USER_IN_STORAGE)).access}`;
        } 
        return request;
    }, function (error) {
        console.log("ERROR: ", error);
        return Promise.reject(error);
    });
};


export { AxiosResponseInterceptor, AxiosRequestInterceptor, GenerateAxiosConfig };