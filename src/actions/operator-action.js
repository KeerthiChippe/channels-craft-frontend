import axios from "../config/axios";

export const startAddOperator = (data, resetForm) => {

    return async (dispatch) => {
        try {
            const response = await axios.post('/api/operator', data, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(addOperators(response.data))
            resetForm()
        } catch (err) {
            dispatch(serverErrors(err.response.data.errors))
        }
    }
}

const serverErrors = (msg) => {
    return { type: 'SET_SERVER_ERRORS', payload: msg }
}

const addOperators = (operatorData) => {
    return {
        type: 'ADD_OPERATOR',
        payload: operatorData
    }
}

export const startGetOperator = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/api/listAllOperators', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })

            dispatch(setOperator(response.data?.operator))
        } catch (err) {
            console.log(err)
        }
    }
}

const setOperator = (list) => {
    return { type: 'SET_OPERATOR', 
    payload: list }
}

export const StartRemoveOperator = (id) => {
    return async (dispatch) => {
        if (!id) {
            console.log("operator ID is missing for Deletion")
        } try {
            const response = await axios.delete(`/api/operator/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(RemoveOperator(id))
        } catch (err) {
            console.log(err)
        }
    }
}


const RemoveOperator = (id) => {
    return {
        type: 'REMOVE_OPERATOR',
        payload: id
    }
}

export const startEditOperator = (id,data) => {
    return async (dispatch) => {
        if (!id) {
            console.log("Operator ID is missing to Edit")
        } try {
            const response = await axios.put(`/api/operator/${id}`,data, {
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            })
            dispatch(EditOperator(response.data))
        } catch (err) {
            console.log(err)
        }
    }
}

const EditOperator = (id) => {
    return {
        type: 'EDIT_OPERATOR',
        payload: id
    }
}