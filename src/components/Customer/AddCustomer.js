// import { useState, useEffect } from "react"
// import _ from "lodash"
// import { useDispatch, useSelector } from "react-redux"
// import { startAddCustomer } from "../../actions/customer-action"
// import { startGetUser } from "../../actions/user-action"
// import { startGetOperator } from "../../actions/operator-action"
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Select from "react-select"
// import Swal from "sweetalert2"


// const AddCustomer = () => {
//     const dispatch = useDispatch()

//     const user = useSelector((state) => {
//         return state.user.data
//     })

//     const customers = useSelector((state) => {
//         return state.customer.data
//     })

//     const serverErrors = useSelector((state) => state.customer.serverErrors)

//     const operator = useSelector((state) => {
//         return state.operator.data
//     })

//     useEffect(() => {
//         dispatch(startGetUser())
//         dispatch(startGetOperator())
//     }, [dispatch])

//     const [customerName, setCustomerName] = useState('')
//     const [mobile, setMobile] = useState('')
//     const [boxNumber, setBoxNumber] = useState('')
//     const [formErrors, setFormErrors] = useState([])
//     const [userId, setUserId] = useState('')
//     const [operatorId, setOperatorId] = useState('')
//     const [selectedUser, setSelectedUser] = useState('')
//     const [address, setAddress] = useState({
//         doorNumber: '',
//         street: '',
//         city: '',
//         state: '',
//         pincode: ''
//     })
//     const errors = {}


//     function runValidation() {
//         if (_.isEmpty(customerName.trim())) {
//             errors.customerName = "customerName is required"
//         } else if (customerName.trim().length < 4 || customerName.trim().length > 64) {
//             errors.customerName = "username should be between 4-64 characters"
//         }
//         if (_.isEmpty(mobile)) {
//             errors.mobile = "mobile Number is required"
//         } else if (mobile.trim().length !== 10 && !_.isNumber(mobile)) {
//             errors.mobile = "mobile number must be 10 Numbers"
//         }
//         if (_.isEmpty(boxNumber.trim())) {
//             errors.boxNumber = "boxNumber is required"
//         } else if (boxNumber.trim().length !== 15 && !_.isNumber(boxNumber)) {
//             errors.boxNumber = "box number must be 15 digits"
//         }
//         if (_.isEmpty(address.doorNumber.trim())) {
//             errors.doorNumber = "Door Number cannot be Empty"
//         }
//         if (_.isEmpty(address.street.trim())) {
//             errors.street = "street cannot be Empty"
//         }
//         if (_.isEmpty(address.city.trim())) {
//             errors.city = "city cannot be Empty"
//         }
//         if (_.isEmpty(address.state.trim())) {
//             errors.state = "state cannot be Empty"
//         }

//         if (_.isEmpty(address.pincode.trim())) {
//             errors.pincode = "pincode cannot be Empty"
//         } else if (!(address.pincode.length === 6)) {
//             errors.pincode = "pincode must be 6 digits"
//         }
//     }

//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setAddress(prevAddress => ({ ...prevAddress, [name]: value }))
//         // Clear error for the changed field
//         setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
//         dispatch({ type: 'CLEAR_SERVER_ERRORS' })
//     };
//     const resetForm = () => {
//         setCustomerName('')
//         setMobile('')
//         setBoxNumber('')
//         setAddress({
//             doorNumber: '',
//             street: '',
//             city: '',
//             state: '',
//             pincode: ''
//         })
//         setSelectedUser('')
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         runValidation()
//         if (Object.keys(errors).length === 0) {
//             const formData = {
//                 customerName: customerName,
//                 mobile: mobile,
//                 boxNumber: boxNumber,
//                 userId: userId,
//                 address: {
//                     doorNumber: address.doorNumber,
//                     street: address.street,
//                     city: address.city,
//                     state: address.state,
//                     pincode: address.pincode
//                 },
//                 operatorId

//             }
//             try {
//                 await dispatch(startAddCustomer(formData, resetForm))
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Customer Added Successfully',
//                     showConfirmButton: false,
//                     timer: 3000
//                 })
//             } catch (error) {
//                 console.error('Error adding operator:', error)
//                 // Display error message using SweetAlert2 if needed
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Oops...',
//                     text: 'Something went wrong!',
//                 })
//             }
//         } else {
//             setFormErrors(errors)
//         }
//     }

