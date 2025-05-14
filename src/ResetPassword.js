import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "./config/axios"

export default function ResetPassword({resetPassword}){
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const {id, token} = useParams()
    // console.log(id. token)

    
    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            const formData = {password}
            const response = await axios.post(`/api/reset-password/${id}/${token}`, formData)
            console.log(response.data)
            navigate('/')
            resetPassword()
        }catch(e){
            console.log(e)
        }
    }
    return(
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="password">New Password</label>
                <input type="password" value={password} id="password" onChange={(e)=>{setPassword(e.target.value)}} />

                <input type='submit' value='update' />
            </form>
        </div>
    )
}