import { useDispatch, useSelector } from "react-redux"
import _ from "lodash"
import { addDays, format } from 'date-fns'
import { useState, useEffect, useContext } from "react"
import { OperatorContext } from "./operatorContext"
import { startGetUser, startUpdateUser } from "../../actions/user-action"
import { startEditCustomer } from "../../actions/customer-action"
import { StartGetCustomer } from "../../actions/customer-action"
import { Modal, Form, Button, Card } from "react-bootstrap"
import { startGetOrder } from "../../actions/order-action"
import axios from "../../config/axios"
import { Row, Col, Container } from "reactstrap"
import './customerProfile.css'
import Calendar from "./Calendar";
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners"
import { useParams } from "react-router-dom"
import Swal from 'sweetalert2'

const CustomerProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const { userState, userDispatch } = useContext(OperatorContext);

  const order = useSelector((state) => {
    return state.order
  })
  console.log(order, 'order')

  useEffect(() => {
    dispatch(StartGetCustomer())
    dispatch(startGetOrder())
  }, [dispatch])



  const [formData, setFormData] = useState({
    customerName: userState.userDetails.username,
    mobile: userState.userDetails.mobile,
    boxNumber: userState.customer.boxNumber,
    address: {
      doorNumber: '',
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    oldPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    dispatch(StartGetCustomer())
    dispatch(startGetUser())
    dispatch(startGetOrder())
  }, [dispatch])

  const [profile, setProfile] = useState(null)
  const [img, setImg] = useState({})
  const [role, setRole] = useState("")

  const [showModal, setShowModal] = useState(false)
  const userId = userState.userDetails._id
  const customerId = userState.customer._id

  useEffect(() => {
    if (localStorage.getItem('token').length > 0) {
      setProfile(userState.userDetails.role)
    }
  }, [userState.userDetails.role])


  useEffect(() => {
    if (localStorage.getItem('token').length > 0) {
      setRole(userState.userDetails.role)
    }
  }, [userState.userDetails.role])

  useEffect(() => {
    setIsLoading(false); // Once data is fetched, set isLoading to false
  }, [userState])

  const [isMobileOrPasswordUpdated, setIsMobileOrPasswordUpdated] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Check if mobile or password field is being updated
    if (e.target.name === 'mobile' || e.target.name === 'oldPassword' || e.target.name === 'newPassword') {
      setIsMobileOrPasswordUpdated(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(startUpdateUser(userId, {
        "oldPassword": formData.oldPassword,
        "newPassword": formData.newPassword
      }));
      await dispatch(startEditCustomer(customerId, {
        "mobile": formData.mobile,
      }))
      setFormData({
        ...formData,
        oldPassword: '',
        newPassword: ''
      });
      if (isMobileOrPasswordUpdated) {
        Swal.fire({
          icon: 'success',
          title: 'Updated successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      }
      setIsMobileOrPasswordUpdated(false)
    } catch (e) {
      console.log(e)
      toast.error('Failed to update password')
    }
  };

  useEffect(() => {
    const { userDetails, customer } = userState
    const customerAddress = customer.address || {}

    setFormData({
      customerName: userDetails.username || '',
      mobile: userDetails.mobile || '',
      boxNumber: customer.boxNumber || '',
      address: {
        doorNumber: customerAddress.doorNumber || '',
        street: customerAddress.street || '',
        city: customerAddress.city || '',
        state: customerAddress.state || '',
        pincode: customerAddress.pincode || ''
      },
      oldPassword: '',
      newPassword: '',
      img: userState.customer.image
    });
  }, [userState]);

  const handleUpload = (e) => {
    e.preventDefault()

    if (profile) {
      const formData = new FormData()
      formData.append('file', profile)
      axios.put(`/api/customer/${customerId}/profile`, formData, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })

        .then(res => {
          setShowModal(false)
          setImg({ ...img, ...res.data })
          userDispatch({
            type: "SET_CUSTOMER_IMAGE",
            payload: res.data.image
          })
        })
        .catch(err => console.log(err))
    }
  }

  const handleImageClick = () => {
    setShowModal(true);
  }
  const handleImageChange = (e) => {
    setProfile(e.target.files[0]);
  }


  const calculateFormattedDates = () => {
    if (order.paid) {
      const formattedDates = order.paid.reduce((acc, ele) => {

        ele.packages?.forEach((pack) => {
          const originalDate = new Date(ele.orderDate)
          const futureDate = addDays(originalDate, 30)
          const formattedDate = format(futureDate, 'yyyy-MM-dd')

          acc.push({ type: 'package', name: pack.packageId?.packageName, expiryDate: formattedDate })
        })

        ele.channels?.forEach((chan) => {
          const originalDate = new Date(ele.orderDate)
          const futureDate = addDays(originalDate, 30)
          const formattedDate = format(futureDate, 'yyyy-MM-dd')
          acc.push({ type: 'channel', name: chan.channelId?.channelName, expiryDate: formattedDate })
        })
        return acc
      }, [])
      return formattedDates
    }
    return []
  }

  const formattedDates = calculateFormattedDates()

  const renderCurrentPackagesAndChannels = () => {
    return (
      <div className="current">
        <Row>
          <Col md='6'>
            <h4>Current packages</h4>
            <Row>
              {order.paid?.map(ele => ele.packages.map((pack) => {
                const originalDate = new Date(ele.orderDate);
                const futureDate = addDays(originalDate, 30);
                const formattedDate = format(futureDate, 'yyyy-MM-dd');
                if (new Date(formattedDate) > new Date()) {
                  return (
                    <Col key={pack._id} sm={6}>
                      <Card className="mb-3">
                        <Card.Body>
                          <Card.Title>{pack.packageId?.packageName}</Card.Title>
                          <Card.Text>
                            Expiry Date: {formattedDate}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                }
                return null;
              }))}
            </Row>
          </Col>

          <Col>
            <h4>Current channels</h4>
            <Row>
              {order.paid?.map(ele => ele.channels?.map((chan) => {
                const originalDate = new Date(ele.orderDate);
                const futureDate = addDays(originalDate, 30);
                const formattedDate = format(futureDate, 'yyyy-MM-dd');
                if (new Date(formattedDate) > new Date()) {
                  return (
                    <Col key={chan._id} sm={6}>
                      <Card className="mb-3">
                        <Card.Body>
                          <Card.Title>{chan.channelId?.channelName}</Card.Title>
                          <Card.Text>
                            Expiry Date: {formattedDate}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                }
                return null;
              }))}
            </Row>
          </Col>
        </Row>
      </div>
    );
  };


  return (
    // <div className="customer-profile-container d-flex justify-content-center align-items-center">
    //   {!isLoading ? (
    //     <Row>
    //       <Col>

    //         <img
    //           className="rounded-circle mb-3 profile "
    //           src={!_.isEmpty(formData.img) ? `http://localhost:3034/Images/${formData.img}` : process.env.PUBLIC_URL + '/service-pic.jpg'}
    //           alt='image'
    //           width="150px"
    //           height="150px"
    //           onClick={handleImageClick}
    //         />

    //         <Modal show={showModal} onHide={() => setShowModal(false)}>
    //           <Modal.Header closeButton>
    //             <Modal.Title>Upload Image</Modal.Title>
    //           </Modal.Header>
    //           <Modal.Body>
    //             <Form onSubmit={handleUpload}>
    //               <Form.Group controlId="formFile">
    //                 <Form.Label>Choose Image</Form.Label>
    //                 <Form.Control type="file" onChange={handleImageChange} />
    //               </Form.Group><br />
    //               <Button variant="primary" type="submit">
    //                 Upload
    //               </Button>
    //             </Form>
    //           </Modal.Body>
    //         </Modal>

    //         {userState.userDetails.role === 'customer' && (
    //           <div>
    //             <Form onSubmit={handleSubmit} className="small-cute-form">
    //               <Form.Group controlId="formCustomerName">
    //                 <Form.Label>Name</Form.Label>
    //                 <Form.Control
    //                   type="text"
    //                   value={formData.customerName}
    //                   onChange={handleChange}
    //                   name="customerName"
    //                   disabled
    //                 />
    //               </Form.Group>
    //               <br />

    //               <label>Mobile</label>
    //               <input
    //                 type="text"
    //                 name="mobile"
    //                 value={formData.mobile}
    //                 onChange={handleChange}
    //               />
    //               <br />

    //               <label>Box Number</label><br />
    //               <input
    //                 type="string"
    //                 name="boxNumber"
    //                 value={formData.boxNumber}
    //                 onChange={handleChange}
    //                 disabled
    //               />
    //               <br />
    //               <br />
    //               <label>Address</label>
    //               <br />
    //               <label>Door Number</label>
    //               <input
    //                 type="text"
    //                 value={formData.address.doorNumber}
    //                 name="doorNumber"
    //                 onChange={(e) =>
    //                   setFormData({
    //                     ...formData,
    //                     address: { ...formData.address, doorNumber: e.target.value }
    //                   })
    //                 }
    //                 disabled
    //               />
    //               <br />

    //               <label>Street</label>
    //               <input
    //                 type="text"
    //                 value={formData.address.street}
    //                 name="street"
    //                 onChange={(e) =>
    //                   setFormData({
    //                     ...formData,
    //                     address: { ...formData.address, street: e.target.value }
    //                   })
    //                 }
    //                 disabled
    //               />
    //               <br />

    //               <label>City</label>
    //               <input
    //                 type="text"
    //                 value={formData.address.city}
    //                 name="city"
    //                 onChange={(e) =>
    //                   setFormData({
    //                     ...formData,
    //                     address: { ...formData.address, city: e.target.value }
    //                   })
    //                 }
    //                 disabled
    //               />
    //               <br />

    //               <label>State</label>
    //               <input
    //                 type="text"
    //                 value={formData.address.state}
    //                 name="state"
    //                 onChange={(e) =>
    //                   setFormData({
    //                     ...formData,
    //                     address: { ...formData.address, state: e.target.value }
    //                   })
    //                 }
    //                 disabled
    //               />
    //               <br />

    //               <label>Pincode</label>
    //               <input
    //                 type="text"
    //                 value={formData.address.pincode}
    //                 name="pincode"
    //                 onChange={(e) =>
    //                   setFormData({
    //                     ...formData,
    //                     address: { ...formData.address, pincode: e.target.value }
    //                   })
    //                 }
    //                 disabled
    //               />
    //               <br />

    //               <label>Old Password</label>
    //               <input
    //                 type="password"
    //                 name="oldPassword"
    //                 value={formData.oldPassword}
    //                 onChange={handleChange}
    //               />
    //               <br />

    //               <label>New Password</label>
    //               <input
    //                 type="password"
    //                 name="newPassword"
    //                 value={formData.newPassword}
    //                 onChange={handleChange}
    //               />
    //               <br />

    //               <Button variant="primary" type="submit" className="mt-3">
    //                 Submit
    //               </Button>
    //             </Form>

    //             <Calendar formattedDates={formattedDates} />

    //             {/* <h4>Current packages</h4>
    //           {order.paid && order.paid.length > 0 ? (
    //             <div>


    //               <ul>

    //                 {order.paid?.map(ele => ele.packages.map((pack) => {
    //                   const originalDate = new Date(ele.orderDate);
    //                   const futureDate = addDays(originalDate, 30);

    //                   const formattedDate = format(futureDate, 'yyyy-MM-dd');
    //                   return (
    //                     <>
    //                       <li key={pack._id}>{pack.packageId.packageName} - expiryDate - {formattedDate}</li>

    //                     </>
    //                   )

    //                 }))}
    //               </ul>

    //             </div>
    //           ) : (
    //             <p>No packages available</p>
    //           )}
    //           <br />

    //           <h4>Current channels</h4>
    //           {order.paid && order.paid.length > 0 ? (
    //             <div>

    //               <ul>
    //                 {order.paid?.map(ele => ele.channels?.map((chan) => {
    //                   const originalDate = new Date(ele.orderDate);
    //                   const futureDate = addDays(originalDate, 30);

    //                   const formattedDate = format(futureDate, 'yyyy-MM-dd')
    //                   console.log(formattedDate, "workx")
    //                   return (
    //                     <>
    //                       <li key={chan._id}>{chan.channelId?.channelName} - expiryDate - {formattedDate}</li>
    //                     </>
    //                   )
    //                 }))}
    //               </ul>
    //             </div>
    //           ) : (
    //             <p>No channels available</p>
    //           )} */}


    //             {order.paid && order.paid.length > 0 ? (
    //               <div className="current">
    //                 <Row>
    //                   <Col md='6'>
    //                     <h4>Current packages</h4>
    //                     {/* {order.paid && order.paid.length > 0 ? ( */}
    //                     <Row>
    //                       {order.paid?.map(ele => ele.packages.map((pack) => {
    //                         const originalDate = new Date(ele.orderDate)
    //                         const futureDate = addDays(originalDate, 30)
    //                         const formattedDate = format(futureDate, 'yyyy-MM-dd')
    //                         if (new Date(formattedDate) > new Date()) {
    //                           return (
    //                             <Col key={pack._id} sm={6}>
    //                               <Card className="mb-3">
    //                                 <Card.Body>
    //                                   <Card.Title>{pack.packageId?.packageName}</Card.Title>
    //                                   <Card.Text>
    //                                     Expiry Date: {formattedDate}
    //                                   </Card.Text>
    //                                 </Card.Body>
    //                               </Card>
    //                             </Col>
    //                           );
    //                         }
    //                       }))}
    //                     </Row>
    //                   </Col>

    //                   <Col>
    //                     <h4>Current channels</h4>
    //                     {/* {order.paid && order.paid.length > 0 ? ( */}

    //                     <Row>
    //                       {order.paid?.map(ele => ele.channels?.map((chan) => {
    //                         console.log(chan.channelId.channelName, 'pay chan')
    //                         const originalDate = new Date(ele.orderDate)
    //                         const futureDate = addDays(originalDate, 30)
    //                         const formattedDate = format(futureDate, 'yyyy-MM-dd')
    //                         if (new Date(formattedDate) > new Date()) {
    //                           return (
    //                             <Col key={chan._id} sm={6}>
    //                               <Card className="mb-3">
    //                                 <Card.Body>
    //                                   <Card.Title>{chan.channelId?.channelName}</Card.Title>
    //                                   <Card.Text>
    //                                     Expiry Date: {formattedDate}
    //                                   </Card.Text>
    //                                 </Card.Body>
    //                               </Card>
    //                             </Col>
    //                           )
    //                         }
    //                       }))}
    //                     </Row>
    //                   </Col>
    //                 </Row>
    //               </div>
    //             ) : (
    //               <p>No packages or channels available</p>
    //             )}

    //           </div>

    //         )}

    //       </Col>
    //     </Row>
    //   ) : (
    //     <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
    //       <ClipLoader
    //         color={"#7aa9ab"}
    //         isLoading={isLoading}
    //         size={30}
    //       />
    //     </div>

    //   )}

    // </div>

    <>
      <div className="customer-profile-container d-flex justify-content-center align-items-center">
        {!isLoading ? (
          <Row>
            <Col>
              <Row className="w-100">
                <Col className="text-center">
                  <div className="profile-image-container">
                    <img
                      className="rounded-circle mb-3 profile "
                      src={!_.isEmpty(formData.img) ? `http://localhost:3034/Images/${formData.img}` : process.env.PUBLIC_URL + '/service-pic.jpg'}
                      alt='image'
                      width="150px"
                      height="150px"
                      onClick={handleImageClick}
                    />
                  </div>
                </Col>
              </Row>


              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Upload Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleUpload}>
                    <Form.Group controlId="formFile">
                      <Form.Label>Choose Image</Form.Label>
                      <Form.Control type="file" onChange={handleImageChange} />
                    </Form.Group><br />
                    <Button variant="primary" type="submit">
                      Upload
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>

              {userState.userDetails.role === 'customer' && (
                <div>
                  <Form onSubmit={handleSubmit} className="small-cute-form">
                    <Form.Group controlId="formCustomerName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.customerName}
                        onChange={handleChange}
                        name="customerName"
                        disabled
                      />
                    </Form.Group>
                    <br />

                    <label>Mobile</label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                    <br />

                    <label>Box Number</label>
                    <input
                      type="text"
                      name="boxNumber"
                      value={formData.boxNumber}
                      onChange={handleChange}
                      disabled
                    />
                    <br /><br />

                    <label>Address</label><br />
                    <label>Door Number</label>
                    <input
                      type="text"
                      value={formData.address.doorNumber}
                      name="doorNumber"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, doorNumber: e.target.value }
                        })
                      }
                      disabled
                    />
                    <br />

                    <label>Street</label>
                    <input
                      type="text"
                      value={formData.address.street}
                      name="street"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, street: e.target.value }
                        })
                      }
                      disabled
                    />
                    <br />

                    <label>City</label>
                    <input
                      type="text"
                      value={formData.address.city}
                      name="city"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })
                      }
                      disabled
                    />
                    <br />

                    <label>State</label>
                    <input
                      type="text"
                      value={formData.address.state}
                      name="state"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value }
                        })
                      }
                      disabled
                    />
                    <br />

                    <label>Pincode</label>
                    <input
                      type="text"
                      value={formData.address.pincode}
                      name="pincode"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, pincode: e.target.value }
                        })
                      }
                      disabled
                    />
                    <br />

                    <label>Old Password</label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                    />
                    <br />

                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    <br />

                    <Button variant="primary" type="submit" className="mt-3">
                      Submit
                    </Button>
                  </Form>

                  <Calendar formattedDates={formattedDates} />
                </div>
                
              )}
              
            </Col>
          </Row>

        ) : (
          <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
            <ClipLoader color={"#7aa9ab"} isLoading={isLoading} size={30} />
          </div>
        )}
      </div>


      {!isLoading && userState.userDetails.role === 'customer' && order.paid && order.paid.length > 0 && (
        <div className="current packages-channels">
          <Row>
            <Col md='6'>
              <h4>Current packages</h4>
              <Row>
                {order.paid?.map(ele => ele.packages.map((pack) => {
                  const originalDate = new Date(ele.orderDate);
                  const futureDate = addDays(originalDate, 30);
                  const formattedDate = format(futureDate, 'yyyy-MM-dd');
                  if (new Date(formattedDate) > new Date()) {
                    return (
                      <Col key={pack._id} sm={6}>
                        <Card className="mb-3">
                          <Card.Body>
                            <Card.Title>{pack.packageId?.packageName}</Card.Title>
                            <Card.Text>
                              Expiry Date: {formattedDate}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  }
                }))}
              </Row>
            </Col>
            </Row>
              
            <Row>
            <Col md='6'>
              <h4>Current channels</h4>
              <Row>
                {order.paid?.map(ele => ele.channels?.map((chan) => {
                  console.log(chan.channelId.channelName, 'pay chan');
                  const originalDate = new Date(ele.orderDate);
                  const futureDate = addDays(originalDate, 30);
                  const formattedDate = format(futureDate, 'yyyy-MM-dd');
                  if (new Date(formattedDate) > new Date()) {
                    return (
                      <Col key={chan._id} sm={6}>
                        <Card className="mb-3">
                          <Card.Body>
                            <Card.Title>{chan.channelId?.channelName}</Card.Title>
                            <Card.Text>
                              Expiry Date: {formattedDate}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  }
                }))}
              </Row>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}

export default CustomerProfile