//     const handleUserSelect = (selectedOption) => {
//         setSelectedUser(selectedOption)
//         setUserId(selectedOption.value)
//         setCustomerName(selectedOption.label)
//         setMobile(selectedOption.mobile)
//         setFormErrors((prevErrors) => ({
//             ...prevErrors,
//             customerName: "",
//             mobile: "",
//         }))
//         dispatch({ type: 'CLEAR_SERVER_ERRORS' })
//     }

//     const userOptions = user
//         .filter((user) => !customers.find((customer) => customer.userId === user._id))
//         .map((user) => ({
//             value: user._id,
//             label: user.username,
//             mobile: user.mobile,
//         }))

//     const fetchCityStateFromPincode = async () => {
//         try {
//             const response = await fetch(`https://api.postalpincode.in/pincode/${address.pincode}`)
//             const data = await response.json()

//             if (Array.isArray(data) && data.length > 0 && data[0]?.PostOffice?.length > 0) {
//                 const postOffice = data[0].PostOffice[0]
//                 setAddress({
//                     ...address,
//                     city: postOffice.District,
//                     state: postOffice.State
//                 })
//             }
//         } catch (error) {
//             console.error("Error fetching city and state:", error)
//         }
//     };


//     useEffect(() => {
//         if (address.pincode) {
//             fetchCityStateFromPincode()
//         }
//     }, [address.pincode])

//     return (


//         <div className="container mt-5 d-flex justify-content-center" >

//             <form onSubmit={handleSubmit} class="row g-3"  >
//                 <h3 style={{ marginLeft: "120px" }}>Add Customer</h3>
//                 <div style={{ width: 300 }}>
//                     <label>Select User</label>
//                     <Select
//                         value={selectedUser}
//                         onChange={handleUserSelect}
//                         options={userOptions}
//                         placeholder="Select a User"
//                         isSearchable
//                         noOptionsMessage={() => "No user found.."}
//                     />
//                 </div>


//                 <br />
//                 <div class="col-md-6">
//                     <label htmlFor="customerName">Name</label>
//                     <input type="text"
//                         value={customerName}
//                         class="form-control"
//                         placeholder="Name"
//                         id="customerName"
//                         onChange={(e) => {
//                             setCustomerName(e.target.value)
//                         }}
//                         disabled
//                     />
//                     <span className="error"> {formErrors.customerName && formErrors.customerName}</span>
//                 </div>
//                 <div class="col-md-6">
//                     <label htmlFor="mobile">Mobile</label>
//                     <input type="text"
//                         value={mobile}
//                         class="form-control"
//                         placeholder="Mobile"
//                         id="mobile"
//                         onChange={(e) => {
//                             setMobile(e.target.value)
//                         }}
//                         disabled
//                     />

//                     <span className="error">{formErrors.mobile && formErrors.mobile}</span><br />
//                 </div>
//                 <div class="col-12">
//                     <label htmlFor="boxNumber">Box Number</label><br />
//                     <input type="text"
//                         value={boxNumber}
//                         class="form-control"
//                         placeholder="box Number"
//                         id="boxNumber"
//                         onChange={(e) => {
//                             setBoxNumber(e.target.value);
//                             setFormErrors({ ...formErrors, boxNumber: '' })
//                         }}
//                     />
//                     <span className="error"> {formErrors.boxNumber && formErrors.boxNumber}</span>
//                 </div>
//                 <br />
//                 <label>ADDRESS</label><br />

//                 <div class="col-md-6">
//                     <label htmlFor="doorNumber">Door Number</label><br />
//                     <input type="text"
//                         value={address.doorNumber}
//                         class="form-control"
//                         placeholder="DoorNumber"
//                         id="DoorNumber"
//                         name='doorNumber'
//                         onChange={handleChange}
//                     />
//                     <span className="error"> {formErrors.doorNumber && formErrors.doorNumber}</span>
//                 </div>

//                 <div class="col-md-6">
//                     <label htmlFor="Street">Street</label>
//                     <input type="text"
//                         class="form-control"
//                         value={address.street}
//                         placeholder="Street"
//                         id="street"
//                         name='street'
//                         onChange={handleChange}
//                     /><br />
//                     <span className="error">{formErrors.street && formErrors.street}</span>
//                 </div >
//                 <div class="col-md-4">
//                     <label htmlFor="Pincode">pincode</label><br />
//                     <input type="text"
//                         value={address.pincode}
//                         class="form-control"
//                         placeholder="pincode"
//                         id="Pincode"
//                         name='pincode'
//                         onChange={handleChange} />
//                     <span className="error"> {formErrors.pincode && formErrors.pincode}</span>
//                 </div>

