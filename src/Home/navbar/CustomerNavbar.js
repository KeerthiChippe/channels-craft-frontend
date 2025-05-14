import { useContext } from "react"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { OperatorContext } from "../../components/profile/operatorContext"
import { isEmpty } from "lodash";
import logo from '../../images/main.png'

export default function CustomerNavbar() {
    const { userDispatch } = useContext(OperatorContext)
    const cart = useSelector((state) => {
        return state
    })
    const cartTotal = cart.order.packages.length + cart.order.channels.length

    const handleLogout = () => {
        localStorage.clear('')
        userDispatch({
            type: "SIGN_IN_TOGGLE",
            payload: false
        })
    }

    // rgba(57, 123, 177, 0.2)
    // "rgba(11, 48, 194, 0.2)" 
    // style={{ backgroundColor: "rgba(11, 48, 194, 0.2)" }}

    return (
        <div>
            <nav className="navbar navbar-expand-lg" >
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
                            {isEmpty(localStorage.getItem('token')) && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            )}

                            <li className="nav-item">
                                <Link className="nav-link" to="/packcha">Packages & Channels</Link>
                            </li>


                        </div>
                    </ul>
                    <div className="d-flex">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/cart"><i className="bi bi-cart-fill fs-5"></i>({cartTotal})</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/customerProfile">
                                    <i className="bi bi-person-circle fs-5"></i>
                                </Link>
                            </li>
                            {!isEmpty(localStorage.getItem('token')) && (
                                <>

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/yourOrders">Your orders</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
                                    </li>
                                </>
                            )}

                        </ul>
                    </div>

                </div>
            </nav>
        </div>
    )
}