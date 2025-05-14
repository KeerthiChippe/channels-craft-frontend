import axios from '../config/axios'

export const startAddCustomer = (data, resetForm) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('/api/customers', data, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            console.log(response.data, 'customer')
            dispatch(addCustomer(response.data))
            resetForm()
        } catch (err) {
            dispatch(serverErrors(err.response.data.errors[0].msg))
        }

    }
}

const serverErrors = (msg) => {
    return {
        type: 'SET_SERVER_ERRORS',
        payload: msg
    }
}
const addCustomer = (formData) => {
    return {
        type: 'ADD_CUSTOMER',
        payload: formData
    }
}

export const StartGetCustomer = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/api/listAllCustomers', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            // console.log(response.data,"123")
            dispatch(setCustomer(response.data))
        } catch (err) {
            console.log(err)
        }
    }
}

const setCustomer = (list) => {
    return {
        type: 'SET_CUSTOMER',
        payload: list
    }
}

export const startGetSingleCustomer = (id)=>{
    return async (dispatch)=>{
        try{
            const response = await axios.get(`/api/singleCustomer/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            console.log(response.data, "amma")
            dispatch(setSingleCustomer(response.data))
        }catch(e){
            console.log(e)
        }
    }
}

const setSingleCustomer = (data)=>{
    return{
        type: 'SINGLE_CUSTOMER',
        payload: data
    }
}
export const startRemoveCustomer = (id, operatorId) => {
    return async (dispatch) => {
        if (!id) {
            console.log("customer Id is missing for Deletion", id)
        }
         try {
            const response = await axios.delete(`/api/customer/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(RemoveCustomer(id))
        } catch (err) {
            console.log(err)
        }
    }
}

const RemoveCustomer = (id) => {
    return {
        type: 'REMOVE_CUSTOMER',
        payload: id
    }
}

export const startEditCustomer = (id, data) => {
    return async (dispatch) => {
        if (!id) {
            console.log(" customer ID is missing to Edit")
        } try {
            const response = await axios.put(`/api/customer/${id}`, data, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(EditCustomer(response.data))
        } catch (err) {
            console.log(err)
        }
    }
}

const EditCustomer = (data) => {
    return {
        type: 'EDIT_CUSTOMER',
        payload: data
    }
}