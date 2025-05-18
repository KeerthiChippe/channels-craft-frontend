// import { useDispatch, useSelector } from "react-redux"
// import _ from "lodash"
// import { addDays, format } from 'date-fns'
// import { useState, useEffect, useContext } from "react"
// import { OperatorContext } from "./operatorContext"
// import { startGetUser, startUpdateUser } from "../../actions/user-action"
// import { startEditCustomer } from "../../actions/customer-action"
// import { StartGetCustomer } from "../../actions/customer-action"
// import { Modal, Form, Button, Card } from "react-bootstrap"
// import { startGetOrder } from "../../actions/order-action"
// import axios from "../../config/axios"
// import { Row, Col, Container } from "reactstrap"
// import './customerProfile.css'
// import Calendar from "./Calendar";
// import { toast } from "react-toastify"
// import 'react-toastify/dist/ReactToastify.css';
// import { ClipLoader } from "react-spinners"
// import { useParams } from "react-router-dom"
// import Swal from 'sweetalert2'

// const CustomerProfile = () => {
//   const dispatch = useDispatch();
//   const { id } = useParams()

//   const [isLoading, setIsLoading] = useState(true)
//   const { userState, userDispatch } = useContext(OperatorContext);

//   const order = useSelector((state) => {
//     return state.order
//   })
//   console.log(order, 'order')

//   useEffect(() => {
//     dispatch(StartGetCustomer())
//     dispatch(startGetOrder())
//   }, [dispatch])



//   const [formData, setFormData] = useState({
//     customerName: userState.userDetails.username,
//     mobile: userState.userDetails.mobile,
//     boxNumber: userState.customer.boxNumber,
//     address: {
//       doorNumber: '',
//       street: '',
//       city: '',
//       state: '',
//       pincode: ''
//     },
//     oldPassword: '',
//     newPassword: ''
//   });

//   useEffect(() => {
//     dispatch(StartGetCustomer())
//     dispatch(startGetUser())
//     dispatch(startGetOrder())
//   }, [dispatch])

//   const [profile, setProfile] = useState(null)
//   const [img, setImg] = useState({})
//   const [role, setRole] = useState("")

//   const [showModal, setShowModal] = useState(false)
//   const userId = userState.userDetails._id
//   const customerId = userState.customer._id

//   useEffect(() => {
//     if (localStorage.getItem('token').length > 0) {
//       setProfile(userState.userDetails.role)
//     }
//   }, [userState.userDetails.role])


//   useEffect(() => {
//     if (localStorage.getItem('token').length > 0) {
//       setRole(userState.userDetails.role)
//     }
//   }, [userState.userDetails.role])

//   useEffect(() => {
//     setIsLoading(false); // Once data is fetched, set isLoading to false
//   }, [userState])

//   const [isMobileOrPasswordUpdated, setIsMobileOrPasswordUpdated] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//     // Check if mobile or password field is being updated
//     if (e.target.name === 'mobile' || e.target.name === 'oldPassword' || e.target.name === 'newPassword') {
//       setIsMobileOrPasswordUpdated(true);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(startUpdateUser(userId, {
//         "oldPassword": formData.oldPassword,
//         "newPassword": formData.newPassword
//       }));
//       await dispatch(startEditCustomer(customerId, {
//         "mobile": formData.mobile,
//       }))
//       setFormData({
//         ...formData,
//         oldPassword: '',
//         newPassword: ''
//       });
//       if (isMobileOrPasswordUpdated) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Updated successfully!',
//           showConfirmButton: false,
//           timer: 1500
//         });
//       }
//       setIsMobileOrPasswordUpdated(false)
//     } catch (e) {
//       console.log(e)
//       toast.error('Failed to update password')
//     }
//   };

//   useEffect(() => {
//     const { userDetails, customer } = userState
//     const customerAddress = customer.address || {}

//     setFormData({
//       customerName: userDetails.username || '',
//       mobile: userDetails.mobile || '',
//       boxNumber: customer.boxNumber || '',
//       address: {
//         doorNumber: customerAddress.doorNumber || '',
//         street: customerAddress.street || '',
//         city: customerAddress.city || '',
//         state: customerAddress.state || '',
//         pincode: customerAddress.pincode || ''
//       },
//       oldPassword: '',
//       newPassword: '',
//       img: userState.customer.image
//     });
//   }, [userState]);

//   const handleUpload = (e) => {
//     e.preventDefault()

//     if (profile) {
//       const formData = new FormData()
//       formData.append('file', profile)
//       axios.put(`/api/customer/${customerId}/profile`, formData, {
//         headers: {
//           Authorization: localStorage.getItem('token')
//         }
//       })

