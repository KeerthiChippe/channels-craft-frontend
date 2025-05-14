const operatorInitialState ={data :[] ,serverErrors:[]}

const operatorReducer = (state = operatorInitialState , action) =>{
    switch (action.type){
        case "ADD_OPERATOR":{
            return{...state ,data:[...state.data, action.payload]}
        }
        case 'SET_OPERATOR': {
            return {...state, data: action.payload}
        }
        case 'REMOVE_OPERATOR':{
            const newData = state.data.filter(operator => operator._id !== action.payload)
            return{...state , data:newData}
        }
        case 'EDIT_OPERATOR' :{
            
            return {...state, data: state.data.map((operator)=>{
                if(operator._id === action.payload._id){
                    return {...operator, mobile:action.payload}
                }else{
                    return {...operator}
                }
            })}
        }
        case 'SET_SERVER_ERRORS':{
            return{
                ...state , serverErrors:action.payload
            }
        }
        default:{

           return{...state}
    }

    }
}
export default operatorReducer