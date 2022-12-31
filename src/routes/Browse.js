import ViewShows from "../components/ViewShows"
import CreateButtonDiv from "../components/CreateButtonDiv"

const Browse = () => {
  return (
    <div className="create-show-div create-container">
      <h1>Browse</h1>
      <ViewShows />
      <CreateButtonDiv />
    </div>
  )
}

export default Browse