//         .then(res => {
//           setShowModal(false)
//           setImg({ ...img, ...res.data })
//           userDispatch({
//             type: "SET_CUSTOMER_IMAGE",
//             payload: res.data.image
//           })
//         })
//         .catch(err => console.log(err))
//     }
//   }

//   const handleImageClick = () => {
//     setShowModal(true);
//   }
//   const handleImageChange = (e) => {
//     setProfile(e.target.files[0]);
//   }


//   const calculateFormattedDates = () => {
//     if (order.paid) {
//       const formattedDates = order.paid.reduce((acc, ele) => {

//         ele.packages?.forEach((pack) => {
//           const originalDate = new Date(ele.orderDate)
//           const futureDate = addDays(originalDate, 30)
//           const formattedDate = format(futureDate, 'yyyy-MM-dd')

//           acc.push({ type: 'package', name: pack.packageId?.packageName, expiryDate: formattedDate })
//         })

//         ele.channels?.forEach((chan) => {
//           const originalDate = new Date(ele.orderDate)
//           const futureDate = addDays(originalDate, 30)
//           const formattedDate = format(futureDate, 'yyyy-MM-dd')
//           acc.push({ type: 'channel', name: chan.channelId?.channelName, expiryDate: formattedDate })
//         })
//         return acc
//       }, [])
//       return formattedDates
//     }
//     return []
//   }

//   const formattedDates = calculateFormattedDates()

//   const renderCurrentPackagesAndChannels = () => {
//     return (
//       <div className="current">
//         <Row>
//           <Col md='6'>
//             <h4>Current packages</h4>
//             <Row>
//               {order.paid?.map(ele => ele.packages.map((pack) => {
//                 const originalDate = new Date(ele.orderDate);
//                 const futureDate = addDays(originalDate, 30);
//                 const formattedDate = format(futureDate, 'yyyy-MM-dd');
//                 if (new Date(formattedDate) > new Date()) {
//                   return (
//                     <Col key={pack._id} sm={6}>
//                       <Card className="mb-3">
//                         <Card.Body>
//                           <Card.Title>{pack.packageId?.packageName}</Card.Title>
//                           <Card.Text>
//                             Expiry Date: {formattedDate}
//                           </Card.Text>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   );
//                 }
//                 return null;
//               }))}
//             </Row>
//           </Col>

//           <Col>
//             <h4>Current channels</h4>
//             <Row>
//               {order.paid?.map(ele => ele.channels?.map((chan) => {
//                 const originalDate = new Date(ele.orderDate);
//                 const futureDate = addDays(originalDate, 30);
//                 const formattedDate = format(futureDate, 'yyyy-MM-dd');
//                 if (new Date(formattedDate) > new Date()) {
//                   return (
//                     <Col key={chan._id} sm={6}>
//                       <Card className="mb-3">
//                         <Card.Body>
//                           <Card.Title>{chan.channelId?.channelName}</Card.Title>
//                           <Card.Text>
//                             Expiry Date: {formattedDate}
//                           </Card.Text>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   );
//                 }
//                 return null;
//               }))}
//             </Row>
//           </Col>
//         </Row>
//       </div>
//     );
//   };


//   return (
//     // <div className="customer-profile-container d-flex justify-content-center align-items-center">
//     //   {!isLoading ? (
//     //     <Row>
//     //       <Col>

//     //         <img
//     //           className="rounded-circle mb-3 profile "
//     //           src={!_.isEmpty(formData.img) ? `http://localhost:3034/Images/${formData.img}` : process.env.PUBLIC_URL + '/service-pic.jpg'}
//     //           alt='image'
//     //           width="150px"
//     //           height="150px"
//     //           onClick={handleImageClick}
//     //         />

//     //         <Modal show={showModal} onHide={() => setShowModal(false)}>
//     //           <Modal.Header closeButton>
//     //             <Modal.Title>Upload Image</Modal.Title>
//     //           </Modal.Header>
//     //           <Modal.Body>
//     //             <Form onSubmit={handleUpload}>
//     //               <Form.Group controlId="formFile">
//     //                 <Form.Label>Choose Image</Form.Label>
//     //                 <Form.Control type="file" onChange={handleImageChange} />
//     //               </Form.Group><br />
//     //               <Button variant="primary" type="submit">
//     //                 Upload
//     //               </Button>
//     //             </Form>
//     //           </Modal.Body>
//     //         </Modal>

