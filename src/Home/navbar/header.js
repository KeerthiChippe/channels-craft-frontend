import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from "jwt-decode";

const Header = () => {
    const [role, setRole] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleLogin = ()=>{
        setIsLoggedIn(!isLoggedIn)
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token)
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
            console.log(decodedToken)
        }
    }, []);

    const handleLogout = ()=>{
        localStorage.clear('')
        
    }

    return (
         <div >
            <nav className="navbar navbar-expand-lg ">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Channel Craft</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            
                                <>
                                     <li className="nav-item">
                                 <Link className="nav-link active" aria-current="page" to="/register">Create Account</Link>
                             </li>
                             <li className="nav-item">
                                 <Link className="nav-link" to="/login">Login</Link>
                             </li>
                                </>
                           
                            <li className="nav-item">
                                <Link className="nav-link" to="/operatorcontainer">Operator</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/customercontainer">Customer</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/packages">Packages</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/packcha">Packages & Channels</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/deletedPackages">Deleted Packages</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/channels">Channels</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/order">order</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/customerProfile">customer profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
                            </li>
                          
                        </ul>
               
                    </div>
                    
                </div>
               
            </nav>
         </div>
    );
}

export default Header;