//                 <div class="col-md-4">
//                     <label htmlFor="city">city</label><br />
//                     <input type="text"
//                         value={address.city}
//                         class="form-control"
//                         placeholder="city"
//                         id="city"
//                         name='city'
//                         onChange={handleChange} />
//                     {/* <span className="error">{formErrors.city && formErrors.city}</span> */}
//                 </div>
//                 <div class="col-md-4">
//                     <label htmlFor="state">State</label><br />
//                     <input type="text"
//                         value={address.state}
//                         class="form-control"
//                         placeholder="state"
//                         id="state"
//                         name='state'
//                         onChange={handleChange} /><br />
//                     {/* <span className="error">{formErrors.state && formErrors.state}</span> <br /> */}
//                 </div>
//                 <p>{serverErrors}</p>
//                 <div class="col-12">
//                     <input type='submit' />
//                 </div>

//                 {/* <p>{serverErrors && serverErrors.map(error => <span key={error}>{error}</span>)}</p> */}

//             </form>

//         </div>
//     )
// }
// export default AddCustomer

import { useState, useEffect } from "react"
import _ from "lodash"
import { useDispatch, useSelector } from "react-redux"
import { startAddCustomer } from "../../actions/customer-action"
import { startGetUser } from "../../actions/user-action"
import { startGetOperator } from "../../actions/operator-action"
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from "react-select"
import Swal from "sweetalert2"

