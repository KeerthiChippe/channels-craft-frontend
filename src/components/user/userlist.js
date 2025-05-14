import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { startGetUser } from "../../actions/user-action"
import { Row, Col, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"
import { Form, FormGroup, Input, Label } from "reactstrap"
import { jwtDecode } from "jwt-decode"
import axios from "../../config/axios"

const UserList = () => {
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [sortOrder, setSortOrder] = useState('asc')
    const [role, setRole] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [selectedUser, setSelectedUser] = useState(null)
    const [modal, setModal] = useState(false)
    const [operatorDetails, setOperatorDetails] = useState(null)
    const [customersCount, setCustomersCount] = useState(null)
    const [customerDetails, setCustomerDetails] = useState([])

    const user = useSelector((state) => state.user.data)

    useEffect(() => {
        if (localStorage.getItem('token')) {
            const { role } = jwtDecode(localStorage.getItem("token"))
            setRole(role)
        }
    }, [localStorage.getItem('token')])

    useEffect(() => {
        dispatch(startGetUser())
    }, [dispatch])

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const handleUserClick = async (user) => {
        setSelectedUser(user)
        toggle()

        try {
            if (user.role === 'operator') {
                const response = await axios.get(`/api/getOperatorByUserId/${user._id}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                console.log(response.data, 'operator list')
                setOperatorDetails(response.data)


                const customerCountResponse = await axios.get(`/api/${response.data._id}/customers`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                console.log(customerCountResponse.data, 'customer count')
                setCustomersCount(customerCountResponse.data)

            }
            else if (user.role === 'customer') {

                const customerResponse = await axios.get(`/api/${user._id}/users/customer`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                console.log(customerResponse.data, 'customer response')
                setCustomerDetails(customerResponse.data)
            }

        } catch (e) {
            console.log(e)
        }

    }

    const toggle = () => setModal(!modal);

    const filteredUsers = user.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase()) || user.mobile.includes(search)
    )

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.username.localeCompare(b.username);
        } else {
            return b.username.localeCompare(a.username);
        }
    });

    const handleSortOrder = (e) => {
        setSortOrder(e.target.value);
    };

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUserPage = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const pageNumbers = Math.ceil(sortedUsers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            {role === 'admin' && (
                <>
                    <Row>
                        <Col>

                            <Form inline>
                                <FormGroup>
                                    <Label for="search" className="mr-2">Search:</Label><br />
                                    <input type="text" value={search} onChange={handleSearch} placeholder="Search by username or mobile" style={{ width: '250px' }} />
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col>
                            <Form>
                                <FormGroup>
                                    <Label for="sort">Sort Order:</Label>
                                    <Input type="select" name="sort" id="sortOrder" value={sortOrder} onChange={handleSortOrder} style={{ width: '250px' }}>
                                        <option value="asc">A-Z</option>
                                        <option value="desc">Z-A</option>
                                    </Input>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>

                    <Table striped bordered>
                    <colgroup>
                <col style={{ width: '30%' }} />
                <col style={{ width: '40%' }} />
                <col style={{ width: '30%' }} />
            </colgroup>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>User Name</th>
                                <th>User Mobile</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUserPage.map((user) => (
                                <tr key={user._id} onClick={() => handleUserClick(user)} style={{ textAlign: 'center' }}>
                                    <td>{user.username}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        {Array.from({ length: pageNumbers }, (_, i) => (
                            <PaginationItem key={i} active={i + 1 === currentPage}>
                                <PaginationLink onClick={() => paginate(i + 1)}>{i + 1}</PaginationLink>
                            </PaginationItem>
                        ))}
                    </Pagination>

                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>User Details</ModalHeader>
                        <ModalBody>
                            {selectedUser && (
                                <div>
                                    <p>User Name: {selectedUser.username}</p>
                                    {selectedUser.role === 'customer' && (
                                        <div>
                                            <p>Customer Box Number: {customerDetails.length > 0 && customerDetails[0].boxNumber}</p>
                                            <p>Operator Name: {customerDetails.length > 0 && customerDetails[0].operatorId.operatorName}</p>

                                            {customerDetails.length > 0 && customerDetails[0].currentPackages.length > 0 ? (
                                                <div>
                                                    <p>Packages:</p>
                                                    <ul>
                                                        {customerDetails[0].currentPackages.map((packageObj, index) => (
                                                            <li key={index}>{packageObj.packageId.packageName}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p>Not subscribed to any package</p>
                                            )}


                                        </div>
                                    )}
                                    {selectedUser.role === 'operator' && (
                                        <div>
                                            <p>Operator City: {operatorDetails?.city}</p>
                                            <p>Operator State: {operatorDetails?.state}</p>
                                            <p>Number of Customers: {customersCount?.length}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>Close</Button>
                        </ModalFooter>
                    </Modal>
                </>
            )}

            {role === 'operator' && (
                <>
                    <Row>
                        <Col>

                            <Form inline>
                                <FormGroup>
                                    <Label for="search" className="mr-2">Search:</Label><br />
                                    <input type="text" value={search} onChange={handleSearch} placeholder="Search by username or mobile" />
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col>
                            <Form>
                                <FormGroup>
                                    <Label for="sort">Sort Order:</Label>
                                    <Input type="select" name="sort" id="sortOrder" value={sortOrder} onChange={handleSortOrder}>
                                        <option value="asc">A-Z</option>
                                        <option value="desc">Z-A</option>
                                    </Input>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>

                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>User Mobile</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUserPage.map((user) => (
                                <tr key={user._id} onClick={() => handleUserClick(user)}>
                                    <td>{user.username}</td>
                                    <td>{user.mobile}</td>
                                    <td>{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        {Array.from({ length: pageNumbers }, (_, i) => (
                            <PaginationItem key={i} active={i + 1 === currentPage}>
                                <PaginationLink onClick={() => paginate(i + 1)}>{i + 1}</PaginationLink>
                            </PaginationItem>
                        ))}
                    </Pagination>
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>User Details</ModalHeader>
                        <ModalBody>
                            {selectedUser && (
                                <div>
                                    <p>User Name: {selectedUser.username}</p>
                                    {selectedUser.role === 'customer' && (
                                        <div>
                                            <p>Customer Box Number: {customerDetails.length > 0 && customerDetails[0].boxNumber}</p>

                                            {customerDetails.length > 0 && customerDetails[0].currentPackages.length > 0 ? (
                                                <div>
                                                    <p>Packages:</p>
                                                    <ul>
                                                        {customerDetails[0].currentPackages.map((packageObj, index) => (
                                                            <li key={index}>{packageObj.packageId.packageName}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p>Not subscribed to any package</p>
                                            )}


                                        </div>
                                    )}
                                </div>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>Close</Button>
                        </ModalFooter>
                    </Modal>
                </>
            )}
        </div>
    )
}
export default UserList

