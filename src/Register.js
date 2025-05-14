import { useEffect, useState } from "react";
import { isEmail } from "validator";
import axios from "./config/axios";
import { useNavigate } from "react-router-dom";
import './Register.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from "reactstrap"
import { jwtDecode } from 'jwt-decode'

export default function Register({ registerToast }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("");
  const [role, setRole] = useState('')
  const [formErrors, setFormErrors] = useState({});
  const [serverErrors, setServerErrors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwtDecode(token)
      setRole(decodedToken.role)
    }
  }, [])

  const errors = {};

  function runValidations() {
    if (username.trim().length === 0) {
      errors.username = "username is required";
    } else if (username.trim().length < 4 || username.trim().length > 64) {
      errors.username = "username should be between 4-64 characters";
    }

    if (email.trim().length === 0) {
      errors.email = "email is required";
    } else if (!isEmail(email)) {
      errors.email = "invalid email format";
    }

    if (mobile.trim().length === 0) {
      errors.mobile = "mobile Number is required"
    } else if (isNaN(mobile.trim())) {
      errors.mobile = "should contain only numbers"
    }
    else if (mobile.trim().length !== 10) {
      errors.mobile = "invalid mobile Number"
    }

    if (password.trim().length === 0) {
      errors.password = "password is required";
    } else if (password.trim().length < 8 || password.trim().length > 128) {
      errors.password = "password should be between 8-128 characters";
    }

    setFormErrors(errors);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    runValidations();

    if (Object.keys(errors).length === 0) {
      setFormErrors({});

      try {
        const formData = { username, email, password, mobile, role };
        // console.log(formData);
        if (role === 'admin') {
          formData.role = 'operator'
        } else if (role === 'operator') {
          formData.role = 'customer'
        }
        const response = await axios.post("/api/users/register", formData, {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        setUsername('');
        setEmail('');
        setMobile('');
        setPassword('');
        navigate("/");
        registerToast()

      } catch (error) {
        if (error.response && error.response.data) {
          const serverErrors = error.response.data.errors || []
          // setFormErrors({ serverErrors })
          setServerErrors(serverErrors)
          console.log(error)
        } else {
          console.error("Unexpected error:", error)
        }
      }
    }
  }
  const clearFieldError = (fieldName) => {
    setFormErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[fieldName];
      return newErrors;
    });
    setServerErrors([]);
  }

  return (
    <Row className="width">
      <Col>
        <form onSubmit={handleSubmit} className="user">
          <h2 style={{ fontWeight: 'bold' }}>Create An Account</h2>
          <div >
            <label style={{ fontWeight: 'bold' }} htmlFor="username" >Username</label><br />
            <input
              type="text"
              placeholder="enter your name..."
              value={username}
              id="username"
              onChange={(e) => {
                setUsername(e.target.value);
                clearFieldError('username')
              }}
            />
          </div>
          {formErrors.username && <span className="error">{formErrors.username}</span>}
          <br />

          <div>
            <label style={{ fontWeight: 'bold' }} htmlFor="email">Email</label><br />
            <input
              type="text"
              placeholder="enter email..."
              value={email}
              id="email"
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError('email')
              }}
            />
          </div>
          {formErrors.email && <span className="error">{formErrors.email}</span>}
          <br />

          <div>
            <label style={{ fontWeight: 'bold' }} htmlFor="mobile">Mobile</label><br />
            <input
              type="string"
              placeholder="enter mobile..."
              value={mobile}
              id="mobile"
              onChange={(e) => {
                setMobile(e.target.value)
                clearFieldError('mobile')
              }}
            /><br />
            {formErrors.mobile && <span className="error">{formErrors.mobile}</span>}
          </div>
          <br />
          <div>
            <label style={{ fontWeight: 'bold' }} htmlFor="password">Password</label><br />
            <input
              type="password"
              placeholder="enter password..."
              value={password}
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError('password')
              }}
            />
          </div>
          {formErrors.password && <span className="error">{formErrors.password}</span>}
          <br />

          <div>
            <input type="submit" value="create" className="btn btn-success" />
          </div>
          
          {serverErrors.length > 0 && (
            <ul className="error">
              {serverErrors.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
            </ul>
          )}
        </form>
      </Col>
    </Row>
  )
}
