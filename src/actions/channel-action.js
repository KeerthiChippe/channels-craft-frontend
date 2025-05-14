import axios from "../config/axios";

export const startAddChannel = (data, resetForm, addChannel)=>{
    return async(dispatch) =>{
        try{
            const response = await axios.post('/api/channels', data, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(addChannels(response.data))
            resetForm()
            addChannel()
        }catch(e){
            dispatch(serverErrors(e.response.data.errors[0].msg))
        }
    }
}

const addChannels = (data)=>{
    return {
        type: 'ADD_CHANNEL',
        payload: data
    }
}

const serverErrors = (msg) =>{
    return {
     type : 'SET_SERVER_ERRORS' ,
     payload :msg
    }
}

export const startGetChannel = ()=>{
    return async(dispatch)=>{
        try{
            const response = await axios.get('/api/listAllChannels')
            dispatch(setChannel(response.data))
        }catch(e){
            console.log(e)
        }
    }
}

const setChannel = (data) =>{
    return {
        type: 'SET_CHANNEL',
        payload: data
    }
}

export const startRemoveChannel = (id)=>{
    return async(dispatch) =>{
        if (!id) {
            console.error("Missing channel ID for deletion.")
        }
        try{
            const response = await axios.delete(`/api/deleteChannel/${id}`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(removeChannel(id))
        }catch(e){
            console.log(e)
        }
    }
}

const removeChannel = (id) =>{
    return {
        type: 'REMOVE_CHANNEL',
        payload: id
    }
}

export const startEditChannel = (id, formData)=>{
    return async(dispatch) =>{
        if (!id) {
            console.error("Missing channel ID for updation.")
        }
        try{
            const response = await axios.put(`/api/updateChannel/${id}`, formData, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(editChannel(response.data))
        }catch(e){
            console.log(e)
        }
    }
}

const editChannel = (data) =>{
    return {
        type: 'EDIT_CHANNEL',
        payload: data
    }
}