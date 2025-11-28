import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import FormBuilder from "./pages/FormBuilder";
import FormViewer from "./pages/FormViewer";
import Responses from "./pages/Responses";
import FormPreview from "./pages/FormPreview";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/">Home</Link> | <Link to="/builder">Form Builder</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/builder" element={<FormBuilder />} />
        <Route path="/form/:formId" element={<FormViewer />} />
        <Route path="/forms/:formId/responses" element={<Responses />} />
        <Route path="/preview/:formId" element={<FormPreview />} />
      </Routes>
    </div>
  );
}

export default App;