//     //         {userState.userDetails.role === 'customer' && (
//     //           <div>
//     //             <Form onSubmit={handleSubmit} className="small-cute-form">
//     //               <Form.Group controlId="formCustomerName">
//     //                 <Form.Label>Name</Form.Label>
//     //                 <Form.Control
//     //                   type="text"
//     //                   value={formData.customerName}
//     //                   onChange={handleChange}
//     //                   name="customerName"
//     //                   disabled
//     //                 />
//     //               </Form.Group>
//     //               <br />

//     //               <label>Mobile</label>
//     //               <input
//     //                 type="text"
//     //                 name="mobile"
//     //                 value={formData.mobile}
//     //                 onChange={handleChange}
//     //               />
//     //               <br />

//     //               <label>Box Number</label><br />
//     //               <input
//     //                 type="string"
//     //                 name="boxNumber"
//     //                 value={formData.boxNumber}
//     //                 onChange={handleChange}
//     //                 disabled
//     //               />
//     //               <br />
//     //               <br />
//     //               <label>Address</label>
//     //               <br />
//     //               <label>Door Number</label>
//     //               <input
//     //                 type="text"
//     //                 value={formData.address.doorNumber}
//     //                 name="doorNumber"
//     //                 onChange={(e) =>
//     //                   setFormData({
//     //                     ...formData,
//     //                     address: { ...formData.address, doorNumber: e.target.value }
//     //                   })
//     //                 }
//     //                 disabled
//     //               />
//     //               <br />

//     //               <label>Street</label>
//     //               <input
//     //                 type="text"
//     //                 value={formData.address.street}
//     //                 name="street"
//     //                 onChange={(e) =>
//     //                   setFormData({
//     //                     ...formData,
//     //                     address: { ...formData.address, street: e.target.value }
//     //                   })
//     //                 }
//     //                 disabled
//     //               />
//     //               <br />

//     //               <label>City</label>
//     //               <input
//     //                 type="text"
//     //                 value={formData.address.city}
//     //                 name="city"
//     //                 onChange={(e) =>
//     //                   setFormData({
//     //                     ...formData,
//     //                     address: { ...formData.address, city: e.target.value }
//     //                   })
//     //                 }
//     //                 disabled
//     //               />
//     //               <br />

//     //               <label>State</label>
//     //               <input
//     //                 type="text"
//     //                 value={formData.address.state}
//     //                 name="state"
//     //                 onChange={(e) =>
//     //                   setFormData({
//     //                     ...formData,
//     //                     address: { ...formData.address, state: e.target.value }
//     //                   })
//     //                 }
//     //                 disabled
//     //               />
//     //               <br />

//     //               <label>Pincode</label>
//     //               <input
//     //                 type="text"
//     //                 value={formData.address.pincode}
//     //                 name="pincode"
//     //                 onChange={(e) =>
//     //                   setFormData({
//     //                     ...formData,
//     //                     address: { ...formData.address, pincode: e.target.value }
//     //                   })
//     //                 }
//     //                 disabled
//     //               />
//     //               <br />

//     //               <label>Old Password</label>
//     //               <input
//     //                 type="password"
//     //                 name="oldPassword"
//     //                 value={formData.oldPassword}
//     //                 onChange={handleChange}
//     //               />
//     //               <br />

//     //               <label>New Password</label>
//     //               <input
//     //                 type="password"
//     //                 name="newPassword"
//     //                 value={formData.newPassword}
//     //                 onChange={handleChange}
//     //               />
//     //               <br />

//     //               <Button variant="primary" type="submit" className="mt-3">
//     //                 Submit
//     //               </Button>
//     //             </Form>

//     //             <Calendar formattedDates={formattedDates} />

//     //             {/* <h4>Current packages</h4>
//     //           {order.paid && order.paid.length > 0 ? (
//     //             <div>


//     //               <ul>

//     //                 {order.paid?.map(ele => ele.packages.map((pack) => {
//     //                   const originalDate = new Date(ele.orderDate);
//     //                   const futureDate = addDays(originalDate, 30);

//     //                   const formattedDate = format(futureDate, 'yyyy-MM-dd');
//     //                   return (
//     //                     <>
//     //                       <li key={pack._id}>{pack.packageId.packageName} - expiryDate - {formattedDate}</li>

//     //                     </>
//     //                   )

//     //                 }))}
//     //               </ul>

//     //             </div>
//     //           ) : (
//     //             <p>No packages available</p>
//     //           )}
//     //           <br />

//     //           <h4>Current channels</h4>
//     //           {order.paid && order.paid.length > 0 ? (
//     //             <div>

