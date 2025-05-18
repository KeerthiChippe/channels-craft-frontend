// import { StartGetCustomer, startEditCustomer, startRemoveCustomer } from "../../actions/customer-action"
// import { useDispatch, useSelector } from "react-redux"
// import { useEffect, useState } from "react"
// import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap"
// import './customerlist.css'

// const CustomerList = () => {

//     const dispatch = useDispatch()
//     const [search, setSearch] = useState('')
//     const [sort, setSort] = useState('asc')
//     const [currentPage, setCurrentPage] = useState(1); // Current page state
//     const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state

//     const customer = useSelector((state) => {
//         return state.customer.data
//     })

//     useEffect(() => {
//         dispatch(StartGetCustomer())
//     }, [dispatch])

//     const handleDelete = (id, operatorId) => {
//         const confirm = window.confirm('Are you sure ??')
//         if (confirm) {
//             dispatch(startRemoveCustomer(id, operatorId))
//         }
//     }

//     const handleSearch = (e) => {
//         setSearch(e.target.value)
//     }

//     const filteredCustomers = customer.filter((customer) =>
//         customer.customerName.toLowerCase().includes(search.toLowerCase())
//     );

//     const handleSort = (e) => {
//         setSort(e.target.value)
//     }

//     const sortedCustomers = [...filteredCustomers].sort((a, b) => {
//         if (sort === 'asc') {
//             return a.customerName.localeCompare(b.customerName)
//         } else {
//             return b.customerName.localeCompare(a.customerName)
//         }
//     });

//     // Pagination Logic
//     const indexOfLastItem = currentPage * itemsPerPage
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage
//     const currentCustomers = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem)

//     const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage)

//     // Function to handle page change
//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber)
//     };


//     return (
//         <div>
//             <input type='text' value={search} onChange={handleSearch} placeholder="Search by customer name" />
//             {/* <Form>
//                         <FormGroup>
//                             <Label for="sort">Sort Order:</Label>
//                             <Input type="select" name="sort" id="sortOrder" value={sort} onChange={handleSort}>
//                                 <option value="asc">A-Z</option>
//                                 <option value="desc">Z-A</option>
//                             </Input>
//                         </FormGroup>
//                     </Form> */}
//             <Table striped bordered className="customer" style={{ margin: "0px", padding: "0px", marginTop: "100px" }}>
//                 <thead>
//                     <tr>
//                         <th>Customer Name</th>
//                         <th>Mobile</th>
//                         <th>box Number</th>
//                         <th>Delete</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {currentCustomers.map((customer) => {
//                         return <tr key={customer._id}> <td>{customer.customerName}</td>  <td>{customer.mobile}</td>  <td>{customer.boxNumber}</td>

//                             <td>
//                                 <button onClick={() => {
//                                     handleDelete(customer._id, customer.operatorId)
//                                 }}>Delete</button> </td>  </tr>

//                     })}

//                 </tbody>
//             </Table>
//             <Pagination>
//                 <PaginationItem disabled={currentPage === 1}>
//                     <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
//                 </PaginationItem>
//                 {[...Array(totalPages)].map((_, index) => (
//                     <PaginationItem key={index} active={index + 1 === currentPage}>
//                         <PaginationLink onClick={() => handlePageChange(index + 1)}>
//                             {index + 1}
//                         </PaginationLink>
//                     </PaginationItem>
//                 ))}
//                 <PaginationItem disabled={currentPage === totalPages}>
//                     <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
//                 </PaginationItem>
//             </Pagination>
//         </div>

//     )
// }
// export default CustomerList
import { StartGetCustomer, startRemoveCustomer } from "../../actions/customer-action"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Table, Pagination, PaginationItem, PaginationLink } from "reactstrap"
import './customerlist.css'

const CustomerList = () => {

    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('asc')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    const customer = useSelector((state) => state.customer.data)

    useEffect(() => {
        dispatch(StartGetCustomer())
    }, [dispatch])

    const handleDelete = (id, operatorId) => {
        const confirm = window.confirm('Are you sure you want to delete this customer?')
        if (confirm) {
            dispatch(startRemoveCustomer(id, operatorId))
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const filteredCustomers = customer.filter((customer) =>
        customer.customerName.toLowerCase().includes(search.toLowerCase())
    )

    const handleSort = (e) => {
        setSort(e.target.value)
    }

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        if (sort === 'asc') {
            return a.customerName.localeCompare(b.customerName)
        } else {
            return b.customerName.localeCompare(a.customerName)
        }
    })

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentCustomers = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>📋 Customer List</h2>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                    type='text'
                    value={search}
                    onChange={handleSearch}
                    placeholder="🔍 Search by name..."
                    style={{ padding: '8px 12px', borderRadius: '6px', width: '300px', border: '1px solid #ccc' }}
                />

                <select value={sort} onChange={handleSort} style={{ padding: '8px 12px', borderRadius: '6px' }}>
                    <option value="asc">⬆️ A-Z</option>
                    <option value="desc">⬇️ Z-A</option>
                </select>
            </div>

            <Table striped bordered hover className="customer" style={{ marginTop: "20px" }}>
                <thead className="thead-dark">
                    <tr style={{ textAlign: 'center' }}>
                        <th>👤 Customer Name</th>
                        <th>📞 Mobile</th>
                        <th>📦 Box Number</th>
                        <th>🗑️ Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.map((customer) => (
                        <tr key={customer._id}>
                            <td>{customer.customerName}</td>
                            <td>{customer.mobile}</td>
                            <td>{customer.boxNumber}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => handleDelete(customer._id, customer.operatorId)}
                                    style={{
                                        padding: '4px 10px',
                                        backgroundColor: '#e74c3c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ❌ Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
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
        </div>
    )
}

export default CustomerList
