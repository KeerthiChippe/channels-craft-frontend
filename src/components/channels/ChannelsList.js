// import { useContext, useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { startAddChannel, startEditChannel, startGetChannel, startRemoveChannel } from "../../actions/channel-action"
// import { selectedChannelOne } from "../../actions/order-action"
// import { Modal, ModalHeader, ModalBody, ModalFooter, } from "reactstrap"
// import { OperatorContext } from "../profile/operatorContext"
// import { jwtDecode } from "jwt-decode"
// import { ClipLoader } from "react-spinners"
// import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import { addDays, format } from "date-fns"
// import {Button} from "antd"
// import { PlusCircleFill } from "react-bootstrap-icons"

// const ChannelsList = () => {
//   const [editId, setEditId] = useState(null)
//   const [selectedItems, setSelectedItems] = useState([])
//   const [modal, setModal] = useState(false)
//   const [userRole, setUserRole] = useState('')
  // const [formData, setFormData] = useState({
  //   channelPrice: "",
  // })
//   const [isLoading, setIsLoading] = useState(true)
//   const [search, setSearch] = useState('');
//   const [sort, setSort] = useState('asc'); // Default sort order
//   const [currentPage, setCurrentPage] = useState(1); // Current page state
//   const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state

//   const dispatch = useDispatch()
//   const channels = useSelector((state) => state.channel.data)

//   const orders = useSelector((state) => {
//     return state.order
//   })
//   const orderDates = orders.paid.map((order) => {
//     // Convert orderDate string to Date object
//     const orderDate = new Date(order.orderDate)
//     // Add 30 days to orderDate to get expiryDate
//     const expiryDate = addDays(orderDate, 30)
//     // Format expiryDate if needed
//     const formattedExpiryDate = format(expiryDate, 'yyyy-MM-dd')// Adjust the format as per your requirement
//     return formattedExpiryDate
//   })

//   const { userState } = useContext(OperatorContext)
//   // const role = userState.userDetails ? userState.userDetails.role : null;

//   useEffect(() => {
//     if (localStorage.getItem('token')) {
//       const { role } = jwtDecode(localStorage.getItem("token"))
//       console.log(role, "345")
//       setUserRole(role)
//     }
//   }, [localStorage.getItem('token')])

//   useEffect(() => {
//     setIsLoading(true)
//     dispatch(startGetChannel())
//       .then(() => {
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching channels:', error);
//         setIsLoading(false); // Ensure loading spinner is turned off even if there's an error
//       });
//   }, [dispatch])

  // const toggleModal = () => {
  //   setModal(!modal)
  // }

//   const handleDelete = (id) => {
//     const confirm = window.confirm("Are you sure to delete?")
//     if (confirm) {
//       dispatch(startRemoveChannel(id))
//       dispatch(startGetChannel())
//     }
//   }

//   const handleEdit = (id) => {
//     setEditId(id)
//     const selectedChannel = channels.find((ele) => ele._id === id)
//     setFormData({
//       channelPrice: selectedChannel.channelPrice,
//     })
//     toggleModal()
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value })
//   };

//   const handleAdd = (id) => {
//     const selectedChannel = channels.find((ele) => ele._id === id)
//     const { currentChannels } = userState.customer
//     const isChannelAlreadySubscribed = currentChannels?.some(channel => channel.channelId === id)
//     if (isChannelAlreadySubscribed) {
//       // Show toast message indicating already subscribed
//       toast.warning('You are already subscribed to this channel', {
//         position: "top-center",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       })

