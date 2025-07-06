
"use client";

import { useContext } from 'react';
import { UserDataContext, type UserDataContextType } from '@/context/UserDataContext';

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};
