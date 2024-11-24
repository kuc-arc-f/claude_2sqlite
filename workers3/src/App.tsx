import { Routes, Route } from 'react-router-dom';

//
import Home from './client/home';
import Workers1 from './client/workers1';
import Workers2 from './client/workers2';
import Workers3 from './client/workers3';
//
export default function App(){
    return(
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workers1" element={<Workers1 />} />
        <Route path="/workers2" element={<Workers2 />} />
        <Route path="/workers3" element={<Workers3 />} />
      </Routes>
    </div>
    )
}