//     //               <ul>
//     //                 {order.paid?.map(ele => ele.channels?.map((chan) => {
//     //                   const originalDate = new Date(ele.orderDate);
//     //                   const futureDate = addDays(originalDate, 30);

//     //                   const formattedDate = format(futureDate, 'yyyy-MM-dd')
//     //                   console.log(formattedDate, "workx")
//     //                   return (
//     //                     <>
//     //                       <li key={chan._id}>{chan.channelId?.channelName} - expiryDate - {formattedDate}</li>
//     //                     </>
//     //                   )
//     //                 }))}
//     //               </ul>
//     //             </div>
//     //           ) : (
//     //             <p>No channels available</p>
//     //           )} */}


//     //             {order.paid && order.paid.length > 0 ? (
//     //               <div className="current">
//     //                 <Row>
//     //                   <Col md='6'>
//     //                     <h4>Current packages</h4>
//     //                     {/* {order.paid && order.paid.length > 0 ? ( */}
//     //                     <Row>
//     //                       {order.paid?.map(ele => ele.packages.map((pack) => {
//     //                         const originalDate = new Date(ele.orderDate)
//     //                         const futureDate = addDays(originalDate, 30)
//     //                         const formattedDate = format(futureDate, 'yyyy-MM-dd')
//     //                         if (new Date(formattedDate) > new Date()) {
//     //                           return (
//     //                             <Col key={pack._id} sm={6}>
//     //                               <Card className="mb-3">
//     //                                 <Card.Body>
//     //                                   <Card.Title>{pack.packageId?.packageName}</Card.Title>
//     //                                   <Card.Text>
//     //                                     Expiry Date: {formattedDate}
//     //                                   </Card.Text>
//     //                                 </Card.Body>
//     //                               </Card>
//     //                             </Col>
//     //                           );
//     //                         }
//     //                       }))}
//     //                     </Row>
//     //                   </Col>

//     //                   <Col>
//     //                     <h4>Current channels</h4>
//     //                     {/* {order.paid && order.paid.length > 0 ? ( */}

//     //                     <Row>
//     //                       {order.paid?.map(ele => ele.channels?.map((chan) => {
//     //                         console.log(chan.channelId.channelName, 'pay chan')
//     //                         const originalDate = new Date(ele.orderDate)
//     //                         const futureDate = addDays(originalDate, 30)
//     //                         const formattedDate = format(futureDate, 'yyyy-MM-dd')
//     //                         if (new Date(formattedDate) > new Date()) {
//     //                           return (
//     //                             <Col key={chan._id} sm={6}>
//     //                               <Card className="mb-3">
//     //                                 <Card.Body>
//     //                                   <Card.Title>{chan.channelId?.channelName}</Card.Title>
//     //                                   <Card.Text>
//     //                                     Expiry Date: {formattedDate}
//     //                                   </Card.Text>
//     //                                 </Card.Body>
//     //                               </Card>
//     //                             </Col>
//     //                           )
//     //                         }
//     //                       }))}
//     //                     </Row>
//     //                   </Col>
//     //                 </Row>
//     //               </div>
//     //             ) : (
//     //               <p>No packages or channels available</p>
//     //             )}

//     //           </div>

//     //         )}

//     //       </Col>
//     //     </Row>
//     //   ) : (
//     //     <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
//     //       <ClipLoader
//     //         color={"#7aa9ab"}
//     //         isLoading={isLoading}
//     //         size={30}
//     //       />
//     //     </div>

//     //   )}

//     // </div>

//     <>
//       <div className="customer-profile-container d-flex justify-content-center align-items-center">
//         {!isLoading ? (
//           <Row>
//             <Col>
//               <Row className="w-100">
//                 <Col className="text-center">
//                   <div className="profile-image-container">
//                     <img
//                       className="rounded-circle mb-3 profile "
//                       src={!_.isEmpty(formData.img) ? `http://localhost:3034/Images/${formData.img}` : process.env.PUBLIC_URL + '/service-pic.jpg'}
//                       alt='image'
//                       width="150px"
//                       height="150px"
//                       onClick={handleImageClick}
//                     />
//                   </div>
//                 </Col>
//               </Row>


//               <Modal show={showModal} onHide={() => setShowModal(false)}>
//                 <Modal.Header closeButton>
//                   <Modal.Title>Upload Image</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                   <Form onSubmit={handleUpload}>
//                     <Form.Group controlId="formFile">
//                       <Form.Label>Choose Image</Form.Label>
//                       <Form.Control type="file" onChange={handleImageChange} />
//                     </Form.Group><br />
//                     <Button variant="primary" type="submit">
//                       Upload
//                     </Button>
//                   </Form>
//                 </Modal.Body>
//               </Modal>

