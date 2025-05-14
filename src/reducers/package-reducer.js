const packageInitialState = {data: [], deletedPackages: [] ,serverErrors:[]}

const packageReducer = (state = packageInitialState, action)=>{
    switch (action.type){
        case 'ADD_PACKAGE': {
            return {...state, data: [...state.data, action.payload]}
        }
        case 'SET_PACKAGE': {
            return {...state, data: action.payload}
        }
        case 'REMOVE_PACKAGE': {
            // const newData = state.data.map(ele => ele._id !== action.payload)
            // return {...state, data: newData}
            // return {...state, data: state.data.map((ele)=>{
            //     if(ele._id === action.payload._id){
            //         return {...ele, ...action.payload}
            //     } else{
            //         return {...ele}
            //     }
            // })}
            return {...state, data: state.data.filter((ele)=> ele._id !== action.payload._id),
                deletedPackages: [...state.deletedPackages, action.payload]}
        }
        case 'SET_DELETED_PACKAGE':{
            return {...state, deletedPackages: action.payload}
        }
        case 'UNDO_PACKAGE': {
            return {...state, deletedPackages: state.deletedPackages.filter((ele)=>ele._id !== action.payload._id),
                data: [...state.data, action.payload]
                // if(ele._id === action.payload._id){
                //     return {...ele, ...action.payload, data: [...state.data, action.payload]}
                
                // } else{
                //     return {...ele}
                // }
            }
        }
        case 'EDIT_PACKAGE': {
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

export default packageReducer