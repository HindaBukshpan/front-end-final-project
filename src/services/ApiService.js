import axios from "axios";

const API_URL = "http://localhost:9000";

const setAuthHeaders = (token) => {
    console.log("token: " + token);
    localStorage.setItem("token", token);
}

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

export const removeAuthHeaders = (key) => {
    localStorage.removeItem(key);
}

export const register = (user) => {
    return axios.post(`${API_URL}/users/register`, user);    
}

export const login = async (credentials) => {
    const { data } = await axios.post(`${API_URL}/authenticate`, credentials);
    setAuthHeaders(data.jwt);
    return data;
}

export const fetchCurrentUser = () => {
    return axios.get(`${API_URL}/users`, { headers: getAuthHeaders() });
}

export const updateCurrentUser = (updatedCurrentUser) => {
    return axios.put(`${API_URL}/users`, updatedCurrentUser, { headers: getAuthHeaders() });
}

export const deleteCurrentUser = () => {
    return axios.delete(`${API_URL}/users`, { headers: getAuthHeaders() });
}

export const createItem = (item) => {
    return axios.post(`${API_URL}/items`, item, { headers: getAuthHeaders() });
}

export const updateItem = (updatedItem) => {
    return axios.put(`${API_URL}/items`, updatedItem, { headers: getAuthHeaders() });
}

export const deleteItem = (itemId) => {
    return axios.delete(`${API_URL}/items/${itemId}`, { headers: getAuthHeaders() });
}

export const fetchItems = () => {
    return axios.get(`${API_URL}/items`);
}

export const adminFetchAllUsers = () => {
    return axios.get(`${API_URL}/admin/all-users`, { headers: getAuthHeaders() });
}

export const adminDeleteUser = (username) => {
    return axios.delete(`${API_URL}/admin/delete-user/${username}`, { headers: getAuthHeaders() });
}

export const adminFetchUserItems = (username) => {
    return axios.get(`${API_URL}/admin/user-items/${username}`, { headers: getAuthHeaders() });
}

export const adminDeleteUserItem = (itemId) => {
    return axios.delete(`${API_URL}/admin/delete-item/${itemId}`, { headers: getAuthHeaders() });
}


export const createOrder = (orderItem) => {
    return axios.post(`${API_URL}/orders`, orderItem, { headers: getAuthHeaders() });
}

export const getOrderById = (orderId) => {
    return axios.get(`${API_URL}/orders/${orderId}`, { headers: getAuthHeaders() });
}

export const updateOrder = (orderId, updatedOrder) => {
    return axios.put(`${API_URL}/orders/${orderId}`, updatedOrder, { headers: getAuthHeaders() });
}

export const deleteOrder = (orderId) => {
    return axios.delete(`${API_URL}/orders/${orderId}`, { headers: getAuthHeaders() });
}

export const getUserOrders = () => {
    return axios.get(`${API_URL}/orders`, { headers: getAuthHeaders() });
}

export const checkOpenOrder = (orderItem) => {
    return axios.post(`${API_URL}/orders/check`, orderItem, { headers: getAuthHeaders() });
};





export const addItemToWishList = (itemId) => {
    return axios.post(`${API_URL}/wish-list`, { itemId }, { headers: getAuthHeaders() });
}

export const getWishList = () => {
    return axios.get(`${API_URL}/wish-list`, { headers: getAuthHeaders() });
}

export const deleteItemFromWishList = (itemId) => {
    return axios.delete(`${API_URL}/wish-list/delete-from-wish-list`, { headers: getAuthHeaders(), data: { itemId } });
}

export const deleteAllItemsFromWishList = (username) => {
    return axios.delete(`${API_URL}/wish-list/delete-users-wish-list`, { headers: getAuthHeaders(), data: { username } });
}