//               {userState.userDetails.role === 'customer' && (
//                 <div>
//                   <Form onSubmit={handleSubmit} className="small-cute-form">
//                     <Form.Group controlId="formCustomerName">
//                       <Form.Label>Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         value={formData.customerName}
//                         onChange={handleChange}
//                         name="customerName"
//                         disabled
//                       />
//                     </Form.Group>
//                     <br />

//                     <label>Mobile</label>
//                     <input
//                       type="text"
//                       name="mobile"
//                       value={formData.mobile}
//                       onChange={handleChange}
//                     />
//                     <br />

//                     <label>Box Number</label>
//                     <input
//                       type="text"
//                       name="boxNumber"
//                       value={formData.boxNumber}
//                       onChange={handleChange}
//                       disabled
//                     />
//                     <br /><br />

//                     <label>Address</label><br />
//                     <label>Door Number</label>
//                     <input
//                       type="text"
//                       value={formData.address.doorNumber}
//                       name="doorNumber"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           address: { ...formData.address, doorNumber: e.target.value }
//                         })
//                       }
//                       disabled
//                     />
//                     <br />

//                     <label>Street</label>
//                     <input
//                       type="text"
//                       value={formData.address.street}
//                       name="street"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           address: { ...formData.address, street: e.target.value }
//                         })
//                       }
//                       disabled
//                     />
//                     <br />

//                     <label>City</label>
//                     <input
//                       type="text"
//                       value={formData.address.city}
//                       name="city"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           address: { ...formData.address, city: e.target.value }
//                         })
//                       }
//                       disabled
//                     />
//                     <br />

//                     <label>State</label>
//                     <input
//                       type="text"
//                       value={formData.address.state}
//                       name="state"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           address: { ...formData.address, state: e.target.value }
//                         })
//                       }
//                       disabled
//                     />
//                     <br />

//                     <label>Pincode</label>
//                     <input
//                       type="text"
//                       value={formData.address.pincode}
//                       name="pincode"
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           address: { ...formData.address, pincode: e.target.value }
//                         })
//                       }
//                       disabled
//                     />
//                     <br />

//                     <label>Old Password</label>
//                     <input
//                       type="password"
//                       name="oldPassword"
//                       value={formData.oldPassword}
//                       onChange={handleChange}
//                     />
//                     <br />

//                     <label>New Password</label>
//                     <input
//                       type="password"
//                       name="newPassword"
//                       value={formData.newPassword}
//                       onChange={handleChange}
//                     />
//                     <br />

//                     <Button variant="primary" type="submit" className="mt-3">
//                       Submit
//                     </Button>
//                   </Form>

//                   <Calendar formattedDates={formattedDates} />
//                 </div>
                
//               )}
              
//             </Col>
//           </Row>

//         ) : (
//           <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
//             <ClipLoader color={"#7aa9ab"} isLoading={isLoading} size={30} />
//           </div>
//         )}
//       </div>


//       {!isLoading && userState.userDetails.role === 'customer' && order.paid && order.paid.length > 0 && (
//         <div className="current packages-channels">
//           <Row>
//             <Col md='6'>
//               <h4>Current packages</h4>
//               <Row>
//                 {order.paid?.map(ele => ele.packages.map((pack) => {
//                   const originalDate = new Date(ele.orderDate);
//                   const futureDate = addDays(originalDate, 30);
//                   const formattedDate = format(futureDate, 'yyyy-MM-dd');
//                   if (new Date(formattedDate) > new Date()) {
//                     return (
//                       <Col key={pack._id} sm={6}>
//                         <Card className="mb-3">
//                           <Card.Body>
//                             <Card.Title>{pack.packageId?.packageName}</Card.Title>
//                             <Card.Text>
//                               Expiry Date: {formattedDate}
//                             </Card.Text>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     );
//                   }
//                 }))}
//               </Row>
//             </Col>
//             </Row>
              
//             <Row>
//             <Col md='6'>
//               <h4>Current channels</h4>
//               <Row>
//                 {order.paid?.map(ele => ele.channels?.map((chan) => {
//                   console.log(chan.channelId.channelName, 'pay chan');
//                   const originalDate = new Date(ele.orderDate);
//                   const futureDate = addDays(originalDate, 30);
//                   const formattedDate = format(futureDate, 'yyyy-MM-dd');
//                   if (new Date(formattedDate) > new Date()) {
//                     return (
//                       <Col key={chan._id} sm={6}>
//                         <Card className="mb-3">
//                           <Card.Body>
//                             <Card.Title>{chan.channelId?.channelName}</Card.Title>
//                             <Card.Text>
//                               Expiry Date: {formattedDate}
//                             </Card.Text>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     );
//                   }
//                 }))}
//               </Row>
//             </Col>
//           </Row>
//         </div>
//       )}
//     </>
//   )
// }

