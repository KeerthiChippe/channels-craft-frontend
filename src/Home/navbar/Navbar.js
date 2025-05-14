import { jwtDecode } from "jwt-decode"
import AdminNavbar from "./AdminNavbar"
import OperatorNavbar from "./OperatorNavbar"
import CustomerNavbar from "./CustomerNavbar"
import { useEffect, useState, useContext } from "react"
import { OperatorContext } from "../../components/profile/operatorContext"



const Navbar = () =>{
    const { userState } = useContext(OperatorContext)
    const [userRole, setUserRole] = useState("")

    // useEffect(()=>{
    //     if(userState.userDetails.role){
    //         setRole(userState.userDetails.role)
    //     }
    // }, [userState.userDetails.role])
    
    
    useEffect(()=>{
        if(localStorage.getItem('token')){
            const {role} = jwtDecode(localStorage.getItem("token"))
            setUserRole(role)
        }
    }, [localStorage.getItem('token')])

    
    const navbarCondition = () => {
            if (userRole === 'admin') {
                return <AdminNavbar />;
            } else if (userRole === 'operator') {
                return <OperatorNavbar />;
            } else if (userRole === 'customer') {
                return <CustomerNavbar />;
            }
    }

    
    return (
        <div>
            {!userState.isLoggedIn ? (
                 <>
                    <CustomerNavbar />
                 </>
            ) : (
                <>
                    {navbarCondition()}
                </>
            )}
        </div>
    )
}

export default Navbar
















// import { jwtDecode } from "jwt-decode"
// import { isEmpty } from "lodash"
// import AdminNavbar from "./AdminNavbar"
// import OperatorNavbar from "./OperatorNavbar"
// import CustomerNavbar from "./CustomerNavbar"
// import { useContext } from "react"
// import { OperatorContext } from "../../components/profile/operatorContext"
// import { Link } from "react-router-dom"

// const Navbar = () =>{
//     const {userState, userDispatch} = useContext(OperatorContext)

//     const navbarCondition = ()=>{
//         const role = jwtDecode(localStorage.getItem('token')).role
//         console.log(role, 'rolekkkk')
//         if(role === 'admin'){
//             return <AdminNavbar />
//         }else if (role === 'operator'){
//             return <OperatorNavbar />
//         }else if(role === 'customer'){
//             return <CustomerNavbar />
//         }
//     }

//     return (
//         <div>
//             {isEmpty(userState.userDetails) ? (
//                 <>
//                 <Link to='/'>Home</Link>
//                 <Link to='/login'>Login</Link>
//                 <Link to='/register'>Register</Link>
//                 </>
//             ): (
//                 <>
//                     {navbarCondition()}
//                 </>
//             )}
//         </div>
//     )
// }
// export default Navbar

