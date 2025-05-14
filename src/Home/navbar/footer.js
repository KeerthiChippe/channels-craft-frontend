import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Instagram, Twitter, Facebook, Whatsapp } from 'react-bootstrap-icons';
import './footer.css'

const Footer = () => {
  return (
    <div className="container">
      <footer className="row row-cols-1 row-cols-md-3 py-1 my-1 border-top">
       

        <div className="col mb-3">
          <h5>Company Details</h5>
          <ul className="nav flex-column">
            <p className="text-body-secondary">Email- ChannelCraft@gmail.com </p>
            <p className="text-body-secondary">Address- <span>ChannelCraft,</span><br/>
            <span style={{ margin: '70px' }}>Dct Academy,</span><br />
            <span style={{ margin: '70px' }}>Basavanagudi,</span><br />
            <span style={{ margin: '70px' }}>Bangalore,</span><br />
            <span style={{ margin: '70px' }}>karnataka,</span><br />
            <span style={{ margin: '70px' }}>575001.</span><br />
           </p>
          </ul>
        </div>

        <div className="col mb-3">
          <h5>Section</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2"><Link to="/" className="nav-link p-0 text-body-secondary">Home</Link></li>
            <li className="nav-item mb-2"><Link to="/packcha" className="nav-link p-0 text-body-secondary">Packages</Link></li>
            <li className="nav-item mb-2"><Link to="/packcha" className="nav-link p-0 text-body-secondary">Channels</Link></li>
        </ul>
        </div>
        <div className="col mb-3">
          <p className="text-body-secondary">Follow Us On</p>
          {/* <Link to="/" className="d-flex align-items-center mb-3 link-body-emphasis text-decoration-none">
            <svg className="bi me-2" width="45" height="36"><use xlinkHref="#bootstrap"></use></svg>
          </Link> */}
          <Link to="#" className="text-body-secondary">
            <Instagram color="red" size={28} />
          </Link>
          <Link to="#" className="text-body-secondary">
            <Twitter color="blue" size={28} />
          </Link>
          <Link to="#" className="text-body-secondary">
            <Facebook color="blue" size={28} />
          </Link>
          <Link to="#" className="text-body-secondary">
            <Whatsapp color="green" size={28} />
          </Link>
          <br/>
          <p className="text-body-secondary">© 2024 Company, Inc. All rights reserved.</p>
          <p>
      Image by{" "}
      <Link to="https://www.freepik.com/free-photo/man-watching-show-his-tv_16625367.htm#query=cable%20tv&position=32&from_view=keyword&track=ais&uuid=3ae57a9c-d001-412d-b5d1-da454bdccb8b">
        Freepik
      </Link>
    </p>
        </div>
      </footer>
    </div>
  )
}
export default Footer;

