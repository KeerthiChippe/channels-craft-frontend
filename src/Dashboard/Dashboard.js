// import CustomersOrders from "./customersData"
import OrdersDashboard from "./OrdersDashboard"
import UsersDashboard from "./usersDashboard"
import { Row , Col} from "reactstrap"
import { Chart } from "chart.js/auto";

const AdminDashboard = ()=>{
    return(
        <div>
            {/* <Row className="row">
            <Col md={5}> */}
            {/* <CustomersOrders /> */}
            <UsersDashboard />
            {/* </Col>
            <Col md={7}  >
             */}
            <OrdersDashboard />
            {/* </Col>
            
            </Row> */}
        </div>
    )

}
export default AdminDashboard