import Register from "../../Register"
import UserList from "./userlist"
import { Row ,Col} from 'reactstrap'
//import './user.css'

const UserContainer = ({registerToast}) =>{
    return(
        <div>
        <Row>
        <Col md={5} className="middle">
        <Register registerToast={registerToast}/>
        </Col>
        <Col md={6}>
        <UserList />
        </Col>
        </Row>
        </div>
        
    )
}
export default UserContainer