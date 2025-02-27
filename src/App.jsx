import './App.css'
import Navigation from './components/navigation'
import { BrowserRouter} from 'react-router-dom'

function App() {

  return (<>
        <BrowserRouter>
      <Navigation />
      {/* Other components */}
    </BrowserRouter>
        <h1>Moringa IMS</h1></>

  )
}

export default App
