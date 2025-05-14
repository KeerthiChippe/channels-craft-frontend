import { Row, Col } from "reactstrap"
import './HD.css'

export default function HD() {
  return (
    <div className="text-center ">
      <Row className="dth">
        <h1 style={{ color: 'red' }}>DTH HD CONNECTION</h1>
        <blockquote className="blockquote mb-4">
          <p style={{ color: '#001f3f' }}>
            Enjoy TV in HD like never before. <br />
            TV viewing in High Definition (HD) is much better than Standard Definition (SD). <br />
            Sun Direct HD is built with HEVC technology and digital Dolby Surround system. <br />
            It provides 1080i picture resolution and 16:9 wide aspect ratio.
          </p>
        </blockquote>

      </Row>
      <br />
      <br />
      <br />

      <Row className="dth">
        <Col md={6}>
          <img
            src={'./tv1.jpg'}
            alt="tv"
            style={{ width: '80%', height: "300px" }}
          />
        </Col>

        <Col md={6}>
          <img
            src={'./free30.jpg'}
            alt="tv"
            style={{ width: '80%', height: "300px" }}
          />
        </Col>
      </Row>

    </div>
  )
}
