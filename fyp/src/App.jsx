import Login from "./component/Login.jsx";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./component/Layout.jsx";
import CreateClass from "./component/CreateClass.jsx";
import AllClass from "./component/TeacherClasses.jsx";
import SingleClass from "./component/SingleClass.jsx";
import DetectionViewer from "./component/Detection.jsx";
import Stats from "./component/Stats.jsx";
import StatsInformation from "./component/StatsInformation.jsx";
import LandingPage from "./component/Landingpage.jsx";
import Dashboard from "./component/Dashboard.jsx";
import Information from "./component/Information.jsx";
import SessionLog from "./component/SessionLog.jsx";
import SessionStart from "./component/SessionStart.jsx";
import UploadVideo from "./component/UploadVideo.jsx"

function App() {
    return(
    <Router>
        <Layout>
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/login" element={<Login />} />
            {/*<Route Path="/dashboard" element={<Dashboard />} />*/}
            <Route path="/classes/create" element={<CreateClass />} />
            <Route path="/stats" element={<Information />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/classes" element={<AllClass/>} />
            <Route path="/classes/:id" element={<SingleClass/>} />
            <Route path="/session-logs" element={<SessionLog />} />
            <Route path="/start-session" element={<SessionStart />} />
            <Route path="/class/:session_id/detect" element={<DetectionViewer />} />
            <Route path="/stats/:classid/sessions" element={<Stats />} />
            <Route path="/session/:sessionid" element={<StatsInformation/>} />
            <Route path="/class/:session_id/uploadVideo" element={<UploadVideo />} />
        </Routes>
        </Layout>
    </Router>
    )
}

export default App
