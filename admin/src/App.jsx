import { useState } from "react";
import "./App.css";
import Approutes from "./routes/Approutes";
import {ToastContainer} from 'react-toastify'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <ToastContainer/>
          <Approutes />
      </div>
    </>
  );
}

export default App;
