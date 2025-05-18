// import React, { useContext, useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {  Modal, ModalHeader, ModalBody } from "reactstrap";
// import { startRemovePackage, startAddPackage, startEditPackage, startGetPackage } from "../../actions/package-action";
// import { deletePackageOne, selectedPackageOne, startGetOrder } from "../../actions/order-action";
// import { OperatorContext } from "../profile/operatorContext";
// import { jwtDecode } from "jwt-decode";
// import { ClipLoader } from "react-spinners";
// import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
// import { ToastContainer, toast } from 'react-toastify'
// import { Button, Space } from 'antd';
// import {
//   EditOutlined,
//   DeleteOutlined,
//   ShoppingCartOutlined,
//   EyeOutlined,
// } from '@ant-design/icons';
// import './ButtonGroup.css';


// const ListPackages = () => {
//   const [editId, setEditId] = useState(null);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [modal, setModal] = useState(false);
//   const [userRole, setUserRole] = useState('')
//   const [selectedPackage, setSelectedPackage] = useState('')
//   const [viewModal, setViewModal] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [formData, setFormData] = useState({
//     packagePrice: "",
//   })

//   const [search, setSearch] = useState('')
//   const [sort, setSort] = useState('asc') // Default sort order
//   const [currentPage, setCurrentPage] = useState(1)// Current page state
//   const [itemsPerPage, setItemsPerPage] = useState(10) // Items per page state


//   useEffect(() => {
//     if (localStorage.getItem('token')) {
//       const { role } = jwtDecode(localStorage.getItem("token"))
//       setUserRole(role)
//     }
//   }, [localStorage.getItem('token')])

//   const dispatch = useDispatch();

//   const packages = useSelector((state) => {
//     return state.package.data.filter((ele) => ele.isDeleted === false)
//   })

//   const orders = useSelector((state) => {
//     return state.order
//   })
//   // console.log(orders, orders)

//   useEffect(() => {
//     setIsLoading(true)
//     dispatch(startGetPackage())
//       .then(() => {
//         setIsLoading(false)
//       })
//       .catch((error) => {
//         console.error('Error fetching packages:', error)
//         setIsLoading(false)
//       })
//   }, [dispatch])

//   const toggleModal = () => {
//     setModal(!modal)
//   }

//   const toggleViewModal = () => {
//     setViewModal(!viewModal)
//   }

//   const handleDelete = (id) => {
//     const confirm = window.confirm("Are you sure?")
//     if (confirm) {
//       dispatch(startRemovePackage(id))
//     }
//   }

//   const handleEdit = (id) => {
//     setEditId(id);
//     const selectedPackage = packages.find((ele) => ele._id === id)
//     setFormData({
//       packagePrice: selectedPackage.packagePrice,
//     })
//     setModal(true)
//     // toggleViewModal(false);
//   };


//   useEffect(() => {
//     dispatch(startGetOrder())
//   }, [dispatch])


//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   }

//   const { userState, userDispatch } = useContext(OperatorContext)

//   const handleAdd = (id) => {
//     const selectedPackage = packages.find((ele) => ele._id === id)
//     const { currentPackages } = userState.customer

//     // Check if the selected package is already subscribed
//     const isSubscribed = currentPackages?.some(pkg => pkg.packageId === id)

//     if (!isSubscribed) {
//       const newPackage = {
//         packageId: selectedPackage._id,
//         packagePrice: selectedPackage.packagePrice,
//         packageName: selectedPackage.packageName,
//         selectedChannels: selectedPackage.selectedChannels
//       };

//       dispatch(selectedPackageOne(newPackage))

//       toast.success('Added to cart successfully', {
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
//     } else {
//       toast.warning('Package already subscribed', {
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true
//       });
//     }
//   }


//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (editId) {
//       dispatch(startEditPackage(editId, formData))
//         .then(() => {
//           dispatch(startGetPackage()) // Fetch updated list of packages
//           toggleModal() // Close the modal after successful edit
//         })
//         .catch((error) => {
//           console.log("Error editing package:", error)
//         })
//     } else {
//       dispatch(startAddPackage(formData))
//     }
//     setFormData({
//       packagePrice: "",
//     });
//   };


//   const handleRemove = (id) => {
//     const removeItem = selectedItems.find((ele) => ele._id === id)
//     dispatch(deletePackageOne(removeItem))
//   }

