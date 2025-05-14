import {createStore, combineReducers, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import packageReducer from '../reducers/package-reducer'
import operatorReducer from '../reducers/operator-reducer'
import channelReducer from '../reducers/channel-reducer'
import userReducer from '../reducers/user-reducer'
import customerReducer from '../reducers/customer-reducer'
import { orderReducer } from '../reducers/order-reducer'

const configureStore = ()=>{
    const store = createStore(combineReducers({
        operator: operatorReducer,
        package: packageReducer, 
        channel: channelReducer,
        user:userReducer,
        customer:customerReducer,
        order: orderReducer
    }), applyMiddleware(thunk))
    return store
}

export default configureStore











// import { createStore , applyMiddleware , combineReducers} from 'redux'
// import {thunk} from 'redux-thunk'
// //import Operator from '../components/Addoperator'
// import operatorReducer from '../reducers/operator-reducer'
// //import operatorReducer from '../reducers/operator-reducer'

// const configureStore =()=>{ 
//     const store = createStore (combineReducers ({
//     Operator:operatorReducer,

    
// }),applyMiddleware(thunk))
// return store
// }

// export default configureStore
