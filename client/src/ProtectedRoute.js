import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setIsLoading(false);
            return;
        }

        // Verify token with backend
        axios.get('http://localhost:3001/verify-token', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            setIsVerified(true);
            setIsLoading(false);
        })
        .catch(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            setIsVerified(false);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isVerified) {
        return <Navigate to="/auth" />;
    }

    return children;
};

export default ProtectedRoute;
