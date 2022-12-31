import { Link } from 'react-router-dom'

const CreateButtonDiv = () => {
  return (
        <div className="create-home-div">
            <h2>Create your own show here</h2>
            <button className="home-page-btn"><Link to='/createshow' className='home-page-link'>Create Show</Link></button>
            <p>Only need a venue, speaker/artist, some ticket artwork and some basic information and you can create your own NFT Ticket contract in minutes!</p>
      </div>  )
}

export default CreateButtonDiv