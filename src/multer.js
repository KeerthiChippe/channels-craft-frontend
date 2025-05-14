import axios from "./config/axios"
import { useState } from "react"
import _ from "lodash"

const Image = () => {
    const [data, setData] = useState({})
    const [image, setImage] = useState(null)

    // console.log(image, "image")
    const upload = (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('file', image)

        if (image) {
            axios.post('/api/upload', formData)
                .then(res => {
                    console.log(res.data, "img result")
                    setData(res.data)
                })
                .catch(err => console.log(err))
        }
    }
    // console.log(data)
    // useEffect(()=>{    
    //     axios.get('/api/getimage')
    //     .then(res => {
    //         console.log(res.data)
    //         setData(res.data)
    //     })
    //     .catch(err => console.log(err))
    // },[])

    return (
        <div>
            <form onSubmit={upload}>
                <input type='file' onChange={(e) => {
                    setImage(e.target.files[0])
                }} />

                <input type="submit" value="Upload" />
            </form>

            {!_.isEmpty(data) &&
                <img
                    src={`http://localhost:3034/Images/${data.image}`} alt='image'
                />}

        </div>
    )
}

export default Image