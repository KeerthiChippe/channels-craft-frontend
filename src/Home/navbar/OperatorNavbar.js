import { useContext } from "react"
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { OperatorContext } from "../../components/profile/operatorContext";
import { isEmpty } from "lodash";
import logo from '../../images/main.png'

export default function OperatorNavbar() {
    const { userDispatch } = useContext(OperatorContext)

    const handleLogout = () => {
        localStorage.clear('')
        userDispatch({
            type: "SIGN_IN_TOGGLE",
            payload: false
        })
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg " >
                <div className="container-fluid">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <Link className="navbar-brand" to="/">
                            <img src={logo} alt="Channel Craft Logo" className="rounded-circle" style={{ width: '60px', height: '60px' }} />
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            {/* <li>
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li> */}
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/register">Create Account</Link>
                            </li>
                            {isEmpty(localStorage.getItem('token')) && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            )}

                            <li className="nav-item">
                                <Link className="nav-link" to="/customercontainer">Customer</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/packcha">Packages & Channels</Link>
                            </li>
                            
                            <li className="nav-item">
                                <Link className="nav-link" to="/activateOrders">Activate orders</Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to="/order">order</Link>
                            </li> */}
                        </div>
                    </ul>

                    <div className="d-flex">
                            <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/operatorDashboard">Dashboard</Link>
                            </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        <i className="bi bi-person-circle fs-5"></i>
                                    </Link>
                                </li>
                                {!isEmpty(localStorage.getItem('token')) && (
                                    <li className="nav-item">
                                    <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
                                </li>
                                )}
                                
                            </ul>
                        </div>
                </div>
            </nav>
        </div>
    )
}