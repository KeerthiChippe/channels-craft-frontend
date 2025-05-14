import axios from "../config/axios";

export const startAddPackage = (data, resetForm, addPackage)=>{
    return async(dispatch)=>{
        try{
            const response = await axios.post('/api/packages', data, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(addPackages(response.data))
            resetForm()
            addPackage()
        }catch(e){
            console.log(e, "error")
            dispatch(serverErrors(e.response.data.errors))
        }
    }
}

const serverErrors = (msg)=>{
    return {
        type: 'SET_SERVER_ERRORS',
         payload: msg
        }
}

const addPackages = (data)=>{
    return {
        type: 'ADD_PACKAGE',
        payload: data
    }
}

export const startGetPackage = () =>{
    return async(dispatch)=>{
        try{
            const response = await axios.get('/api/listAllPackages')
            dispatch(setPackage(response.data))
        }catch(e){
            console.log(e)
        }
    }
}

const setPackage = (list)=>{
    return {
        type: 'SET_PACKAGE',
        payload: list
    }
}

export const startGetDeletedPackage = ()=>{
    return async(dispatch)=>{
        try{
            const response = await axios.get('/api/listAllDeletedPackages', {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(setDeletedPackage(response.data))
        }catch(e){
            console.log(e)
        }
    }
}

const setDeletedPackage = (data) =>{
    return {
        type: 'SET_DELETED_PACKAGE',
        payload: data
    }
}

// export const startRemovePackage = (id)=>{
//     return async(dispatch)=>{
//         if (!id) {
//             console.error("Missing package ID for deletion.")
//         }
//         try{
//             // console.log(id)
//             const response = await axios.delete(`/api/packages/${id}`, {
//                 headers: {
//                     Authorization: localStorage.getItem('token')
//                 }
//             })
//             dispatch(removePackage(id))
//         }catch(e){
//             console.log(e)
//         }
//     }
// }




export const startRemovePackage = (id) =>{
    return async(dispatch) =>{
        try{
            const response = await axios.delete(`/api/packages?id=${id}&type=delete`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(removePackage(response.data))
        }catch(e){
            console.log(e)
        }
    }
}

const removePackage = (id) =>{
    return {
        type: 'REMOVE_PACKAGE',
        payload: id
    }
}

export const startUndoPackage = (id)=>{
    return async(dispatch)=>{
        try{
            const response = await axios.delete(`/api/packages?id=${id}&type=undo`, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(undoPackage(response.data))
        }catch(e){
            console.log(e)
        }
    }
}

const undoPackage = (data)=>{
    return {
        type: 'UNDO_PACKAGE',
        payload: data
    }
}

export const startEditPackage = (id, formData) =>{
    return async(dispatch)=> {
        if (!id){
            console.error('Missing package id to edit')
        }
        try{
            const response = await axios.put(`/api/packages/${id}`, formData, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            dispatch(editPackage(response.data))
        }catch(e){
            console.log(e)
        }
    }
}

const editPackage = (data) =>{
    return {
        type: 'EDIT_PACKAGE',
        payload: data
    }
}