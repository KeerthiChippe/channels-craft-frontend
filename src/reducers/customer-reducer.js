const CustomerInitialState ={ data : []  ,serverErrors:[]}

const customerReducer =(state = CustomerInitialState ,action ) =>{
    switch(action.type){
        case "ADD_CUSTOMER" :{
            return {...state , data:[...state.data, action.payload]}
        }
        case 'SET_CUSTOMER' :{
            return { ...state , data:action.payload}
        }
        case 'SINGLE_CUSTOMER':{
            return {...state, data: action.payload}
        }
        case 'REMOVE_CUSTOMER' :{
            const newData = state.data.filter(customer => customer._id !== action.payload)
            return{ ...state , data:newData}
        }
        case 'EDIT_CUSTOMER' :{
            return { ...state , data : state.data.map ((customer) =>{
                if(customer._id === action.payload._id){
                    return {...customer , mobile:action.payload.mobile}
                }else{
                    return { ...customer}
                }
            })}
        }
        case 'SET_SERVER_ERRORS':{
            return {
                ...state,
                serverErrors: action.payload,
            }
        }
        default :{
            return{...state}
        }
    }
}
export default customerReducer