//     } else {
//       const newChannels = {
//         channelId: selectedChannel._id,
//         channelPrice: selectedChannel.channelPrice,
//         channelName: selectedChannel.channelName
//       };
//       setSelectedItems((previousItems) => [...previousItems, newChannels])
//       dispatch(selectedChannelOne(newChannels))
//       toast.success('Added to cart successfully', {
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       })
//     }
//   }


  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   if (editId) {
  //     dispatch(startEditChannel(editId, formData))
  //   } else {
  //     dispatch(startAddChannel(formData))
  //   }
  //   setFormData({
  //     channelPrice: "",
  //   });
  //   dispatch(startGetChannel())
  //   toggleModal()
  // };

//   const handleSearch = (e) => {
//     setSearch(e.target.value)
//     setCurrentPage(1) // Reset current page when search changes
//   };

//   const filteredChannels = channels.filter((ele) =>
//     ele.channelName.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleSort = (e) => {
//     setSort(e.target.value)
//   };

//   const sortedChannels = [...filteredChannels].sort((a, b) => {
//     if (sort === 'asc') {
//       return a.channelName.localeCompare(b.channelName)
//     } else {
//       return b.channelName.localeCompare(a.channelName)
//     }
//   });

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentChannels = sortedChannels.slice(indexOfFirstItem, indexOfLastItem)

//   const totalPages = Math.ceil(sortedChannels.length / itemsPerPage)

//   // Function to handle page change
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber)
//   }

//   return (
//     <div>
//       <ToastContainer />
//       {isLoading ? (
//         <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
//           <ClipLoader
//             color={"#7aa9ab"}
//             isLoading={isLoading}
//             size={30}
//           />
//         </div>

//       ) : (
//         <div className="row g-3 d-flex-wrap" style={{ gap: "1rem", justifyContent: "center", alignItems: "center" }}>
//           <h3 style={{ textAlign: "center", padding: "2px" }}>CHANNELS</h3>
//           <div className="col-md-11 d-flex" style={{ marginBottom: "0rem" }}>
//             <input type='text' value={search} onChange={handleSearch} placeholder="Search by channel name" className="form-control me-2" style={{ width: "200px" }} />
//             <Button icon={<PlusCircleFill/>} type="primary">Add Channel</Button>

//           </div>
//           <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-1 mt-2">
//             {currentChannels.map((ele) => (
//               <div key={ele.id} style={{ padding: "5px", width: "fit-content", height: "25rem" }}>
//                 <div className="card shadow-sm" style={{ width: "15rem", margin: "20px" }}>
//                   <img
//                     src={`http://localhost:3034/Images/${ele.image}`}
//                     alt="Channel"
//                     className="bd-placeholder-img card-img-top"
//                     style={{ objectFit: "cover", height: "12rem", width: "100%" }}
//                   />
//                   <div className="card-body" style={{ height: "10rem" }}>
//                     <h5 className="card-title">{ele.channelName}</h5>
//                     <p className="card-text" style={{ fontWeight: "bold" }}>Channel Price-{ele.channelPrice}.Rs</p>
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div className="btn-group">

//                         {userRole === 'admin' && (
//                           <>
//                             <button
//                               onClick={() => {
//                                 handleEdit(ele._id);
//                               }}
//                               className="btn btn-sm btn-outline-secondary"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => {
//                                 handleDelete(ele._id);
//                               }}
//                               className="btn btn-sm btn-outline-secondary"
//                             >
//                               Delete
//                             </button>
//                           </>
//                         )}

//                         {userRole === 'customer' && (
//                           <>
//                             <button
//                               onClick={() => {
//                                 handleAdd(ele._id);
//                               }}
//                               className="btn btn-sm btn-outline-secondary"
//                             >
//                               Add to Cart
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <Modal isOpen={modal} toggle={toggleModal}>
//             <ModalHeader toggle={toggleModal}>{editId ? "Edit Channel" : "Add Channel"}</ModalHeader>
//             <ModalBody>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="channelPrice" className="form-label">
//                     Channel Price
//                   </label>
//                   <input
//                     type="text"
//                     id="channelPrice"
//                     value={formData.channelPrice}
//                     onChange={handleChange}
//                     className="form-control"
//                   />
//                 </div>
//                 <Button type="submit" color="primary">
//                   Save Changes
//                 </Button>
//               </form>
//             </ModalBody>
//           </Modal>
//           <Pagination>
//             <PaginationItem disabled={currentPage === 1}>
//               <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
//             </PaginationItem>
//             {[...Array(totalPages)].map((_, index) => (
//               <PaginationItem key={index} active={index + 1 === currentPage}>
//                 <PaginationLink onClick={() => handlePageChange(index + 1)}>
//                   {index + 1}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}
//             <PaginationItem disabled={currentPage === totalPages}>
//               <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
//             </PaginationItem>
//           </Pagination>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ChannelsList