const AddCustomer = () => {
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.data)
    const customers = useSelector((state) => state.customer.data)
    const serverErrors = useSelector((state) => state.customer.serverErrors)
    const operator = useSelector((state) => state.operator.data)

    useEffect(() => {
        dispatch(startGetUser())
        dispatch(startGetOperator())
    }, [dispatch])

    const [customerName, setCustomerName] = useState('')
    const [mobile, setMobile] = useState('')
    const [boxNumber, setBoxNumber] = useState('')
    const [formErrors, setFormErrors] = useState([])
    const [userId, setUserId] = useState('')
    const [operatorId, setOperatorId] = useState('')
    const [selectedUser, setSelectedUser] = useState('')
    const [address, setAddress] = useState({
        doorNumber: '',
        street: '',
        city: '',
        state: '',
        pincode: ''
    })
    const errors = {}

    function runValidation() {
        if (_.isEmpty(customerName.trim())) {
            errors.customerName = "Customer name is required"
        } else if (customerName.trim().length < 4 || customerName.trim().length > 64) {
            errors.customerName = "Customer name should be between 4-64 characters"
        }
        if (_.isEmpty(mobile)) {
            errors.mobile = "Mobile number is required"
        } else if (mobile.trim().length !== 10 || !/^\d+$/.test(mobile)) {
            errors.mobile = "Mobile number must be exactly 10 digits"
        }
        if (_.isEmpty(boxNumber.trim())) {
            errors.boxNumber = "Box number is required"
        } else if (boxNumber.trim().length !== 15 || !/^\d+$/.test(boxNumber)) {
            errors.boxNumber = "Box number must be 15 digits"
        }
        if (_.isEmpty(address.doorNumber.trim())) {
            errors.doorNumber = "Door number cannot be empty"
        }
        if (_.isEmpty(address.street.trim())) {
            errors.street = "Street cannot be empty"
        }
        if (_.isEmpty(address.city.trim())) {
            errors.city = "City cannot be empty"
        }
        if (_.isEmpty(address.state.trim())) {
            errors.state = "State cannot be empty"
        }
        if (_.isEmpty(address.pincode.trim())) {
            errors.pincode = "Pincode cannot be empty"
        } else if (address.pincode.length !== 6) {
            errors.pincode = "Pincode must be 6 digits"
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setAddress(prev => ({ ...prev, [name]: value }))
        setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }))
        dispatch({ type: 'CLEAR_SERVER_ERRORS' })
    }

    const resetForm = () => {
        setCustomerName('')
        setMobile('')
        setBoxNumber('')
        setAddress({
            doorNumber: '',
            street: '',
            city: '',
            state: '',
            pincode: ''
        })
        setSelectedUser('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        runValidation()
        if (Object.keys(errors).length === 0) {
            const formData = {
                customerName,
                mobile,
                boxNumber,
                userId,
                operatorId,
                address
            }
            try {
                await dispatch(startAddCustomer(formData, resetForm))
            } catch (error) {
                console.error('Error adding customer:', error)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops... 😓',
                    text: 'Something went wrong!'
                })
            }
        } else {
            setFormErrors(errors)
        }
    }

    const handleUserSelect = (selectedOption) => {
        setSelectedUser(selectedOption)
        setUserId(selectedOption.value)
        setCustomerName(selectedOption.label)
        setMobile(selectedOption.mobile)
        setFormErrors((prev) => ({ ...prev, customerName: '', mobile: '' }))
        dispatch({ type: 'CLEAR_SERVER_ERRORS' })
    }

    const userOptions = user
        .filter((u) => !customers.find((c) => c.userId === u._id))
        .map((u) => ({
            value: u._id,
            label: u.username,
            mobile: u.mobile,
        }))

    const fetchCityStateFromPincode = async () => {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${address.pincode}`)
            const data = await response.json()
            if (Array.isArray(data) && data[0]?.PostOffice?.length > 0) {
                const postOffice = data[0].PostOffice[0]
                setAddress(prev => ({
                    ...prev,
                    city: postOffice.District,
                    state: postOffice.State
                }))
            }
        } catch (error) {
            console.error("Error fetching city and state:", error)
        }
    }

    useEffect(() => {
        if (address.pincode) {
            fetchCityStateFromPincode()
        }
    }, [address.pincode])

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <form onSubmit={handleSubmit} className="row g-3">
                <h3 style={{ marginLeft: "120px" }}>➕ Add Customer</h3>

                <div style={{ width: 300 }}>
                    <label>👤 Select User</label>
                    <Select
                        value={selectedUser}
                        onChange={handleUserSelect}
                        options={userOptions}
                        placeholder="Select a User"
                        isSearchable
                        noOptionsMessage={() => "No user found..."}
                    />
                </div>

                <div className="col-md-6">
                    <label htmlFor="customerName">🧑 Name</label>
                    <input
                        type="text"
                        value={customerName}
                        className="form-control"
                        id="customerName"
                        disabled
                    />
                    <span className="error text-danger">{formErrors.customerName}</span>
                </div>

                <div className="col-md-6">
                    <label htmlFor="mobile">📱 Mobile</label>
                    <input
                        type="text"
                        value={mobile}
                        className="form-control"
                        id="mobile"
                        disabled
                    />
                    <span className="error text-danger">{formErrors.mobile}</span>
                </div>

                <div className="col-12">
                    <label htmlFor="boxNumber">📦 Box Number</label>
                    <input
                        type="text"
                        value={boxNumber}
                        className="form-control"
                        id="boxNumber"
                        onChange={(e) => {
                            setBoxNumber(e.target.value)
                            setFormErrors(prev => ({ ...prev, boxNumber: '' }))
                        }}
                    />
                    <span className="error text-danger">{formErrors.boxNumber}</span>
                </div>

                <label className="mt-3">🏠 Address</label>

                <div className="col-md-6">
                    <label htmlFor="doorNumber">🚪 Door Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="doorNumber"
                        name="doorNumber"
                        value={address.doorNumber}
                        onChange={handleChange}
                    />
                    <span className="error text-danger">{formErrors.doorNumber}</span>
                </div>

                <div className="col-md-6">
                    <label htmlFor="street">🛣️ Street</label>
                    <input
                        type="text"
                        className="form-control"
                        id="street"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                    />
                    <span className="error text-danger">{formErrors.street}</span>
                </div>

                <div className="col-md-4">
                    <label htmlFor="pincode">📮 Pincode</label>
                    <input
                        type="text"
                        className="form-control"
                        id="pincode"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleChange}
                    />
                    <span className="error text-danger">{formErrors.pincode}</span>
                </div>

                <div className="col-md-4">
                    <label htmlFor="city">🏙️ City</label>
                    <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-md-4">
                    <label htmlFor="state">🗺️ State</label>
                    <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                    />
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary mt-2">✅ Submit</button>
                </div>

                {serverErrors && <p className="text-danger">{serverErrors}</p>}
            </form>
        </div>
    )
}

export default AddCustomer
