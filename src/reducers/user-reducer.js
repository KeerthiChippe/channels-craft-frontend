const userIntialState = { data: [] ,serverErrors:[] }

const userReducer = (state = userIntialState , action) =>{
    switch (action.type){
        case 'SET_USER':{
            return {...state , data: action.payload}
        }
        case 'UPDATE_USER':{
            return {...state, data: state.data.map((ele)=>{
                if(ele._id === action.payload._id){
                    return {...ele, ...action.payload}
                }else{
                    return {...ele}
                }
            })}
        }
        case 'SET_SERVER_ERRORS':{
            return{
                ...state , serverErrors:action.payload
            }
        }
        default :{
            return state
        }
    }
}
export default userReducer