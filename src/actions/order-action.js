import axios from "../config/axios"

export const startCreateOrder = (formData) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('/api/orders', formData, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            console.log(response.data, "order created")
            dispatch(createOrder(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}

const createOrder = (data) => {
    return {
        type: 'CREATE_ORDER',
        payload: data
    }
}

const serverErrors = (msg) => {
    return {
        type: 'SET_SERVER_ERRORS',
        payload: msg
    }
}


export const startGetOrder = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/api/orders', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(getOrder(response.data))
            console.log(response.data, "listorders")
        } catch (e) {
            console.log(e)
        }
    }
}

const getOrder = (data) => {
    return {
        type: 'SET_ORDER',
        payload: data
    }
}

export const startGetAllOrders = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/api/allorders', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(getAllOrders(response.data))
            // console.log(response.data, "all orders")
        } catch (e) {
            console.log(e)
        }
    }
}

const getAllOrders = (data) => {
    return {
        type: 'GET_ALL_ORDERS',
        payload: data
    }
}

export const startGetPackage = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/api/listAllPackages')
            console.log(response.data, "22")
            dispatch(setPackage(response.data))
        } catch (e) {
            console.log(e)
        }
    }
}

const setPackage = (list) => {
    return {
        type: 'SET_PACKAGE',
        payload: list
    }
}

export const selectedPackageOne = (data) => {
    return {
        type: 'SELECTED_PACKAGE_ONE',
        payload: data
    }
}

export const selectedChannelOne = (data) => {
    return {
        type: 'SELECTED_CHANNEL_ONE',
        payload: data
    }
}

export const deletePackageOne = (data) => {
    console.log(data, "hhhhhhh")
    return {
        type: 'DELETED_PACKAGE_ONE',
        payload: data
    }
}