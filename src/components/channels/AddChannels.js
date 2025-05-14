import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startAddChannel } from "../../actions/channel-action";
import { startGetPackage } from "../../actions/package-action";
import './channel.css'

const AddChannel = (props) => {
    const { addChannel } = props

    const dispatch = useDispatch()

    const [channelName, setChannelName] = useState('')
    const [channelPrice, setChannelPrice] = useState('')
    const [isHD, setIsHD] = useState(false)
    const [channelNumber, setChannelNumber] = useState('')
    const [language, setLanguage] = useState('')
    const [image, setImage] = useState(null)
    const [formErrors, setFormErrors] = useState([])

    const errors = {}

    function runValidations() {
        if (channelName.trim().length === 0) {
            errors.channelName = 'channel name is required'
        }
        if (channelPrice.trim().length === 0) {
            errors.channelPrice = 'channel price is required'
        }
        if (channelNumber.trim().length === 0) {
            errors.channelNumber = 'channel number is required'
        }
        if (language.trim().length === 0) {
            errors.language = 'language is required'
        }
    }

    const packages = useSelector((state) => {
        return state.package.data
    })

    useEffect(() => {
        dispatch(startGetPackage())
    }, [dispatch])

    const serverErrors = useSelector((state) => {
        return state.channel.serverErrors

    })
    // console.log(serverErrors)
    const resetForm = () => {
        setChannelName('')
        setChannelPrice('')
        setChannelNumber('')
        setLanguage('')
        setImage(null)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        runValidations()
        if (Object.keys(errors).length === 0) {
            const formData = new FormData()
            formData.append("channelName", channelName)
            formData.append("channelPrice", channelPrice)
            formData.append("channelNumber", channelNumber)
            formData.append(" channelNumber", channelNumber)
            formData.append("language", language)
            formData.append(" isHD", isHD)
            formData.append("file", image)

            dispatch(startAddChannel(formData, resetForm, addChannel))
            setFormErrors([])
        } else {
            setFormErrors(errors)
        }

    }

    return (

        <div className=" mt-5 baby-custom container-custom">
            <form onSubmit={handleSubmit}>
                <h3 className="chan">ADD CHANNEL</h3>
                <label className="label-custom" htmlFor="channelName">Channel Name</label>
                <input className="input-custom" type='text' value={channelName} placeholder="channel name.." id="channelName" onChange={(e) => {
                    setChannelName(e.target.value);
                    setFormErrors({ ...formErrors, channelName: '' });
                }} /><br />
                {formErrors.channelName && <span className="error">{formErrors.channelName}</span>}<br />

                <label className="label-custom" htmlFor="channelPrice">Channel Price</label>
                <input className="input-custom" type='number' value={channelPrice} placeholder="channel price.." id="channelPrice" onChange={(e) => {
                    setChannelPrice(e.target.value);
                    setFormErrors({ ...formErrors, channelPrice: '' });
                }} /><br />
                {formErrors.channelPrice && <span className="error">{formErrors.channelPrice}</span>}<br />


                <label className="label-custom" htmlFor="channelNumber">Channel Number</label>
                <input className="input-custom" type="number" value={channelNumber} placeholder="channel number.." id="channelNumber" onChange={(e) => {
                    setChannelNumber(e.target.value);
                    setFormErrors({ ...formErrors, channelNumber: '' });
                }} /><br />
                {formErrors.channelNumber && <span className="error">{formErrors.channelNumber}</span>}
                <br/>


                <label className="label-custom" htmlFor="language">Language</label>
                <input className="input-custom" type='text' value={language} placeholder="language.." id="language" onChange={(e) => {

                    setLanguage(e.target.value);
                    setFormErrors({ ...formErrors, language: '' });
                }} /><br />
                {formErrors.language && <span className="error">{formErrors.language}</span>} <br />
                <br />
                <div>


                    <input className="label-custom" type='file' onChange={(e) => {
                        setImage(e.target.files[0]);

                    }} />
                </div><br />

                <input className="button" type='submit' />
                <p>{serverErrors}</p>
                {/* {/* {serverErrors.map((ele, index)=>(
                 <div key={index}>{ele.msg}</div> */}

                {/* ))} */}
            </form>

        </div>


    )
}
export default AddChannel

