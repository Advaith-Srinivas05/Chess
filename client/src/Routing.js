import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage.js';
import ProtectedRoute from './ProtectedRoute.js';
import Sidebar from './sidebar.js';
import Home from './pages/home.js';
import Play from './pages/play.js'
import PlayVsStockfish from './bots/playComputer.js'
import Practice from './pages/practice.js'
import Analysis from './pages/analysis.js'
import Leaderboard from './pages/leaderboard.js';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/auth" />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/home" element={<ProtectedRoute><Sidebar/><Home/></ProtectedRoute>}/>
                <Route path="/play" element={<ProtectedRoute><Sidebar/><Play/></ProtectedRoute>}/>
                <Route path="/bots" element={<ProtectedRoute><Sidebar/><PlayVsStockfish/></ProtectedRoute>}/>
                <Route path="/practice" element={<ProtectedRoute><Sidebar/><Practice/></ProtectedRoute>}/>
                <Route path="/analysis" element={<ProtectedRoute><Sidebar/><Analysis/></ProtectedRoute>}/>
                <Route path="/leaderboard" element={<ProtectedRoute><Sidebar/><Leaderboard/></ProtectedRoute>}/>
                <Route path="/learn" element={<ProtectedRoute><Sidebar/></ProtectedRoute>}/>
                <Route path="/social" element={<ProtectedRoute><Sidebar/></ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
