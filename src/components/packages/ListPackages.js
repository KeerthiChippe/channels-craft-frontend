import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { startRemovePackage, startAddPackage, startEditPackage, startGetPackage } from "../../actions/package-action";
import { deletePackageOne, selectedPackageOne, startGetOrder } from "../../actions/order-action";
import { OperatorContext } from "../profile/operatorContext";
import { jwtDecode } from "jwt-decode";
import { ClipLoader } from "react-spinners";
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify'


const ListPackages = () => {
  const [editId, setEditId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [userRole, setUserRole] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [viewModal, setViewModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    packagePrice: "",
  })

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('asc') // Default sort order
  const [currentPage, setCurrentPage] = useState(1)// Current page state
  const [itemsPerPage, setItemsPerPage] = useState(10) // Items per page state


  useEffect(() => {
    if (localStorage.getItem('token')) {
      const { role } = jwtDecode(localStorage.getItem("token"))
      setUserRole(role)
    }
  }, [localStorage.getItem('token')])

  const dispatch = useDispatch();

  const packages = useSelector((state) => {
    return state.package.data.filter((ele) => ele.isDeleted === false)
  })

  const orders = useSelector((state) => {
    return state.order
  })
  // console.log(orders, orders)

  useEffect(() => {
    setIsLoading(true)
    dispatch(startGetPackage())
      .then(() => {
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching packages:', error)
        setIsLoading(false)
      })
  }, [dispatch])

  const toggleModal = () => {
    setModal(!modal)
  }

  const toggleViewModal = () => {
    setViewModal(!viewModal)
  }

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure?")
    if (confirm) {
      dispatch(startRemovePackage(id))
    }
  }

  const handleEdit = (id) => {
    setEditId(id);
    const selectedPackage = packages.find((ele) => ele._id === id)
    setFormData({
      packagePrice: selectedPackage.packagePrice,
    })
    setModal(true)
    // toggleViewModal(false);
  };


  useEffect(() => {
    dispatch(startGetOrder())
  }, [dispatch])


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const { userState, userDispatch } = useContext(OperatorContext)

  const handleAdd = (id) => {
    const selectedPackage = packages.find((ele) => ele._id === id)
    const { currentPackages } = userState.customer

    // Check if the selected package is already subscribed
    const isSubscribed = currentPackages.some(pkg => pkg.packageId === id)

    if (!isSubscribed) {
      const newPackage = {
        packageId: selectedPackage._id,
        packagePrice: selectedPackage.packagePrice,
        packageName: selectedPackage.packageName,
        selectedChannels: selectedPackage.selectedChannels
      };

      dispatch(selectedPackageOne(newPackage))

      toast.success('Added to cart successfully', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } else {
      toast.warning('Package already subscribed', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    if (editId) {
      dispatch(startEditPackage(editId, formData))
        .then(() => {
          dispatch(startGetPackage()) // Fetch updated list of packages
          toggleModal() // Close the modal after successful edit
        })
        .catch((error) => {
          console.log("Error editing package:", error)
        })
    } else {
      dispatch(startAddPackage(formData))
    }
    setFormData({
      packagePrice: "",
    });
  };


  const handleRemove = (id) => {
    const removeItem = selectedItems.find((ele) => ele._id === id)
    dispatch(deletePackageOne(removeItem))
  }

  const handleView = (id) => {
    const selectedPkg = packages.find((pkg) => pkg._id === id)
    setSelectedPackage(selectedPkg)
    setViewModal(true)
    // toggleModal(false)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const filteredPackages = packages.filter((ele) =>
    ele.packageName.toLowerCase().includes(search.toLowerCase())
  )

  const handleSort = (e) => {
    setSort(e.target.value)
  }

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (sort === 'asc') {
      return a.packageName.localeCompare(b.packageName)
    } else {
      return b.packageName.localeCompare(a.packageName)
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPackages = sortedPackages.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(sortedPackages.length / itemsPerPage)

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (

    <div>
      <ToastContainer />
      {isLoading ? (
        <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
          <ClipLoader
            color={"#7aa9ab"}
            isLoading={isLoading}
            size={30}
          />
        </div>


      ) : (

        <div className="row g-3 d-flex-wrap" style={{ gap: "1rem", justifyContent: "center", alignItems: "center" }}>

          <h3 style={{ marginLeft: "400px", padding: "2px" }}>PACKAGES</h3>
          <div className="col-md-11 d-flex" style={{ marginBottom: "0rem"}}>
            <input type='text' value={search} onChange={handleSearch} placeholder="Search by package name" className="form-control me-2" style={{ width: "200px", marginRight: "100px"}} />

          </div>
          {/* <input type='text' value={search} onChange={handleSearch} placeholder="Search by package name" className="form-control" style={{ width: "150px" }}/> */}
          {/* <Form>
                        <FormGroup>
                            <Label for="sort">Sort Order:</Label>
                            <Input type="select" name="sort" id="sortOrder" value={sort} onChange={handleSort} className="form-select" style={{ width: "150px" }}>
                                <option value="asc">A-Z</option>
                                <option value="desc">Z-A</option>
                            </Input>
                        </FormGroup>
                    </Form> */}

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-1 mt-2">
            {currentPackages.map((ele) => (
              <div key={ele.id} style={{ padding: "5px", width: "fit-content", height: "25rem" }}>
                <div className="card shadow-sm" style={{ width: "15rem", margin: "20px" }}>
                  <img
                    src={`http://localhost:3034/Images/${ele.image}`}
                    alt="Package"
                    className="bd-placeholder-img card-img-top"
                    style={{ objectFit: "cover", height: "12rem", width: "100%" }}
                  />
                  <div className="card-body" style={{ height: "10rem" }}>
                    <h5 className="card-title">{ele.packageName}</h5>
                    <p className="card-text" style={{ fontWeight: "bold" }}>Package Price-{ele.packagePrice}.Rs</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        {userRole === 'admin' && (
                          <>
                            <button
                              onClick={() => {
                                handleEdit(ele._id);
                              }}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDelete(ele._id);
                              }}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              Delete
                            </button>
                          </>
                        )}

                        {userRole === 'customer' && (
                          <>
                            <button
                              onClick={() => {
                                handleAdd(ele._id);
                              }}
                              className="btn btn-sm btn-outline-secondary"
                              style={{ marginRight: '20px' }}
                            >
                              Add to Cart
                            </button>
                          </>
                        )}

                        <button onClick={() => {
                          handleView(ele._id)
                        }} style={{ marginRight: '50px' }} >
                          view
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Edit Package</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="packagePrice" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    id="packagePrice"
                    value={formData.packagePrice}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <Button type="submit" color="primary">
                  Save
                </Button>
              </form>
            </ModalBody>
          </Modal>

          <Modal isOpen={viewModal} toggle={toggleViewModal}>
            <ModalHeader toggle={toggleViewModal}>Channels</ModalHeader>
            <ModalBody>
              {selectedPackage && (
                <div>
                  {/* <ul>
              
                {selectedPackage.selectedChannels.map((channel, index) => (
                  <li key={index}><img src={`http://localhost:3034/Images/${channel.image}`} alt={channel.channelName} style={{ maxHeight: "50px" }} />{channel.channelName}</li>
                ))}
              </ul> */}
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {/* Render selected channels */}
                    {selectedPackage.selectedChannels.map((channel, index) => (
                      <div key={index} style={{ margin: "5px" }}>
                        <img src={`http://localhost:3034/Images/${channel.image}`} alt={channel.channelName} style={{ maxHeight: "50px" }} />
                        <div>{channel.channelName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ModalBody>
          </Modal>
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
      )}
    </div>
  );
};

export default ListPackages;




