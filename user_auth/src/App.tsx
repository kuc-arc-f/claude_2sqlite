import { Routes, Route } from 'react-router-dom';

//
import Home from './client/home';
import Login from './client/login';
import UserRegister from './client/UserRegister';
//
export default function App(){
    return(
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user_register" element={<UserRegister />} />
      </Routes>
    </div>
    )
}
