import { useSelector } from "react-redux";
import ListPackages from "./ListPackages";
import ChannelsList from "../channels/ChannelsList";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Row ,Col } from "reactstrap"
import { useState } from "react";

const PackagesContainer = ()=>{
    const packages = useSelector((state)=>{
        return state.packages
    })

    return(
        <div>
            <Row>
                <Col md={6}> 
           <ListPackages/>
           </Col>
        <Col md={6}>
           <ChannelsList/>
           </Col>
           </Row>
        </div>
    )
}

export default PackagesContainer