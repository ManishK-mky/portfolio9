import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AiChat from "./pages/AIChat";
import ThemeSwitcher from "./components/ThemeSwitcher";
import TopRightDropdown from "./components/RightMenu";

function App() {
  return (
    <Router>
      <ThemeSwitcher />
      <TopRightDropdown />
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/study-materials" element={<div>Chat With AI Page</div>} />
        <Route path="/chat-ai" element={<AiChat/>} />
        <Route path="/random" element={<div>Random Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
