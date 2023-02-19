import "./App.css";
import { Home, Start, Upload, Generate, Commits, Verify } from "./pages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Template12 from "./pages/Template12";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/start" exact element={<Start />} />
          <Route path="/upload" exact element={<Upload />} />
          <Route path="/generate" exact element={<Generate />} />
          <Route path="/commits" exact element={<Commits />} />
          <Route path="/verify/:id" exact element={<Verify />} />
          <Route path="/temp" exact element={<Template12 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