// export default CustomerProfile




import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { addDays, format } from "date-fns";
import { useState, useEffect, useContext } from "react";
import { OperatorContext } from "./operatorContext";
import { startGetUser, startUpdateUser } from "../../actions/user-action";
import { startEditCustomer, StartGetCustomer } from "../../actions/customer-action";
import { startGetOrder } from "../../actions/order-action";
import axios from "../../config/axios";
import { Row, Col, Form, Button, Card, Modal, Upload, Spin, Input, Typography,Flex,Image,Avatar,Radio} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Empty, Tooltip, Progress } from 'antd';
import { GiftOutlined, VideoCameraOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './SubscriptionsCard.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Calendar from "./Calendar";
import { motion, AnimatePresence } from 'framer-motion';
import {  differenceInDays } from 'date-fns';

const { Title, Text } = Typography;

const CustomerProfile = () => {
  const [viewMode, setViewMode] = useState('packages');
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { userState, userDispatch } = useContext(OperatorContext);
  const order = useSelector((state) => state.order);
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    customerName: userState.userDetails.username || "",
    mobile: userState.userDetails.mobile || "",
    boxNumber: userState.customer.boxNumber || "",
    address: {
      doorNumber: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    oldPassword: "",
    newPassword: "",
    img: userState.customer.image || "",
  });

  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userId = userState.userDetails._id;
  const customerId = userState.customer._id;
  const [isMobileOrPasswordUpdated, setIsMobileOrPasswordUpdated] = useState(false);
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
    hover: { scale: 1.03, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };
  useEffect(() => {
    dispatch(StartGetCustomer());
    dispatch(startGetUser());
    dispatch(startGetOrder());
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const { userDetails, customer } = userState;
    const customerAddress = customer.address || {};
    const newFormData = {
      customerName: userDetails.username || "",
      mobile: userDetails.mobile || "",
      boxNumber: customer.boxNumber || "",
      address: {
        doorNumber: customerAddress.doorNumber || "",
        street: customerAddress.street || "",
        city: customerAddress.city || "",
        state: customerAddress.state || "",
        pincode: customerAddress.pincode || "",
      },
      oldPassword: "",
      newPassword: "",
      img: userState.customer.image || "",
    };
    setFormData(newFormData);
    form.setFieldsValue(newFormData);
  }, [userState, form]);

  const handleChange = (changedValues) => {
    setFormData((prev) => ({ ...prev, ...changedValues }));
    if (["mobile", "oldPassword", "newPassword"].some((key) => key in changedValues)) {
      setIsMobileOrPasswordUpdated(true);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        startUpdateUser(userId, {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        })
      );
      await dispatch(
        startEditCustomer(customerId, {
          mobile: values.mobile,
        })
      );
      setFormData((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
      form.setFieldsValue({ oldPassword: "", newPassword: "" });
      if (isMobileOrPasswordUpdated) {
        Swal.fire({
          icon: "success",
          title: "Updated successfully! 🎉",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setIsMobileOrPasswordUpdated(false);
    } catch (e) {
      console.log(e);
      toast.error("Failed to update password 😔");
    }
  };

  const handleUpload = async () => {
    if (profile) {
      const uploadData = new FormData();
      uploadData.append("file", profile.file.originFileObj);
      try {
        const res = await axios.put(`/api/customer/${customerId}/profile`, uploadData, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setShowModal(false);
        setFormData((prev) => ({ ...prev, img: res.data.image }));
        userDispatch({
          type: "SET_CUSTOMER_IMAGE",
          payload: res.data.image,
        });
        toast.success("Profile image updated! 📸");
      } catch (err) {
        console.log(err);
        toast.error("Failed to upload image 😢");
      }
    }
  };

  const handleImageClick = () => setShowModal(true);

  const calculateFormattedDates = () => {
    if (order.paid) {
      return order.paid.reduce((acc, ele) => {
        ele.packages?.forEach((pack) => {
          const originalDate = new Date(ele.orderDate);
          const futureDate = addDays(originalDate, 30);
          const formattedDate = format(futureDate, "yyyy-MM-dd");
          acc.push({
            type: "package",
            name: pack.packageId?.packageName,
            expiryDate: formattedDate,
          });
        });
        ele.channels?.forEach((chan) => {
          const originalDate = new Date(ele.orderDate);
          const futureDate = addDays(originalDate, 30);
          const formattedDate = format(futureDate, "yyyy-MM-dd");
          acc.push({
            type: "channel",
            name: chan.channelId?.channelName,
            expiryDate: formattedDate,
          });
        });
        return acc;
      }, []);
    }
    return [];
  };

  const formattedDates = calculateFormattedDates();
  const getRemainingDays = (orderDate) => {
    const originalDate = new Date(orderDate);
    const futureDate = addDays(originalDate, 30);
    const remainingDays = differenceInDays(futureDate, new Date());
    return Math.max(0, remainingDays);
  };

  return (
    <div >
      {isLoading ? (
        <div className="flex justify-center items-center h-[59vh]">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[1, 0]}>
          <Col xs={24} md={6}style={{padding:"5px",alignItems:"center"}} >
   
         
            <Card >
            <Flex className="flex justify-center items-center mb-6" style={{marginLeft:150}}>
            <Image
  src={
    !_.isEmpty(formData.img)
      ? `http://localhost:3034/Images/${formData.img}`
      : process.env.PUBLIC_URL + "/service-pic.jpg"
  }
  alt="Profile"
  width={180}
  height={180}
  onClick={handleImageClick}
  style={{   cursor: "pointer",
    border: "4px solid rgb(168, 152, 152)",
    boxShadow: "0 4px 8px rgba(159, 138, 138, 0.1)",
    marginLeft:150, display: "block", margin: "0 auto",borderRadius: "10%",  }}
  preview={true}
  
/>
      {/* <Avatar
        size={200}
        src={
          !_.isEmpty(formData.img)
            ? `http://localhost:3034/Images/${formData.img}`
            : process.env.PUBLIC_URL + "/service-pic.jpg"
        }
        alt="Profile"
        style={{
          cursor: "pointer",
          border: "4px solid rgb(168, 152, 152)",
          boxShadow: "0 4px 8px rgba(159, 138, 138, 0.1)",
          marginLeft:150
        }}
        onClick={handleImageClick}
      /> */}
    </Flex>
    {userState.userDetails.role === "customer" && (
      <Form
        form={form}
        onFinish={handleSubmit}
        onValuesChange={handleChange}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item label={<Text strong>Name 👤</Text>} name="customerName">
          <Input disabled className="bg-gray-100" />
        </Form.Item>
        <Form.Item label={<Text strong>Mobile 📱</Text>} name="mobile">
          <Input />
        </Form.Item>
        <Form.Item label={<Text strong>Box Number 📺</Text>} name="boxNumber">
          <Input disabled className="bg-gray-100" />
        </Form.Item>
        <Title level={5} className="mb-4">
          Address 🏠
        </Title>
        <Row gutter={[16, 16]}>
          {[
            { label: "Door Number", name: "doorNumber" },
            { label: "Street", name: "street" },
            { label: "City", name: "city" },
            { label: "State", name: "state" },
            { label: "Pincode", name: "pincode" },
          ].map(({ label, name }) => (
            <Col xs={24} md={8} key={name}>
              <Form.Item label={<Text strong>{label}</Text>} name={["address", name]}>
                <Input disabled className="bg-gray-100" />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item label={<Text strong>Old Password 🔒</Text>} name="oldPassword">
          <Input.Password />
        </Form.Item>
        <Form.Item label={<Text strong>New Password 🔑</Text>} name="newPassword">
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-blue-600 hover:bg-blue-700"
          >
            Submit 🚀
          </Button>
        </Form.Item>
      </Form>
    )}
  </Card>
          </Col>
          <Col xs={24} md={6}>
      {userState.userDetails.role === 'customer' && order.paid?.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="subscription-card"
        >
          <Card className="shadow-md rounded-xl overflow-hidden subscription-container">
            <Flex style={{justifyContent:"space-between"}}>
              
            <Title level={4} className="mb-6 text-gradient">
              <GiftOutlined className="mr-2" /> Current Subscriptions
            </Title>
            <Radio.Group
      value={viewMode}
      onChange={(e) => setViewMode(e.target.value)}
      className="custom-radio-group mb-4"
      buttonStyle="solid"
    >
      <Radio.Button value="packages">Packages</Radio.Button>
      <Radio.Button value="channels">Channels</Radio.Button>
    </Radio.Group>
            </Flex>
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px',paddingLeft:"8px" }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={24}>
                  <AnimatePresence>
                    {viewMode === 'packages' ? (
                      <>
                        <Title level={5} className="section-title">
                          <GiftOutlined className="mr-2 icon-accent" /> Packages
                        </Title>
                        {order.paid.map((ele, index) =>
                          ele.packages.map((pack) => {
                            const originalDate = new Date(ele.orderDate);
                            const futureDate = addDays(originalDate, 30);
                            const formattedDate = format(futureDate, 'MMM dd, yyyy');
                            const remainingDays = getRemainingDays(ele.orderDate);
                            if (new Date(futureDate) > new Date()) {
                              return (
                                <motion.div
                                  key={pack._id}
                                  custom={index}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                  whileHover="hover"
                                  exit="hidden"
                                  className="mb-4"
                                >
                                  <Card className="subscription-item shadow-sm hoverable">
                                    <Card.Meta
                                      title={
                                        <div className="flex items-center">
                                          <Text strong className="text-primary">
                                            {pack.packageId?.packageName}
                                          </Text>
                                          <Tooltip title="Package details">
                                            <InfoCircleOutlined className="ml-2 text-gray-400 hover:text-primary" />
                                          </Tooltip>
                                        </div>
                                      }
                                      description={
                                        <div>
                                          <Text type="secondary" className="expiry-text">
                                            Expires: {formattedDate}
                                          </Text>
                                          <Progress
                                            percent={(remainingDays / 30) * 100}
                                            size="small"
                                            status="active"
                                            strokeColor={{
                                              '0%': '#1890ff',
                                              '100%': '#52c41a',
                                            }}
                                            showInfo={false}
                                            className="mt-2"
                                          />
                                          <Text className="status-active">
                                            {remainingDays} days left
                                          </Text>
                                        </div>
                                      }
                                    />
                                  </Card>
                                </motion.div>
                              );
                            }
                            return null;
                          })
                        )}
                      </>
                    ) : (
                      <>
                        <Title level={5} className="section-title">
                          <VideoCameraOutlined className="mr-2 icon-accent" /> Channels
                        </Title>
                        {order.paid.map((ele, index) =>
                          ele.channels?.map((chan) => {
                            const originalDate = new Date(ele.orderDate);
                            const futureDate = addDays(originalDate, 30);
                            const formattedDate = format(futureDate, 'MMM dd, yyyy');
                            const remainingDays = getRemainingDays(ele.orderDate);
                            if (new Date(futureDate) > new Date()) {
                              return (
                                <motion.div
                                  key={chan._id}
                                  custom={index}
                                  variants={cardVariants}
                                  initial="hidden"
                                  animate="visible"
                                  whileHover="hover"
                                  exit="hidden"
                                  className="mb-4"
                                >
                                  <Card className="subscription-item shadow-sm hoverable">
                                    <Card.Meta
                                      title={
                                        <div className="flex items-center">
                                          <Text strong className="text-primary">
                                            {chan.channelId?.channelName}
                                          </Text>
                                          <Tooltip title="Channel details">
                                            <InfoCircleOutlined className="ml-2 text-gray-400 hover:text-primary" />
                                          </Tooltip>
                                        </div>
                                      }
                                      description={
                                        <div>
                                          <Text type="secondary" className="expiry-text">
                                            Expires: {formattedDate}
                                          </Text>
                                          <Progress
                                            percent={(remainingDays / 30) * 100}
                                            size="small"
                                            status="active"
                                            strokeColor={{
                                              '0%': '#1890ff',
                                              '100%': '#52c41a',
                                            }}
                                            showInfo={false}
                                            className="mt-2"
                                          />
                                          <Text className="status-active">
                                            {remainingDays} days left
                                          </Text>
                                        </div>
                                      }
                                    />
                                  </Card>
                                </motion.div>
                              );
                            }
                            return null;
                          })
                        )}
                      </>
                    )}
                  </AnimatePresence>
                </Col>
              </Row>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card className="shadow-md text-center empty-card rounded-xl">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text className="text-muted">
                  No subscriptions available 😕
                  <br />
                  <Text className="text-primary cursor-pointer hover:underline">
                    Explore plans now!
                  </Text>
                </Text>
              }
            />
          </Card>
        </motion.div>
      )}
    </Col>
          <Col xs={24} md={12}>
              <Calendar formattedDates={formattedDates} />
          </Col>
        </Row>
      )}
      <Modal
        title="Upload Profile Image 📸"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Upload
          beforeUpload={(file) => {
            setProfile({ file });
            return false;
          }}
          maxCount={1}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Choose Image</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={!profile}
          className="mt-4 bg-blue-600 hover:bg-blue-700"
        >
          Upload 🚀
        </Button>
      </Modal>
    </div>
  );
};

export default CustomerProfile;