//   const handleView = (id) => {
//     const selectedPkg = packages.find((pkg) => pkg._id === id)
//     setSelectedPackage(selectedPkg)
//     setViewModal(true)
//     // toggleModal(false)
//   }

//   const handleSearch = (e) => {
//     setSearch(e.target.value)
//     setCurrentPage(1)
//   }

//   const filteredPackages = packages.filter((ele) =>
//     ele.packageName.toLowerCase().includes(search.toLowerCase())
//   )

//   const handleSort = (e) => {
//     setSort(e.target.value)
//   }

//   const sortedPackages = [...filteredPackages].sort((a, b) => {
//     if (sort === 'asc') {
//       return a.packageName.localeCompare(b.packageName)
//     } else {
//       return b.packageName.localeCompare(a.packageName)
//     }
//   });

//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentPackages = sortedPackages.slice(indexOfFirstItem, indexOfLastItem)

//   const totalPages = Math.ceil(sortedPackages.length / itemsPerPage)

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

//           <h3 style={{ marginLeft: "400px", padding: "2px" }}>PACKAGES</h3>
//           <div className="col-md-11 d-flex" style={{ marginBottom: "0rem"}}>
//             <input type='text' value={search} onChange={handleSearch} placeholder="Search by package name" className="form-control me-2" style={{ width: "200px", marginRight: "100px"}} />

//           </div>
//           {/* <input type='text' value={search} onChange={handleSearch} placeholder="Search by package name" className="form-control" style={{ width: "150px" }}/> */}
//           {/* <Form>
//                         <FormGroup>
//                             <Label for="sort">Sort Order:</Label>
//                             <Input type="select" name="sort" id="sortOrder" value={sort} onChange={handleSort} className="form-select" style={{ width: "150px" }}>
//                                 <option value="asc">A-Z</option>
//                                 <option value="desc">Z-A</option>
//                             </Input>
//                         </FormGroup>
//                     </Form> */}

//           <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 g-1 mt-2">
//             {currentPackages.map((ele) => (
//               <div key={ele.id} style={{ padding: "5px", width: "fit-content", height: "25rem" }}>
//                 <div className="card shadow-sm" style={{ width: "15rem", margin: "20px" }}>
//                   <img
//                     src={`http://localhost:3034/Images/${ele.image}`}
//                     alt="Package"
//                     className="bd-placeholder-img card-img-top"
//                     style={{ objectFit: "cover", height: "12rem", width: "100%" }}
//                   />
//                   <div className="card-body" style={{ height: "10rem" }}>
//                     <h5 className="card-title">{ele.packageName}</h5>
//                     <p className="card-text" style={{ fontWeight: "bold" }}>Package Price-{ele.packagePrice}.Rs</p>
//                     <div className="d-flex justify-content-between align-items-center">
//                       {/* <div className="btn-group">
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
//                               style={{ marginRight: '20px' }}
//                             >
//                               Add to Cart
//                             </button>
//                           </>
//                         )}

//                         <button onClick={() => {
//                           handleView(ele._id)
//                         }} style={{ marginRight: '50px' }} >
//                           view
//                         </button>

//                       </div> */}
//                         <Space wrap size="middle" className="button-group" direction="horizontal" >
                          
//       <Button
//         // type="dashed"
//         icon={<EyeOutlined />}
//         onClick={() => handleView(ele._id)}
//         style={{backgroundColor:"lightblue"}}
//         className="animated-btn"
//       >
        
//       </Button>
//       {userRole === 'admin' && (
//         <>
//           <Button
//             type="primary"
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(ele._id)}
//             className="animated-btn"
//           >
//             Edit
//           </Button>
//           <Button
//             danger
//             icon={<DeleteOutlined />}
//             onClick={() => handleDelete(ele._id)}
//             className="animated-btn"
//           >
//             Delete
//           </Button>
//         </>
//       )}

