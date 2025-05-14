import { useEffect, useState } from "react";
import { Row, Col, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import { startGetOperator, StartRemoveOperator } from "../../actions/operator-action";
import { Form, FormGroup, Input, Label } from "reactstrap";
import axios from "../../config/axios";

const OperatorList = () => {
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('asc')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [modal, setModal] = useState(false)
    const [selectedOperator, setSelectedOperator] = useState(null)
    const [operatorDetails, setOperatorDetails] = useState(null)
    const dispatch = useDispatch()

    const operator = useSelector((state) => state.operator.data)

    useEffect(() => {
        dispatch(startGetOperator())
    }, [dispatch])

    const toggleModal = () => {
        setModal(!modal)
    };

    const handleDelete = (id) => {
        const confirm = window.confirm('Are you sure??')
        if (confirm) {
            dispatch(StartRemoveOperator(id))
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setCurrentPage(1)
    };

    const filteredOperators = operator.filter((operator) =>
        operator.operatorName.toLowerCase().includes(search.toLowerCase())
    );

    const handleSort = (e) => {
        setSort(e.target.value)
    };

    const sortedOperators = [...filteredOperators].sort((a, b) => {
        if (sort === 'asc') {
            return a.operatorName.localeCompare(b.operatorName)
        } else {
            return b.operatorName.localeCompare(a.operatorName)
        }
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentOperators = sortedOperators.slice(indexOfFirstItem, indexOfLastItem)

    const totalPages = Math.ceil(sortedOperators.length / itemsPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

const handleOperatorClick = async (operator) => {
    setSelectedOperator(operator)
    toggleModal()

    try {
        const response = await axios.get(`/api/${operator._id}/customers`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
           
        })
        setOperatorDetails(response.data)
    } catch (error) {
        console.error('Error fetching customer details:', error)
    }
};

    return (
        <div>
            <Row>
                <Col>
                    <Form inline>
                        <FormGroup>
                            <Label for="search" className="mr-2">Search:</Label><br />
                            <input type='text' value={search} onChange={handleSearch} placeholder="Search by operator name" style={{ width: '250px' }}/><br />
                        </FormGroup>
                    </Form>
                </Col>
                <Col>
                    <Form>
                        <FormGroup>
                            <Label for="sort">Sort Order:</Label>
                            <Input type="select" name="sort" id="sortOrder" value={sort} onChange={handleSort} style={{ width: '250px' }}>
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
                        <th>Operator Name</th>
                        <th>Mobile</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOperators.map((operator) => (
                        <tr key={operator.id} onClick={() => handleOperatorClick(operator)} style={{ cursor: "pointer", textAlign: 'center' }} >
                            <td>{operator.operatorName}</td>
                            <td>{operator.mobile}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button onClick={() => handleDelete(operator._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                <PaginationItem disabled={currentPage === 1}>
                    <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index} active={index + 1 === currentPage}>
                        <PaginationLink onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem disabled={currentPage === totalPages}>
                    <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
            </Pagination>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Operator Details</ModalHeader>
                <ModalBody>
                    {selectedOperator && (
                        <div>
                            <p>Mobile: {selectedOperator.mobile}</p>
                            <p>city : {selectedOperator.city}</p> 
                            <p>state : {selectedOperator.state}</p>
                            <p>No.of Customers : {operatorDetails?.length}</p>
                        </div>
                    )}
                </ModalBody>
            </Modal>
        </div>
    )
}

export default OperatorList