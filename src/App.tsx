import { BrowserRouter } from 'react-router-dom'
import RenderRouter from './routers'

function App() {
  return (
    <BrowserRouter basename='admin'>
      <RenderRouter />
    </BrowserRouter>
  )
}

export default App