//       {userRole === 'customer' && (
//         <Button
//           type="default"
//           icon={<ShoppingCartOutlined />}
//           onClick={() => handleAdd(ele._id)}
//           className="animated-btn"
//         >
//           Add to Cart
//         </Button>
//       )}
//     </Space>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <Modal isOpen={modal} toggle={toggleModal}>
//             <ModalHeader toggle={toggleModal}>Edit Package</ModalHeader>
//             <ModalBody>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="packagePrice" className="form-label">
//                     Price
//                   </label>
//                   <input
//                     type="number"
//                     id="packagePrice"
//                     value={formData.packagePrice}
//                     onChange={handleChange}
//                     className="form-control"
//                   />
//                 </div>
//                 <Button type="submit" color="primary">
//                   Save
//                 </Button>
//               </form>
//             </ModalBody>
//           </Modal>

          // <Modal isOpen={viewModal} toggle={toggleViewModal}>
          //   <ModalHeader toggle={toggleViewModal}>Channels</ModalHeader>
          //   <ModalBody>
          //     {selectedPackage && (
          //       <div>
          //         {/* <ul>
              
          //       {selectedPackage.selectedChannels.map((channel, index) => (
          //         <li key={index}><img src={`http://localhost:3034/Images/${channel.image}`} alt={channel.channelName} style={{ maxHeight: "50px" }} />{channel.channelName}</li>
          //       ))}
          //     </ul> */}
          //         <div style={{ display: "flex", flexWrap: "wrap" }}>
          //           {/* Render selected channels */}
          //           {selectedPackage.selectedChannels.map((channel, index) => (
          //             <div key={index} style={{ margin: "5px" }}>
          //               <img src={`http://localhost:3034/Images/${channel.image}`} alt={channel.channelName} style={{ maxHeight: "50px" }} />
          //               <div>{channel.channelName}</div>
          //             </div>
          //           ))}
          //         </div>
          //       </div>
          //     )}
          //   </ModalBody>
          // </Modal>
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
//   );
// };

// export default ListPackages;



