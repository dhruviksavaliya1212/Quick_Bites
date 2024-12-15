import { useState } from "react";
import "./App.css";
import Approutes from "./routes/Approutes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Router>
          <Approutes />
        </Router>
      </div>
    </>
  );
}

export default App;
