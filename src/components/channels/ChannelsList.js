import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { startAddChannel, startEditChannel, startGetChannel, startRemoveChannel } from "../../actions/channel-action"
import { selectedChannelOne } from "../../actions/order-action"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap"
import { OperatorContext } from "../profile/operatorContext"
import { jwtDecode } from "jwt-decode"
import { ClipLoader } from "react-spinners"
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { addDays, format } from "date-fns"

const ChannelsList = () => {
  const [editId, setEditId] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [modal, setModal] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [formData, setFormData] = useState({
    channelPrice: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc'); // Default sort order
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state

  const dispatch = useDispatch()
  const channels = useSelector((state) => state.channel.data)

  const orders = useSelector((state) => {
    return state.order
  })
  const orderDates = orders.paid.map((order) => {
    // Convert orderDate string to Date object
    const orderDate = new Date(order.orderDate)
    // Add 30 days to orderDate to get expiryDate
    const expiryDate = addDays(orderDate, 30)
    // Format expiryDate if needed
    const formattedExpiryDate = format(expiryDate, 'yyyy-MM-dd')// Adjust the format as per your requirement
    return formattedExpiryDate
  })

  const { userState } = useContext(OperatorContext)
  // const role = userState.userDetails ? userState.userDetails.role : null;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const { role } = jwtDecode(localStorage.getItem("token"))
      console.log(role, "345")
      setUserRole(role)
    }
  }, [localStorage.getItem('token')])

  useEffect(() => {
    setIsLoading(true)
    dispatch(startGetChannel())
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching channels:', error);
        setIsLoading(false); // Ensure loading spinner is turned off even if there's an error
      });
  }, [dispatch])

  const toggleModal = () => {
    setModal(!modal)
  }

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure to delete?")
    if (confirm) {
      dispatch(startRemoveChannel(id))
      dispatch(startGetChannel())
    }
  }

  const handleEdit = (id) => {
    setEditId(id)
    const selectedChannel = channels.find((ele) => ele._id === id)
    setFormData({
      channelPrice: selectedChannel.channelPrice,
    })
    toggleModal()
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  };

  const handleAdd = (id) => {
    const selectedChannel = channels.find((ele) => ele._id === id)
    const { currentChannels } = userState.customer
    const isChannelAlreadySubscribed = currentChannels.some(channel => channel.channelId === id)
    if (isChannelAlreadySubscribed) {
      // Show toast message indicating already subscribed
      toast.warning('You are already subscribed to this channel', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

    } else {
      const newChannels = {
        channelId: selectedChannel._id,
        channelPrice: selectedChannel.channelPrice,
        channelName: selectedChannel.channelName
      };
      setSelectedItems((previousItems) => [...previousItems, newChannels])
      dispatch(selectedChannelOne(newChannels))
      toast.success('Added to cart successfully', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    }
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    if (editId) {
      dispatch(startEditChannel(editId, formData))
    } else {
      dispatch(startAddChannel(formData))
    }
    setFormData({
      channelPrice: "",
    });
    dispatch(startGetChannel())
    toggleModal()
  };

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1) // Reset current page when search changes
  };

  const filteredChannels = channels.filter((ele) =>
    ele.channelName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSort = (e) => {
    setSort(e.target.value)
  };

  const sortedChannels = [...filteredChannels].sort((a, b) => {
    if (sort === 'asc') {
      return a.channelName.localeCompare(b.channelName)
    } else {
      return b.channelName.localeCompare(a.channelName)
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentChannels = sortedChannels.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(sortedChannels.length / itemsPerPage)

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
          <h3 style={{ textAlign: "center", padding: "2px" }}>CHANNELS</h3>
          <div className="col-md-11 d-flex" style={{ marginBottom: "0rem" }}>
            <input type='text' value={search} onChange={handleSearch} placeholder="Search by channel name" className="form-control me-2" style={{ width: "200px" }} />

          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-1 mt-2">
            {currentChannels.map((ele) => (
              <div key={ele.id} style={{ padding: "5px", width: "fit-content", height: "25rem" }}>
                <div className="card shadow-sm" style={{ width: "15rem", margin: "20px" }}>
                  <img
                    src={`http://localhost:3034/Images/${ele.image}`}
                    alt="Channel"
                    className="bd-placeholder-img card-img-top"
                    style={{ objectFit: "cover", height: "12rem", width: "100%" }}
                  />
                  <div className="card-body" style={{ height: "10rem" }}>
                    <h5 className="card-title">{ele.channelName}</h5>
                    <p className="card-text" style={{ fontWeight: "bold" }}>Channel Price-{ele.channelPrice}.Rs</p>
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
                            >
                              Add to Cart
                            </button>
                          </>
                        )}


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>{editId ? "Edit Channel" : "Add Channel"}</ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="channelPrice" className="form-label">
                    Channel Price
                  </label>
                  <input
                    type="text"
                    id="channelPrice"
                    value={formData.channelPrice}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <Button type="submit" color="primary">
                  Save Changes
                </Button>
              </form>
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
  )
}

export default ChannelsList

