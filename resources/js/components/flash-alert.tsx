import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils'; // optional
import { CheckCircleIcon, CircleXIcon } from 'lucide-react';
import React from 'react';

interface FlashAlertProps {
    message: string;
    variant?: 'default' | 'destructive';
    duration?: number; // dalam ms
}

export const FlashAlert: React.FC<FlashAlertProps> = ({ message, variant = 'default', duration = 3000 }) => {
    const [visible, setVisible] = React.useState(true);
    const [shouldRender, setShouldRender] = React.useState(true);

    React.useEffect(() => {
        const hideTimeout = setTimeout(() => {
            setVisible(false);
        }, duration);

        const removeTimeout = setTimeout(() => {
            setShouldRender(false);
        }, duration + 700);

        return () => {
            clearTimeout(hideTimeout);
            clearTimeout(removeTimeout);
        };
    }, [duration]);

    if (!shouldRender) return null;

    return (
        <div className={cn('fixed right-6 bottom-6 z-[9999] transition-opacity duration-700 ease-in-out', visible ? 'opacity-100' : 'opacity-0')}>
            <Alert variant={variant}>
                {variant === 'destructive' ? <CircleXIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                <AlertTitle>{variant === 'destructive' ? 'Error' : 'Berhasil!'}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        </div>
    );
};
