import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { useAuthActions } from '../hooks/use-auth';

interface LogoutButtonProps {
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ className, variant = "outline" }) => {
    const { logout } = useAuthActions();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Hapus token & user dari state
        navigate('/login'); // Redirect ke halaman login
    };

    return (
        <Button
            variant={variant}
            onClick={handleLogout}
            className={className}
        >
            Log Out
        </Button>
    );
};
