import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { StartGetCustomer } from "../../actions/customer-action"
import { startGetPackage } from "../../actions/package-action"
import { startGetChannel } from "../../actions/channel-action"
import { startCreateOrder } from "../../actions/order-action"
import './createOrder.css'

const CreateOrder = ()=>{
    const dispatch = useDispatch()
    const [selectCustomer, setSelectCustomer] = useState('')
    const [selectPackage, setSelectPackage] = useState('')
    const [selectChannel, setSelectChannel] = useState('')

    const customers = useSelector((state)=>{
        return state.customer.data
    })

    const packages = useSelector((state)=>{
        return state.package.data
    })

    const channels = useSelector((state)=>{
        return state.channel.data
    })

    useEffect(()=>{
        dispatch(StartGetCustomer())
        dispatch(startGetPackage())
        dispatch(startGetChannel())
    }, [dispatch])

    const handleChange = (e) => { 
        let customer = e.target.value
        setSelectCustomer(customer)
    }

    const handleOrder = ()=>{
      const selectedCustomer = customers.find(customer => customer._id === selectCustomer)
      const selectedPackage = packages.find(pkg => pkg._id === selectPackage)
      const selectedChannel = channels.find(channel => channel._id === selectChannel)
        const formData = {
            packages: [selectedPackage],
            channels: [selectedChannel],
            customers: selectedCustomer
        }
        dispatch(startCreateOrder(formData))
    }

    return(
        <div className = "order" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
            <form>
            <label className="dropdown">Select Customer</label>
                <br />
                <select  className="dropdown" value={selectCustomer} onChange={handleChange}>
                <option className="dropdown" value="" >Select a customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer._id}>
                    {customer.customerName}
                  </option>
                ))}
              </select><br/>
              <br/>
              <label className="dropdown">Select Package</label>
                <br />
                <select className="dropdown" value={selectPackage} onChange={(e)=>{
                    setSelectPackage(e.target.value)
                }}>
                <option className="dropdown" value="" >Select a package...</option>
                {packages.map((ele) => (
                  <option key={ele.id} value={ele._id}>
                    {ele.packageName}-{ele.packagePrice}
                  </option>
                ))}
              </select><br/>
              <br/>
              <label className="dropdown">Select Channels</label>
                <br />
                <select className="dropdown" value={selectChannel} onChange={(e)=>{
                    setSelectChannel(e.target.value)
                }}>
                <option className="dropdown" value="" >Select a channel...</option>
                {channels.map((ele) => (
                  <option key={ele.id} value={ele._id}>
                    {ele.channelName}
                  </option>
                ))}
              </select><br/>
              <br/>
              <br/>
                   <button className="dropdown" onClick={handleOrder}>order</button>
            </form>
         
        </div>
    )
}

export default CreateOrder