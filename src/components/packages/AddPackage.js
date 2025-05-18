// import { useEffect, useState } from "react"
// import Select from 'react-select'
// import { useDispatch, useSelector } from "react-redux"
// import { startAddPackage } from "../../actions/package-action"
// import { startGetChannel } from "../../actions/channel-action"
// import './packcha.css'
// import 'bootstrap/dist/css/bootstrap.min.css'

// const AddPackage = ({toggleModal}) => {
//     const dispatch = useDispatch()

    // const channels = useSelector((state) => {
    //     return state.channel.data.map((ele) => ({
    //         value: ele.channelName,
    //         label: ele.channelName
    //     }))
    // })
//   const addPackage = ()=>{
//     toast.success('Successfully added package', {
//       position: "top-right",
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "colored"
//     })
//   }
//     const [packageName, setPackageName] = useState('')
//     const [packagePrice, setPackagePrice] = useState('')
//     const [selectedChannels, setSelectedChannels] = useState(false)
//     const [image, setImage] = useState(null)
//     const [formErrors, setFormErrors] = useState([])
//     const errors = {}


//     function runValidation() {
//         if (packageName.trim().length === 0) {
//             errors.packageName = "package name is required"
//         }
//         if (packagePrice.trim().length === 0) {
//             errors.packagePrice = "package price is required"
//         }
//         if (!selectedChannels || selectedChannels.length === 0){
//             errors.selectedChannels = 'At least one channel is required'
//         }
//     }

//     useEffect(() => {
//         dispatch(startGetChannel())
//     }, [dispatch, selectedChannels])

//     const resetForm = ()=>{
//         setPackageName('')
//         setPackagePrice('')
//         setImage(null)
//         setSelectedChannels([]);
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault()
//         runValidation()

//         if (Object.keys(errors).length === 0) {
//             const formData = new FormData()
//             formData.append("packageName", packageName)
//             formData.append("packagePrice", packagePrice)
//             formData.append("file", image)

//             // selectedChannels: selectedChannels ? selectedChannels.map(channel => channel.value) : null
//             if (selectedChannels) {
//                 selectedChannels.forEach((channel, index) => {
//                     formData.append(`selectedChannels[${index}]`, channel.value);
//                 })
//             }
            
//             dispatch(startAddPackage(formData, resetForm, addPackage,toggleModal))
//             setFormErrors([])
//         } else {
//             setFormErrors(errors)
//         }
//     }



//     return (
//         <div className="d-flex align-items-center justify-content-center vh-100 backing" >
//             <form onSubmit={handleSubmit} style={{ fontFamily: "Verdana, sans-serif", fontWeight: "bold" }}>
//                 <h3 style={{ color: "white", fontFamily: "Verdana, sans-serif" }}>Add Packages</h3>

//                 <label htmlFor="packageName" style={{ color: "white", fontWeight: "bold" }}>Package Name</label><br />
//                 <input type='text' value={packageName} id="packageName" onChange={(e) => { setPackageName(e.target.value); setFormErrors({ ...formErrors, packageName: '' }) }} /><br/>
//                 {formErrors.packageName && <span className="error">{formErrors.packageName}</span>}<br />

//                 <label htmlFor="packagePrice" style={{ color: "white", fontWeight: "bold" }}>Package Price</label><br/>
//                 <input type='number' value={packagePrice} id="packagePrice" onChange={(e) => { setPackagePrice(e.target.value); setFormErrors({ ...formErrors, packagePrice: '' }) }} /><br/>
//                 {formErrors.packagePrice && <span className="error">{formErrors.packagePrice}</span>}
//                 {/* <label htmlFor="channels">channels</label>
//                 <input type='text' values={channels} id="channels" onChange={(e)=>{setChannels(e.target.value)}} /> */}
//                 <br />
//                 <div style={{ width: 300 }}>
//                     <label style={{color: "white", fontWeight: "bold" }}>Select Channels</label><br />
//                     <Select
//                         options={channels}
//                         value={selectedChannels}
//                         placeholder="select your channels"
//                         onChange={(selectedOptions) => {setSelectedChannels(selectedOptions); setFormErrors({ ...formErrors, selectedChannels: '' })}}
//                         isMulti
//                         isSearchable
//                         noOptionsMessage={() => "No channels found.."}

