import { useEffect, useState } from "react"
import Select from 'react-select'
import { useDispatch, useSelector } from "react-redux"
import { startAddPackage } from "../../actions/package-action"
import { startGetChannel } from "../../actions/channel-action"
import './packcha.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const AddPackage = (props) => {
    const {addPackage} = props
    const dispatch = useDispatch()

    const channels = useSelector((state) => {
        return state.channel.data.map((ele) => ({
            value: ele.channelName,
            label: ele.channelName
        }))
    })

    const [packageName, setPackageName] = useState('')
    const [packagePrice, setPackagePrice] = useState('')
    const [selectedChannels, setSelectedChannels] = useState(false)
    const [image, setImage] = useState(null)
    const [formErrors, setFormErrors] = useState([])
    const errors = {}


    function runValidation() {
        if (packageName.trim().length === 0) {
            errors.packageName = "package name is required"
        }
        if (packagePrice.trim().length === 0) {
            errors.packagePrice = "package price is required"
        }
        if (!selectedChannels || selectedChannels.length === 0){
            errors.selectedChannels = 'At least one channel is required'
        }
    }

    useEffect(() => {
        dispatch(startGetChannel())
    }, [dispatch, selectedChannels])

    const resetForm = ()=>{
        setPackageName('')
        setPackagePrice('')
        setImage(null)
        setSelectedChannels([]);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        runValidation()

        if (Object.keys(errors).length === 0) {
            const formData = new FormData()
            formData.append("packageName", packageName)
            formData.append("packagePrice", packagePrice)
            formData.append("file", image)

            // selectedChannels: selectedChannels ? selectedChannels.map(channel => channel.value) : null
            if (selectedChannels) {
                selectedChannels.forEach((channel, index) => {
                    formData.append(`selectedChannels[${index}]`, channel.value);
                })
            }
            
            dispatch(startAddPackage(formData, resetForm, addPackage))
            setFormErrors([])
        } else {
            setFormErrors(errors)
        }
    }



    return (
        <div className="d-flex align-items-center justify-content-center vh-100 backing" >
            <form onSubmit={handleSubmit} style={{ fontFamily: "Verdana, sans-serif", fontWeight: "bold" }}>
                <h3 style={{ color: "white", fontFamily: "Verdana, sans-serif" }}>Add Packages</h3>

                <label htmlFor="packageName" style={{ color: "white", fontWeight: "bold" }}>Package Name</label><br />
                <input type='text' value={packageName} id="packageName" onChange={(e) => { setPackageName(e.target.value); setFormErrors({ ...formErrors, packageName: '' }) }} /><br/>
                {formErrors.packageName && <span className="error">{formErrors.packageName}</span>}<br />

                <label htmlFor="packagePrice" style={{ color: "white", fontWeight: "bold" }}>Package Price</label><br/>
                <input type='number' value={packagePrice} id="packagePrice" onChange={(e) => { setPackagePrice(e.target.value); setFormErrors({ ...formErrors, packagePrice: '' }) }} /><br/>
                {formErrors.packagePrice && <span className="error">{formErrors.packagePrice}</span>}
                {/* <label htmlFor="channels">channels</label>
                <input type='text' values={channels} id="channels" onChange={(e)=>{setChannels(e.target.value)}} /> */}
                <br />
                <div style={{ width: 300 }}>
                    <label style={{color: "white", fontWeight: "bold" }}>Select Channels</label><br />
                    <Select
                        options={channels}
                        value={selectedChannels}
                        placeholder="select your channels"
                        onChange={(selectedOptions) => {setSelectedChannels(selectedOptions); setFormErrors({ ...formErrors, selectedChannels: '' })}}
                        isMulti
                        isSearchable
                        noOptionsMessage={() => "No channels found.."}

                        styles={{
                            placeholder: (baseStyles, state) => ({
                                ...baseStyles,
                                color: "brown"
                            }),
                            clearIndicator: (baseStyles, state) => ({
                                ...baseStyles,
                                color: "red"
                            }),
                            dropdownIndicator: (baseStyles, state) => ({
                                ...baseStyles,
                                color: "black"
                            }),
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: "black"
                            }),
                            multiValueRemove: (baseStyles, state) => ({
                                ...baseStyles,
                                color: "red",
                                backgroundColor: "beige"
                            })
                        }}
                    />
                </div>
                {formErrors.selectedChannels && <span className="error">{formErrors.selectedChannels}</span>}
                <br/>
                <div>
                    <input  style={{color: "white", fontWeight: "bold" }} type='file' onChange={(e) => {
                        setImage(e.target.files[0])
                    }} />
                </div>
                <br />
                <input type='submit' style={{ backgroundColor: "#cd7f32", color: "white", fontWeight: "bold", marginLeft: "60px" }} />
            </form>
        </div>
    )
}

export default AddPackage 