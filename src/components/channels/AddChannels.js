// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { startAddChannel } from "../../actions/channel-action";
// import { startGetPackage } from "../../actions/package-action";
// import './channel.css'

// const AddChannel = (props) => {
//     const { addChannel } = props

//     const dispatch = useDispatch()

//     const [channelName, setChannelName] = useState('')
//     const [channelPrice, setChannelPrice] = useState('')
//     const [isHD, setIsHD] = useState(false)
//     const [channelNumber, setChannelNumber] = useState('')
//     const [language, setLanguage] = useState('')
//     const [image, setImage] = useState(null)
//     const [formErrors, setFormErrors] = useState([])

//     const errors = {}

//     function runValidations() {
//         if (channelName.trim().length === 0) {
//             errors.channelName = 'channel name is required'
//         }
//         if (channelPrice.trim().length === 0) {
//             errors.channelPrice = 'channel price is required'
//         }
//         if (channelNumber.trim().length === 0) {
//             errors.channelNumber = 'channel number is required'
//         }
//         if (language.trim().length === 0) {
//             errors.language = 'language is required'
//         }
//     }

//     const packages = useSelector((state) => {
//         return state.package.data
//     })

//     useEffect(() => {
//         dispatch(startGetPackage())
//     }, [dispatch])

//     const serverErrors = useSelector((state) => {
//         return state.channel.serverErrors

//     })
//     // console.log(serverErrors)
//     const resetForm = () => {
//         setChannelName('')
//         setChannelPrice('')
//         setChannelNumber('')
//         setLanguage('')
//         setImage(null)
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault()
//         runValidations()
//         if (Object.keys(errors).length === 0) {
//             const formData = new FormData()
//             formData.append("channelName", channelName)
//             formData.append("channelPrice", channelPrice)
//             formData.append("channelNumber", channelNumber)
//             formData.append(" channelNumber", channelNumber)
//             formData.append("language", language)
//             formData.append(" isHD", isHD)
//             formData.append("file", image)

//             dispatch(startAddChannel(formData, resetForm, addChannel))
//             setFormErrors([])
//         } else {
//             setFormErrors(errors)
//         }

//     }

//     return (

//         <div className=" mt-5 baby-custom container-custom">
//             <form onSubmit={handleSubmit}>
//                 <h3 className="chan">ADD CHANNEL</h3>
//                 <label className="label-custom" htmlFor="channelName">Channel Name</label>
//                 <input className="input-custom" type='text' value={channelName} placeholder="channel name.." id="channelName" onChange={(e) => {
//                     setChannelName(e.target.value);
//                     setFormErrors({ ...formErrors, channelName: '' });
//                 }} /><br />
//                 {formErrors.channelName && <span className="error">{formErrors.channelName}</span>}<br />

//                 <label className="label-custom" htmlFor="channelPrice">Channel Price</label>
//                 <input className="input-custom" type='number' value={channelPrice} placeholder="channel price.." id="channelPrice" onChange={(e) => {
//                     setChannelPrice(e.target.value);
//                     setFormErrors({ ...formErrors, channelPrice: '' });
//                 }} /><br />
//                 {formErrors.channelPrice && <span className="error">{formErrors.channelPrice}</span>}<br />


//                 <label className="label-custom" htmlFor="channelNumber">Channel Number</label>
//                 <input className="input-custom" type="number" value={channelNumber} placeholder="channel number.." id="channelNumber" onChange={(e) => {
//                     setChannelNumber(e.target.value);
//                     setFormErrors({ ...formErrors, channelNumber: '' });
//                 }} /><br />
//                 {formErrors.channelNumber && <span className="error">{formErrors.channelNumber}</span>}
//                 <br/>


//                 <label className="label-custom" htmlFor="language">Language</label>
//                 <input className="input-custom" type='text' value={language} placeholder="language.." id="language" onChange={(e) => {

//                     setLanguage(e.target.value);
//                     setFormErrors({ ...formErrors, language: '' });
//                 }} /><br />
//                 {formErrors.language && <span className="error">{formErrors.language}</span>} <br />
//                 <br />
//                 <div>


//                     <input className="label-custom" type='file' onChange={(e) => {
//                         setImage(e.target.files[0]);

//                     }} />
//                 </div><br />

//                 <input className="button" type='submit' />
//                 <p>{serverErrors}</p>
//                 {/* {/* {serverErrors.map((ele, index)=>(
//                  <div key={index}>{ele.msg}</div> */}

//                 {/* ))} */}
//             </form>

//         </div>


//     )
// }
// export default AddChannel

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Upload,
  Button,
  message,
} from 'antd';
import { UploadOutlined,CheckCircleOutlined } from '@ant-design/icons';
import { startAddChannel } from '../../actions/channel-action';
import { startGetPackage } from '../../actions/package-action';
import {ToastContainer, toast} from 'react-toastify'
import { motion } from "framer-motion";
const AddChannel = ({toggleModal}) => {
    
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const serverErrors = useSelector((state) => state.channel.serverErrors);
  const packages = useSelector((state) => state.package.data);

  useEffect(() => {
    dispatch(startGetPackage());
  }, [dispatch]);

  const resetForm = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('channelName', values.channelName);
    formData.append('channelPrice', values.channelPrice);
    formData.append('channelNumber', values.channelNumber);
    formData.append('language', values.language);
    formData.append('isHD', values.isHD);
    if (values.image && values.image.length > 0) {
      formData.append('file', values.image[0].originFileObj);
    }
    dispatch(startAddChannel(formData, resetForm, addChannel,toggleModal));
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };
  const addChannel = ()=>{
    toast.success('Successfully added channel', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored"
    })
  }
  return (
    <div >
      <Form
      style={{ minWidth: 400, margin: '50px auto',  }}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ isHD: false }}
      >
        <Form.Item
          name="channelName"
          label="Channel Name"
          rules={[{ required: true, message: 'Please input channel name!' }]}
        >
          <Input placeholder="Enter channel name" />
        </Form.Item>

        <Form.Item
          name="channelPrice"
          label="Channel Price"
          rules={[{ required: true, message: 'Please input channel price!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter channel price" />
        </Form.Item>

        <Form.Item
          name="channelNumber"
          label="Channel Number"
          rules={[{ required: true, message: 'Please input channel number!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter channel number" />
        </Form.Item>

        <Form.Item
          name="language"
          label="Language"
          rules={[{ required: true, message: 'Please input language!' }]}
        >
          <Input placeholder="Enter language" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Channel Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'Please input Image!' }]}
        >
          <Upload
            name="logo"
            listType="picture"
            beforeUpload={() => false} // prevent auto upload
            accept=".png,.jpg,.jpeg"
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        {serverErrors && (
          <div style={{ marginBottom: 16, color: 'red' }}>
            {serverErrors}
          </div>
        )}

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
                Add Channel
              </Button>
            </motion.div>
          </Form.Item>
      </Form>
    </div>
  );
};

export default AddChannel;
