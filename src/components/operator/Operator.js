import { useState, useEffect } from "react";
import { useDispatch } from "react-redux"
import { startAddOperator } from "../../actions/operator-action";
import { useSelector } from "react-redux";
import { startGetUser } from "../../actions/user-action";
import { Row, Col } from "reactstrap"
import './operator.css'
import Select from 'react-select'
import Swal from 'sweetalert2';


const Operator = () => {

    const dispatch = useDispatch()

    const user = useSelector((state) => {
        return state.user.data || []
    })

    const operator = useSelector((state) => {
        return state.operator.data
    })

    useEffect(() => {
        dispatch(startGetUser())
    }, [])

    const [operatorName, setOperatorName] = useState('')
    const [city, setCity] = useState('')
    const [mobile, setMobile] = useState('')
    const [state, setState] = useState('')
    const [formErrors, setFormErrors] = useState([])
    const [selectedUser, setSelectedUser] = useState('')
    const [userId, setUserId] = useState('')

    const errors = {}

    function runValidation() {
        if (operatorName.trim().length === 0) {
            errors.operatorName = " operator name is required"
        }
        if (mobile.trim().length === 0) {
            errors.mobile = "mobile number is required"
        } else if (mobile.trim().length !== 10) {
            errors.mobile = "invalid mobile Number"
        }
        if (state.length === 0) {
            errors.state = "state is required"
        }
        if (city.length === 0) {
            errors.city = "city is required"
        }
        setFormErrors(errors)
    }

    const resetForm = () => {
        setOperatorName('')
        setMobile('')
        setCity('')
        setState('')
        setSelectedUser('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        runValidation()
        if (Object.keys(errors).length === 0) {
            const operatorData = {
                operatorName: operatorName,
                mobile: mobile,
                state: state,
                city: city,
                userId: userId,
            }
            try {
                await dispatch(startAddOperator(operatorData, resetForm))

                // Display success message using SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Operator Added Successfully',
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            catch (error) {
                console.error('Error adding operator:', error)
                // Display error message using SweetAlert2 if needed
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
            setFormErrors([])
        } else {
            setFormErrors(errors)
        }
    }

    const serverErrors = useSelector((state) => {
        return state.operator.serverErrors

    })
    // console.log(serverErrors)
    const clearFieldError = (fieldName) => {
        setFormErrors(prevErrors => {
            const newErrors = { ...prevErrors }
            delete newErrors[fieldName]
            return newErrors
        })
        dispatch({ type: 'SET_SERVER_ERRORS', payload: [] })
    }

    const handleChange = (selectedOption) => {
        setSelectedUser(selectedOption)
        setUserId(selectedOption.value)
        setOperatorName(selectedOption.label)
        setMobile(selectedOption.mobile)
        clearFieldError('operatorName')
        clearFieldError('mobile')
    }

    const options = user
        .filter(u => u.role === 'operator') // Filter users with role 'operator'
        .filter(u => !operator.find(op => op.userId === u._id)) // Filter out users who are already operators
        .map(user => ({
            value: user._id,
            label: user.username,
            mobile: user.mobile
        }))

    return (
        <div>
            <Row className="dth">
                <Col>
                    <form onSubmit={handleSubmit} style={{ textAlign: 'centre', fontWeight: 'bold' }} className="operator">
                        <h2>Add Operator</h2><br />

                        <div style={{ width: 200 }}>
                            <label>Select User</label>
                            <Select
                                value={selectedUser}
                                onChange={handleChange}
                                options={options}
                                placeholder="Select a user..."
                                isSearchable
                                noOptionsMessage={() => "No user found.."}
                            />
                        </div>
                        <br />

                        <label>Enter Operator Name</label><br />
                        <input
                            type="text"
                            placeholder="operatorName"
                            value={operatorName}
                            id="operatorName"
                            onChange={(e) => {
                                setOperatorName(e.target.value)
                                clearFieldError('operatorName')
                            }}
                            disabled /><br />
                        <span className={`error-message ${formErrors.operatorName ? 'visible' : 'hidden'}`}> {formErrors.operatorName && formErrors.operatorName}</span><br />

                        <label>Enter Mobile</label><br />
                        <input
                            type="text"
                            placeholder="mobile"
                            value={mobile}
                            id="mobile"
                            onChange={(e) => {
                                setMobile(e.target.value)
                                clearFieldError('mobile')
                            }}
                            disabled /><br />
                        <span className={`error-message ${formErrors.operatorName ? 'visible' : 'hidden'}`}> {formErrors.mobile && formErrors.mobile}<br /></span>

                        <label>Enter city</label><br />
                        <input
                            type="text"
                            placeholder="city"
                            value={city}
                            id="city"
                            onChange={(e) => {
                                setCity(e.target.value)
                                clearFieldError('city');
                            }} /> <br /><span className={`error-message ${formErrors.operatorName ? 'visible' : 'hidden'}`}>{formErrors.city && formErrors.city}</span>
                        <br />
                        <label>Enter State </label><br />
                        <input
                            type="text"
                            placeholder="State"
                            value={state}
                            id="State"
                            onChange={(e) => {
                                setState(e.target.value)
                                clearFieldError('state');
                            }} /><br />
                        <span className={`error-message ${formErrors.operatorName ? 'visible' : 'hidden'}`}>{formErrors.state && formErrors.state}</span>
                        <br />

                        <br />
                        <input type="submit" value="operator" className="btn btn-success"/>
                        <p className={serverErrors ? 'error-message' : ''}>{serverErrors}</p>
                    </form>
                </Col>
            </Row>
        </div>
    )
}


export default Operator