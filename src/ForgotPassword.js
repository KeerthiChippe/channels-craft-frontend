import *as yup from 'yup'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import axios from './config/axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css'


const loginValidationSchema = yup.object({
    email: yup.string().email('invalid email format').required("email is required")
})

export default function ForgotPassword() {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
           email: ''
        },
        validationSchema: loginValidationSchema,
        validateOnChange: false,
        onSubmit: async (values) => {
            try {
                const formData = { email: values.email }
                console.log(formData)
                const response = await axios.post('/api/forgot-password', formData)
                console.log(response)
                console.log(response.data)
                const userData = response.data
                // console.log(userData.role, "check")
                localStorage.setItem('token', userData.token)
                alert('link has sent to email')
                navigate('/login')
            } catch (e) {
                console.log(e)
            }
        }
    })
    return (
        <div className="wrapper d-flex bg-light align-items-center justify-content-center w-100" >
            <div className='login rounded'>
                <h2 className='mb-3'>Forgot Password</h2>
                <form className='form-validation' onSubmit={formik.handleSubmit}>
                    <div className='form-group mb-2'>
                        <label htmlFor='email' className='form-label'>email</label>
                        <input type="text"
                            className={`form-control ${formik.touched.mobile && formik.errors.mobile ? 'is-invalid' : ''}`} 
                            //className='form-control' 
                            value={formik.values.email}
                            name="email"
                            onChange={formik.handleChange} /><br />
                        
                        <div className='invalid-feedback'>
                        {formik.errors.email}
                        </div>
                        <br />
                    </div>

                    <button type="submit" className='btn btn-success block mt-2' value={'login'} >
                        send
                    </button>

                </form>
            </div>
        </div>
    )
}