import { useState, useEffect } from "react"
import { FadeLoader } from "react-spinners"
import axios from "../config/axios"
import { useNavigate } from "react-router-dom"

export default function Success(){
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(()=>{
        (async()=>{
            try{
                const stripId = localStorage.getItem("stripId")
                console.log(stripId, "stripId")
                const {data} = await axios.put(`/api/payment/${stripId}`, {}, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                setIsSuccess(!isSuccess)
                localStorage.removeItem("stripId")

                setTimeout(()=>{
                    navigate('/customerProfile', {state: data})
                }, 5000)
            }catch(e){
                console.log(e)
            }

        })()

    }, [])
    return(
        <div>
            {isSuccess ? (
                <>
                    <div className="d-flex justify-content-center mt-4">
                <h3>Payment is successfull</h3>
                </div>

                <div className="d-flex justify-content-center m-4">
                    <b>Please don't click anything & stay on the page.......</b>
                </div>
                </>
            ) : (
                <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
                <FadeLoader
                    color={"#7aa9ab"}
                    loading={loading}
                    size={30}
                />
            </div>
            )}
        </div>
    )
}