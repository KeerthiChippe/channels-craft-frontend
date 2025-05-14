import { StartGetCustomer, startEditCustomer, startRemoveCustomer } from "../../actions/customer-action"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap"
import './customerlist.css'

const CustomerList = () => {

    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('asc')
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state

    const customer = useSelector((state) => {
        return state.customer.data
    })

    useEffect(() => {
        dispatch(StartGetCustomer())
    }, [dispatch])

    const handleDelete = (id, operatorId) => {
        const confirm = window.confirm('Are you sure ??')
        if (confirm) {
            dispatch(startRemoveCustomer(id, operatorId))
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const filteredCustomers = customer.filter((customer) =>
        customer.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const handleSort = (e) => {
        setSort(e.target.value)
    }

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        if (sort === 'asc') {
            return a.customerName.localeCompare(b.customerName)
        } else {
            return b.customerName.localeCompare(a.customerName)
        }
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentCustomers = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem)

    const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage)

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    };


    return (
        <div>
            <input type='text' value={search} onChange={handleSearch} placeholder="Search by customer name" />
            {/* <Form>
                        <FormGroup>
                            <Label for="sort">Sort Order:</Label>
                            <Input type="select" name="sort" id="sortOrder" value={sort} onChange={handleSort}>
                                <option value="asc">A-Z</option>
                                <option value="desc">Z-A</option>
                            </Input>
                        </FormGroup>
                    </Form> */}
            <Table striped bordered className="customer" style={{ margin: "0px", padding: "0px", marginTop: "100px" }}>
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Mobile</th>
                        <th>box Number</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.map((customer) => {
                        return <tr key={customer._id}> <td>{customer.customerName}</td>  <td>{customer.mobile}</td>  <td>{customer.boxNumber}</td>

                            <td>
                                <button onClick={() => {
                                    handleDelete(customer._id, customer.operatorId)
                                }}>Delete</button> </td>  </tr>

                    })}

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
        </div>

    )
}
export default CustomerList