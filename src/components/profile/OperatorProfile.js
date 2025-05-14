import { useState, useEffect, useContext } from "react"
import { OperatorContext } from "./operatorContext"
import { useDispatch, useSelector } from "react-redux"
import { startUpdateUser } from "../../actions/user-action"
import { startEditOperator, startGetOperator } from "../../actions/operator-action"
import _ from "lodash"
import { Modal, Form, Button, } from "react-bootstrap"
import axios from "../../config/axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import { ClipLoader } from "react-spinners"

export default function OperatorProfile() {
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(true)
    const { userState, userDispatch } = useContext(OperatorContext)

    const operators = useSelector((state) => {
        return state.operator.data
    })

    const [formData, setFormData] = useState({
        operatorName: userState.userDetails.username,
        mobile: userState.userDetails.mobile,
        state: userState.operator.state,
        city: userState.operator.city,
        oldPassword: '',
        newPassword: ''
    })

    const [profile, setProfile] = useState(null)
    const [img, setImg] = useState({})
    const [role, setRole] = useState("")

    const [showModal, setShowModal] = useState(false);
    //const [selectedImage, setSelectedImage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        setIsLoading(true)
        dispatch(startGetOperator())
        setIsLoading(false)
    }, [dispatch])

    useEffect(() => {
        if (localStorage.getItem('token').length > 0) {
            setProfile(userState.userDetails.role)
        }
    }, [userState.userDetails.role])

    const userId = userState.userDetails._id
    const operatorId = userState.operator._id

    useEffect(() => {
        if (localStorage.getItem('token').length > 0) {
            setRole(userState.userDetails.role)
        }
    }, [userState.userDetails.role])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(startUpdateUser(userId, {
                "oldPassword": formData.oldPassword,
                "newPassword": formData.newPassword
            }))
            await dispatch(startEditOperator(operatorId, {
                "mobile": formData.mobile
            }))
            setFormData({
                ...formData,
                oldPassword: "",
                newPassword: "",
            });
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        setFormData({
            operatorName: userState.userDetails.username,
            mobile: userState.userDetails.mobile,
            state: userState.operator.state,
            city: userState.operator.city,
            oldPassword: '',
            newPassword: '',
            img: userState.operator.image
        });
    }, [userState])

    const handleUpload = (e) => {
        e.preventDefault()

        if (profile) {
            const formData = new FormData()
            formData.append('file', profile)
            axios.put(`/api/operator/${operatorId}/profile`, formData, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
                .then(res => {
                    setShowModal(false)
                    setImg({ ...img, ...res.data })
                    userDispatch({
                        type: "SET_OPERATOR_IMAGE",
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
        console.log(e.target.files[0], "pro")

        setProfile(e.target.files[0]);
    }


    return (

        <div>
            {!isLoading ? (
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card border rounded shadow-lg p-3">
                                <div className="text-center mb-3">
                                    <img
                                        className="rounded-circle mb-3"
                                        src={!_.isEmpty(formData.img) ? `http://localhost:3034/Images/${formData.img}` : process.env.PUBLIC_URL + '/service-pic.jpg'}
                                        alt='image'
                                        width="150px"
                                        height="150px"
                                        onClick={handleImageClick}
                                    />

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

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="operatorName" className="form-label fw-bold">Name</label>
                                            <input type="text" className="form-control" id="operatorName" value={formData.operatorName} name='operatorName' onChange={handleChange} disabled />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="mobile" className="form-label fw-bold">Mobile</label>
                                            <input type="text" className="form-control" id="mobile" name='mobile' value={formData.mobile} onChange={handleChange} />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="city" className="form-label fw-bold">City</label>
                                            <input type='text' className="form-control" id="city" name='city' value={formData.city} onChange={handleChange} disabled />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="state" className="form-label fw-bold">State</label>
                                            <input type='text' className="form-control" id="state" name='state' value={formData.state} onChange={handleChange} disabled />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="oldPassword" className="form-label fw-bold">Old Password</label>
                                            <input type='password' className="form-control" id="oldPassword" name='oldPassword' value={formData.oldPassword} onChange={handleChange} />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="newPassword" className="form-label fw-bold">New Password</label>
                                            <input type='password' className="form-control" id="newPassword" name='newPassword' value={formData.newPassword} onChange={handleChange} />
                                        </div>

                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
                    <ClipLoader
                        color={"#7aa9ab"}
                        isLoading={isLoading}
                        size={30}
                    />
                </div>
            )}

        </div>
    )

}