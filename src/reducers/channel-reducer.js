const channelInitialState = {data: [] ,serverErrors :[]}

const channelReducer = (state = channelInitialState, action)=> {
    switch (action.type) {
        case 'ADD_CHANNEL': {
            return {...state, data: [...state.data, action.payload]}
        }
        case 'SET_CHANNEL': {
            return {...state, data: action.payload}
        }
        case 'REMOVE_CHANNEL': {
            return {...state, data: state.data.filter(ele => ele._id !== action.payload)}
        }
        case 'EDIT_CHANNEL': {
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
        default: {
            return {...state}
        }
    }
}

export default channelReducer