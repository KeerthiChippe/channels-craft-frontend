import AddCustomer from './AddCustomer'
import CustomerList from './listCustomers'
import { Row ,Col} from 'reactstrap'
import './customer.css'

const CustomerContainer = () =>{

    return(
        <div className=" d-flex justify-content-center adding">
       <Row>
         <Col md={5}>
        <AddCustomer />
         </Col>
       
       <Col md={7}>
        <CustomerList/>
        </Col>
        </Row>
        </div>
    )
}
export default CustomerContainer