//                         styles={{
//                             placeholder: (baseStyles, state) => ({
//                                 ...baseStyles,
//                                 color: "brown"
//                             }),
//                             clearIndicator: (baseStyles, state) => ({
//                                 ...baseStyles,
//                                 color: "red"
//                             }),
//                             dropdownIndicator: (baseStyles, state) => ({
//                                 ...baseStyles,
//                                 color: "black"
//                             }),
//                             control: (baseStyles, state) => ({
//                                 ...baseStyles,
//                                 borderColor: "black"
//                             }),
//                             multiValueRemove: (baseStyles, state) => ({
//                                 ...baseStyles,
//                                 color: "red",
//                                 backgroundColor: "beige"
//                             })
//                         }}
//                     />
//                 </div>
//                 {formErrors.selectedChannels && <span className="error">{formErrors.selectedChannels}</span>}
//                 <br/>
//                 <div>
//                     <input  style={{color: "white", fontWeight: "bold" }} type='file' onChange={(e) => {
//                         setImage(e.target.files[0])
//                     }} />
//                 </div>
//                 <br />
//                 <input type='submit' style={{ backgroundColor: "#cd7f32", color: "white", fontWeight: "bold", marginLeft: "60px" }} />
//             </form>
//         </div>
//     )
// }

// export default AddPackage 
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Upload, Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { startAddPackage } from "../../actions/package-action";
import { startGetChannel } from "../../actions/channel-action";
import { UploadOutlined, DollarOutlined, FileAddOutlined, CheckCircleOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import './packcha.css';

const { Title } = Typography;
const { Option } = Select;

const AddPackage = ({ toggleModal }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const channels = useSelector((state) => {
    return state.channel.data.map((ele) => ({
      value: ele.channelName,
      label: ele.channelName,
    }));
  });
console.log(channels,'chh')
  const addPackage = () => {
    toast.success("Successfully added package", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
  };

  useEffect(() => {
    dispatch(startGetChannel());
  }, [dispatch]);

  const handleFinish = (values) => {
    const formData = new FormData();
    formData.append("packageName", values.packageName);
    formData.append("packagePrice", values.packagePrice);

    values.selectedChannels.forEach((channel, index) => {
      formData.append(`selectedChannels[${index}]`, channel);
    });

    if (fileList.length > 0) {
      formData.append("file", fileList[0].originFileObj);
    }

    const resetForm = () => {
      form.resetFields();
      setFileList([]);
    };

    dispatch(startAddPackage(formData, resetForm, addPackage, toggleModal));
  };

  return (
        <Form form={form} layout="vertical" onFinish={handleFinish}   style={{
          borderRadius: 12,
          width: "80%",
          padding:5,
          margin:20
        }}>

          <Form.Item
            label="📦 Package Name"
            name="packageName"
            rules={[{ required: true, message: "Package name is required" }]}
          >
            <Input placeholder="Enter package name" />
          </Form.Item>

          <Form.Item
            label="💰 Package Price"
            name="packagePrice"
            rules={[{ required: true, message: "Package price is required" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              prefix={<DollarOutlined />}
              placeholder="Enter price"
            />
          </Form.Item>

          <Form.Item
            label="📡 Select Channels"
            name="selectedChannels"
            rules={[{ required: true, message: "At least one channel is required" }]}
          >
            <Select
              mode="multiple"
              placeholder="Choose channels"
              options={channels}
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item label="🖼️ Upload Image" name="image">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} style={{ backgroundColor: "#e6f7ff", borderColor: "#91d5ff" }}>
                Select File
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{justifyItems:"center"}}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckCircleOutlined />}
                style={{
                //   width: "100%",
                  background: "linear-gradient(90deg,rgb(22, 135, 241) 0%, #40a9ff 100%)",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                Add Package
              </Button>
            </motion.div>
          </Form.Item>
        </Form>
  );
};

export default AddPackage;
