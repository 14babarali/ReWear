import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Simulate fetching user data (or get from localStorage)
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser || null);
    }, []);

    return { user };
};
