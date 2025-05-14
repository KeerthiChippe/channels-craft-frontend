import { BrowserRouter, Route, Routes} from "react-router-dom"
import { useEffect, useReducer } from "react";
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "./config/axios";
import Home from "./Home/Home";
import Login from "./Login";
import AddChannel from "./components/channels/AddChannels";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import AddPackage from "./components/packages/AddPackage";
import PackagesContainer from "./components/packages/PackagesContainer";
import OperatorContainer from "./components/operator/operatorcontainer";
import DeletedPackage from "./components/packages/DeletedPackage";
import UserContainer from "./components/user/userContainer";
import userReducer from "./useReducer-reducer/userReducer";
import OperatorProfile from "./components/profile/OperatorProfile";
import { OperatorContext } from "./components/profile/operatorContext";
import CreateOrder from "./components/orders/CreateOrder";
import CustomerProfile from "./components/profile/CustomerProfile";
import Navbar from "./Home/navbar/Navbar";
// import OrdersList from "./OrdersList.";
import CustomerContainer from "./components/Customer/customerContainer";
import { useDispatch } from "react-redux";
import { startGetUser } from "./actions/user-action";
import Failure from "./Payment/Failure";
import Success from "./Payment/Success";
import Cart from "./components/orders/Cart";
import OrderPayment from "./components/orders/OrderPayment";
import AdminDashboard from "./Dashboard/Dashboard";
import OperatorDashboard from "./operator_dashboard/OperatorDashboard";
import ActivateOrders from "./operator_dashboard/ActivateOrders";
import PrivateRoute from "./Home/navbar/PrivateRoute";
import ExpiredOrders from "./components/profile/ExpiredOrders";
import BuyAgain from "./components/orders/BuyAgain";

function App() {
  const dispatch = useDispatch()
  const [userState, userDispatch] = useReducer(userReducer, {
    userDetails: {},
    operator: {},
    customer: {}, 
    cart:[],
    isLoggedIn:false
  })

  const registerToast = ()=>{
    toast.success('Successfully created account', {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true

    })
  }

  const loginToast =() =>{
    toast.success('logged in succesfully', {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    })
  }

  const resetPassword = ()=>{
    toast('password updated successfully', {
      position: "top-right",
      autoClose: 2000
    })
  }

  const addOperator = ()=>{
    toast.success('Successfully created operator', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    })
  }

  const addCustomer = ()=>{
    toast.success('Successfully created customer', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    })
  }

  const addPackage = ()=>{
    toast.success('Successfully added package', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    })
  }

  const addChannel = ()=>{
    toast.success('Successfully added channel', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    })
  }
  
  useEffect(()=>{
    dispatch(startGetUser())
  }, [dispatch])

  useEffect(()=>{
    if(localStorage.length > 0){
      userDispatch({
        type: "SIGN_IN_TOGGLE",
        payload: true
    })
    }
  }, [dispatch, userState.isLoggedIn])

  
  useEffect(()=>{
    const fetchUserData = async ()=>{
      try{
        if(localStorage.getItem('token')){
          const userDetails = await axios.get('/api/users/profile', {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
          // console.log(userDetails.data)
          userDispatch({type: 'SET_USER', payload: userDetails.data})

          if(userDetails.data.role === 'operator'){
            const operator = await axios.get('/api/operator/profile', {
              headers: {
                Authorization: localStorage.getItem('token')
              }
            })
            // console.log(operator.data)
            userDispatch({type: 'SET_OPERATOR_PROFILE', payload: operator.data})
          }

          if(userDetails.data.role === 'customer'){
            const customer = await axios.get('/api/customer/profile', {
              headers: {
                Authorization: localStorage.getItem('token')
              }
            })
            userDispatch({type: 'SET_CUSTOMER_PROFILE', payload: customer.data})
          }
        }
      }catch(e){
        console.log(e)
      }
    }
    fetchUserData()
    }, [userDispatch, userState.isLoggedIn])

   return (
    <div>
    <OperatorContext.Provider value={{userState, userDispatch}}>
    <BrowserRouter>
      <div className="app">
      <div className="app" style={{ backgroundColor: "#E9F1FA", minHeight: "100vh" }}>
       {/* <Header /> */}
       <Navbar />
        <Routes>
          <Route path='/' element={<Home/> }/>
          <Route path='/register' element={<UserContainer registerToast={registerToast}/>} />
          <Route path='/login' element={<Login loginToast = {loginToast} />}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/reset-password/:id/:token' element={<ResetPassword resetPassword={resetPassword} />} />
          <Route path='/operatorcontainer' element={<OperatorContainer addOperator={addOperator} />} />
          <Route path='/packages' element={<AddPackage addPackage={addPackage} />} />
          <Route path='/packcha' element={<PackagesContainer />} />
          <Route path='/activateOrders' element={<ActivateOrders />} />
          <Route path='/channels' element = {<AddChannel addChannel={addChannel} />} />
          <Route path='/deletedPackages' element={<DeletedPackage />} />
          <Route path = '/customercontainer' element={<CustomerContainer addCustomer={addCustomer}/>} />
          <Route path='/profile' element={<OperatorProfile />} />
          <Route path='/customerProfile' element={
            <PrivateRoute>
              <CustomerProfile />
            </PrivateRoute>
          } />
          {/* <Route path='/orderslist' element={<OrdersList />} /> */}
          <Route path='/order' element={<CreateOrder />} />
          <Route path='/cart' element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />
          <Route path='/failure' element={<Failure />} />
          <Route path='/success' element={<Success />} />
          <Route path='/dashboard' element={<AdminDashboard />} />
          <Route path='/operatorDashboard' element={
            <PrivateRoute>
              <OperatorDashboard />
            </PrivateRoute>
          } />
          <Route path='/orderpay' element={<OrderPayment />} />
          <Route path='/buyagain' element = {<BuyAgain />} />
          <Route path='/yourOrders' element={<ExpiredOrders />} />
        </Routes>
       
      </div>
      </div>
      <ToastContainer />
    </BrowserRouter>
    </OperatorContext.Provider>
  </div>
  )
}

export default App
