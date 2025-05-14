import { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { Carousel } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import './homecard.css'

const HomeCards = () => {

  const [trendingPackages, setTrendingPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch trending packages data from backend API
    const fetchTrendingPackages = async () => {
      try {
        const response = await axios.get('/api/trendingPackages');
        setTrendingPackages(response.data);
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching trending packages:', error);
        setIsLoading(false)
      }
    };

    fetchTrendingPackages();
  }, []);


  return (
  //   <Carousel id="carouselExampleControls" className="width">
  //   {trendingPackages.map((ele, index) => (
  //     <Carousel.Item key={index}>
  //       <div className="card-wrapper container-fluid d-flex justify-content-around">
  //         <div className="card" style={{ width: '18rem', height: '50vh' }}>
  //           <img src={`http://localhost:3034/Images/${ele.image}`} className="card-img-top" alt={ele.packageName} />
  //         </div>
  //       </div>
  //     </Carousel.Item>
  //   ))}
  // </Carousel>
  <div>
  {!isLoading ? (
    <Carousel id="carouselExampleControls" className="width">
    <Carousel.Item>
      <div className="card-wrapper container-fluid d-flex justify-content-around">
        {trendingPackages.slice(0, 3).map((ele, index) => (
          <div className="card" key={index} style={{ width: '18rem', height: '20rem' }}>
            <img src={`http://localhost:3034/Images/${ele.image}`} className="card-img-top" alt={ele.packageName} style={{ width: '100%', height: '80%' }}/>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h4 className="card-title">{ele.packageName}</h4>
            </div>
          </div>
        ))}
      </div>
    </Carousel.Item>
    <Carousel.Item>
      <div className="card-wrapper container-fluid d-flex justify-content-around">
        {trendingPackages.slice(3).map((ele, index) => (
          <div className="card" key={index} style={{ width: '18rem', height: '20rem' }}>
            <img src={`http://localhost:3034/Images/${ele.image}`} className="card-img-top" alt={ele.packageName} style={{ width: '100%', height: '80%' }}/>
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h4 className="card-title">{ele.packageName}</h4>
            </div>
          </div>
        ))}
      </div>
    </Carousel.Item>
  </Carousel>

  ) : (
    <div style={{ height: "59vh" }} className="d-flex justify-content-center align-items-center">
    <ClipLoader
        color={"#7aa9ab"}
        isLoading={isLoading}
        size={30}
    />
</div>
  )}
    </div>
  
  
  );
};

export default HomeCards
