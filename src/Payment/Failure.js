import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../config/axios"

const Failure = ()=>{
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [isFailure, setIsFailure] = useState(false)

    useEffect(()=>{
        (async()=>{
            try{
                const stripId = localStorage.getItem("stripId")
                const {data} = await axios.delete(`/api/payment/${stripId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                setIsFailure(!isFailure)
                localStorage.removeItem('stripId')

                setTimeout(()=>{
                    navigate('/packcha')
                }, 5000)
            }catch(e){
                console.log(e)
            }
        })()
    }, [])

    return (
        <div>
            {isFailure && (
                <div className="d-flex justify-content-center mt-4">
                <h3>Transaction failed</h3>
                </div>
            )}
        </div>
    )
}
export default Failure