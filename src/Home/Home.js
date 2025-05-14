import Example from "./Homecaurosal"
import Footer from "./navbar/footer"
import HomeCards from "./cards/homecard"
import HD from "./HD"

export default function Home() {
    return (
        <div>
            <br/>
            <Example />
            <br />
            <br />
            <h2 className="text-center" style={{ color: '#001f3f' }}>Trending packages</h2>
            <br/>
            <HomeCards/><br/>
            <HD />
            <br/>
            
            <br/>
            <Footer/>
        </div>
    )
}