import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import Subjects from "./pages/Subjects";
import Questions from "./pages/Questions";
function App() {
    return (
        <div>
             <BrowserRouter>
                 <Routes>
                  <Route path='/' element={<Login/>} />
                  <Route path='/login' element={<Login/>} />
                  <Route path='/subjects' element={<Subjects/>} />
                  <Route path='/questions/:id' element={<Questions/>} />
                  <Route path='/*' element={<Login/>} />
                 </Routes>
                 </BrowserRouter>
        </div>
    )
}

export default App;