import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startRemovePackage,
  startAddPackage,
  startEditPackage,
  startGetPackage,
} from "../../actions/package-action";
import {
  deletePackageOne,
  selectedPackageOne,
  startGetOrder,
} from "../../actions/order-action";
import { OperatorContext } from "../profile/operatorContext";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
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
  selectedUser,
  Select,
  Popconfirm

} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { PlusCircleOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import AddPackage from "./AddPackage";
import { AppstoreAddOutlined } from "@ant-design/icons";
const { Title } = Typography;
const { Option } = Select;
const ListPackages = () => {
  const [editId, setEditId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [formData, setFormData] = useState({ packagePrice: "" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { userState } = useContext(OperatorContext);

  const packages = useSelector((state) =>
    state.package.data.filter((pkg) => !pkg.isDeleted)
  );
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const { role } = jwtDecode(localStorage.getItem("token"));
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch(startGetPackage()).finally(() => setIsLoading(false));
    dispatch(startGetOrder());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (value) => {
    setSort(value);
  };

  const handleEdit = (id) => {
    const selected = packages.find((pkg) => pkg._id === id);
    setFormData({ packagePrice: selected.packagePrice });
    setEditId(id);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(startRemovePackage(id));
  };

  const handleAddToCart = (id) => {
    const selected = packages.find((pkg) => pkg._id === id);
    const isSubscribed = userState?.customer?.currentPackages?.some(
      (pkg) => pkg.packageId === id
    );

    if (isSubscribed) {
      toast.warning("Package already subscribed", { position: "top-center" });
    } else {
      dispatch(
        selectedPackageOne({
          packageId: selected._id,
          packagePrice: selected.packagePrice,
          packageName: selected.packageName,
          selectedChannels: selected.selectedChannels,
        })
      );
      toast.success("Added to cart successfully", { position: "top-center" });
    }
  };

  const handleSubmit = () => {
    if (editId) {
      dispatch(startEditPackage(editId, formData)).then(() => {
        dispatch(startGetPackage());
        setModalVisible(false);
        setEditId(null);
      });
    } else {
      dispatch(startAddPackage(formData));
    }
    setFormData({ packagePrice: "" });
  };

  const handleView = (id) => {
    const selected = packages.find((pkg) => pkg._id === id);
    setSelectedPackage(selected);
    setViewModalVisible(true);
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.packageName.toLowerCase().includes(search.toLowerCase())
  );

  const sortedPackages = [...filteredPackages].sort((a, b) =>
    sort === "asc"
      ? a.packageName.localeCompare(b.packageName)
      : b.packageName.localeCompare(a.packageName)
  );

  const paginatedPackages = sortedPackages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const iconStyle = { fontSize: "20px" };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f9f9f9", minHeight: "90vh" }}>
      <ToastContainer />
      <Flex
  vertical
  gap="large"
  style={{ marginBottom: "2rem" }}
>
      <Flex justify="space-between" align="center" wrap="wrap">
      <Title level={3} style={{ textAlign: "center", color: "#4B5563" }}>
        🎁 Browse Our Packages
      </Title>

    {userRole === "admin" && (
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={toggleModal}
      >
      Add Package
      </Button>
    )}
  </Flex>
  <Flex
    justify="start"
    align="center"
    gap="1rem"
    wrap="wrap"
  >
    <Input
      placeholder="🔍 Search by Package Name"
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
      onChange={handleSort}
      style={{ width: 160 }}
      size="middle"
    >
      <Option value="asc">⬆️ Sort: A-Z</Option>
      <Option value="desc">⬇️ Sort: Z-A</Option>
    </Select>
  </Flex>
  </Flex>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "5rem" }}>
          <Spin size="large" />
        </div>
      ) : (
        <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1.5rem",
          maxHeight: "65vh", 
          overflowY: "auto",
          padding: "1rem", 
        }}
        >
          {paginatedPackages.map((pkg) => (
            <Card
            size="small"
              key={pkg._id}
              hoverable
              style={{ width: 260, borderRadius: 10, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
              cover={
                <img
                  alt={pkg.packageName}
                  src={`http://localhost:3034/Images/${pkg.image}`}
                  style={{
                    height: "180px",
                    objectFit: "cover",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                />
              }
              actions={[
                <Tooltip title="View">
                  <EyeOutlined style={{ ...iconStyle, color: "#1890ff" }} onClick={() => handleView(pkg._id)} />
                </Tooltip>,
                userRole === "admin" && (
                  <Tooltip title="Edit">
                    <EditOutlined style={{ ...iconStyle, color: "#faad14" }} onClick={() => handleEdit(pkg._id)} />
                  </Tooltip>
                ),
                userRole === "admin" && (
                  <Popconfirm
                  title="Are you sure you want to delete this item?"
                  onConfirm={() => handleDelete(pkg._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip title="Delete">
                    <DeleteOutlined style={{ cursor: "pointer", color: "#ff4d4f" }} />
                  </Tooltip>
                </Popconfirm>
                  // <Tooltip title="Delete">
                  //   <DeleteOutlined style={{ ...iconStyle, color: "#ff4d4f" }} onClick={() => handleDelete(pkg._id)} />
                  // </Tooltip>
                ),
                userRole === "customer" && (
                  <Tooltip title="Add to Cart">
                    <ShoppingCartOutlined style={{ ...iconStyle, color: "#52c41a" }} onClick={() => handleAddToCart(pkg._id)} />
                  </Tooltip>
                ),
              ].filter(Boolean)}
            >
              <Card.Meta
                title={<b>{pkg.packageName}</b>}
                description={<span style={{ color: "#595959" }}>Price: ₹{pkg.packagePrice}</span>}
              />
            </Card>
          ))}
        </div>
      )}

      <Pagination
        current={currentPage}
        total={sortedPackages.length}
        pageSize={itemsPerPage}
        onChange={(page) => setCurrentPage(page)}
        style={{ textAlign: "center", marginTop: "2rem" }}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Package Price"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText="💾 Save"
      >
        <Input
          type="number"
          value={formData.packagePrice}
          onChange={(e) => setFormData({ packagePrice: e.target.value })}
          placeholder="Enter Package Price"
        />
      </Modal>

      {/* View Modal */}
      <Modal
        title="📦 Package Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedPackage && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {selectedPackage.selectedChannels.map((channel, index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <img
                  src={`http://localhost:3034/Images/${channel.image}`}
                  alt={channel.channelName}
                  style={{ height: "50px", borderRadius: "4px" }}
                />
                <div style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>{channel.channelName}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>
      <Modal
  open={modalOpen}
  onCancel={toggleModal}
  closable={false}
  footer={null}
  title={
    <Title level={3} style={{ textAlign: "center" }}>
    <AppstoreAddOutlined style={{ color: "#1890ff", marginRight: 8 }} />
    Add Package
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
    <AddPackage toggleModal={toggleModal} />
</Modal>
    </div>
  );
};

export default ListPackages;