import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startAddChannel,
  startEditChannel,
  startGetChannel,
  startRemoveChannel
} from "../../actions/channel-action";
import { selectedChannelOne } from "../../actions/order-action";
import {
  Modal,
  Input,
  Button,
  Card,
  Pagination,
  Spin,
  Space,
  Typography,
  Tooltip,
  Flex,
  Form,
  Select,
  Popconfirm
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { OperatorContext } from "../profile/operatorContext";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { addDays, format } from "date-fns";
import AddChannel from "./AddChannels";
import {
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
const {Title}=Typography
const { Option } = Select;
const ChannelsList = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channel.data);
  const orders = useSelector((state) => state.order);
  const [modal, setModal] = useState(false)
  const { userState } = useContext(OperatorContext);
  const [form] = Form.useForm();
  const [editform] = Form.useForm();
  const onFinish = (values) => {
    if (editId) {
      dispatch(startEditChannel(editId, values))
    } 
    dispatch(startGetChannel())
    toggleEditModal()
  };
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const toggleEditModal = () => {
    setModal(!modal)
  }
  useEffect(() => {
    if (localStorage.getItem('token')) {
      const { role } = jwtDecode(localStorage.getItem("token"));
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch(startGetChannel())
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [dispatch]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleAddChannelClick = () => {
    setEditId(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (id) => {
    setEditId(id)
        const selectedChannel = channels.find((ele) => ele._id === id)
        editform.setFieldsValue({
          channelPrice:  selectedChannel.channelPrice,
        });
        setModal(true)
  };

  const handleDelete = (id) => {
    dispatch(startRemoveChannel(id));
    dispatch(startGetChannel());
  };

  const handleAddToCart = (id) => {
    const selectedChannel = channels.find((ele) => ele._id === id);
    const { currentChannels } = userState.customer;
    const isAlreadySubscribed = currentChannels?.some(
      (ch) => ch.channelId === id
    );

    if (isAlreadySubscribed) {
      toast.warning('You are already subscribed to this channel');
    } else {
      const newChannel = {
        channelId: selectedChannel._id,
        channelPrice: selectedChannel.channelPrice,
        channelName: selectedChannel.channelName
      };
      dispatch(selectedChannelOne(newChannel));
      toast.success('Added to cart successfully');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredChannels = channels.filter((ch) =>
    ch.channelName.toLowerCase().includes(search.toLowerCase())
  );

  const sortedChannels = [...filteredChannels].sort((a, b) => {
    return sort === 'asc'
      ? a.channelName.localeCompare(b.channelName)
      : b.channelName.localeCompare(a.channelName);
  });

  const paginatedChannels = sortedChannels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const iconStyle = { fontSize: "20px" };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9f9", minHeight: "90vh" }}>
      <ToastContainer />
        <>
      <Flex
  vertical
  gap="large"
  style={{ marginBottom: "2rem" }}
>
  {/* Header Section */}
  <Flex justify="space-between" align="center" wrap="wrap">
    <Title level={3} style={{ color: "#4B5563", marginBottom: 0 }}>
      📡 Browse Our Channels
    </Title>

    {userRole === "admin" && (
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={handleAddChannelClick}
      >
      Add Channel
      </Button>
    )}
  </Flex>

  {/* Search + Sort Section */}
  <Flex
    justify="start"
    align="center"
    gap="1rem"
    wrap="wrap"
  >
    <Input
      placeholder="🔍 Search by Channel name"
      value={search}
      onChange={handleSearch}
      allowClear
      style={{
        width: 300,
        borderRadius: "8px",
      }}
    />

    <Select
      value={sort}
      onChange={(value) => setSort(value)}
      style={{ width: 160 }}
      size="middle"
    >
      <Option value="asc">⬆️ Sort: A-Z</Option>
      <Option value="desc">⬇️ Sort: Z-A</Option>
    </Select>
  </Flex>
</Flex>
            
{isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
           <Spin size="large" />
        </div>
      ):
          <div  style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1.5rem",
            maxHeight: "65vh", 
            overflowY: "auto",
            padding: "1rem", 
          }}>
            {paginatedChannels.map((ch) => (
               <Card
                          size="small"
                            key={ch._id}
                            hoverable
                            style={{ width: 260, borderRadius: 10, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                            cover={
                              <img
                              src={`http://localhost:3034/Images/${ch.image}`}
                  alt={ch.channelName}
                                style={{
                                  height: "180px",
                                  objectFit: "cover",
                                  borderTopLeftRadius: 10,
                                  borderTopRightRadius: 10,
                                }}
                              />
                            }
                            actions={[
                             
                              userRole === "admin" && (
                                <Tooltip title="Edit">
                                  <EditOutlined style={{ ...iconStyle, color: "#faad14" }} onClick={() => handleEdit(ch._id)} />
                                </Tooltip>
                              ),
                              userRole === "admin" && (
                                <Popconfirm
      title="Are you sure you want to delete this item?"
      onConfirm={() => handleDelete(ch._id)}
      okText="Yes"
      cancelText="No"
    >
      <Tooltip title="Delete">
        <DeleteOutlined style={{ cursor: "pointer", color: "#ff4d4f" }} />
      </Tooltip>
    </Popconfirm>
                              ),
                              userRole === "customer" && (
                                <Tooltip title="Add to Cart">
                                  <ShoppingCartOutlined style={{ ...iconStyle, color: "#52c41a" }} onClick={() => handleAddToCart(ch._id)} />
                                </Tooltip>
                              ),
                            ].filter(Boolean)}
                          >
                            <Card.Meta
                              title={<b>{ch.channelName}</b>}
                              description={<span style={{ color: "#595959" }}>  <p><strong>Price:</strong> ₹{ch.channelPrice}</p></span>}
                            />
                          </Card>
              // <div
              //   key={ch._id}
              //   style={{
              //     width: 250,
              //     border: '1px solid #eee',
              //     borderRadius: 8,
              //     overflow: 'hidden',
              //     boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              //   }}
              // >
              //   <img
                  // src={`http://localhost:3034/Images/${ch.image}`}
                  // alt={ch.channelName}
              //     style={{ width: '100%', height: 150, objectFit: 'cover' }}
              //   />
              //   <div style={{ padding: 16 }}>
              //     <h5>{ch.channelName}</h5>
              //     <p><strong>Price:</strong> ₹{ch.channelPrice}</p>
              //     <Space>
              //       {userRole === 'admin' && (
              //         <>
              //           <Button size="small" onClick={() => handleEdit(ch._id)}>Edit</Button>
              //           <Button size="small" danger onClick={() => handleDelete(ch._id)}>Delete</Button>
              //         </>
              //       )}
              //       {userRole === 'customer' && (
              //         <Button size="small" onClick={() => handleAddToCart(ch._id)}>
              //           Add to Cart
              //         </Button>
              //       )}
              //     </Space>
              //   </div>
              // </div>
            ))}
          </div>
}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Pagination
              current={currentPage}
              total={filteredChannels.length}
              pageSize={itemsPerPage}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
          <Modal
      open={modal}
      onCancel={toggleEditModal}
      title={editId ? 'Edit Channel' : 'Add Channel'}
      footer={null}
    >
      <Form form={editform} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Channel Price"
          name="channelPrice"
          rules={[{ required: true, message: 'Please enter the channel price' }]}
        >
          <Input placeholder="Enter channel price" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
          <Modal
            open={modalOpen}
            onCancel={toggleModal}
           closable={false}
            footer={null}
            title={
              <Title level={3} style={{ textAlign: "center" }}>
              {/* <AppstoreAddOutlined style={{ color: "#1890ff", marginRight: 8 }} /> */}
              📺 {editId ? 'Edit Channel' : 'Add Channel'}
            </Title>
            }
            styles={{
              body:{
                background: 'linear-gradient(135deg,rgb(206, 143, 145) 0%, #fad0c4 100%)', 
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }
            }}
            centered
          >
           <AddChannel toggleModal={toggleModal}/>
          </Modal>
        </>
     
    </div>
  );
};

export default ChannelsList;
