import { cn } from '../../lib/utils';

interface SpinnerProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Spinner = ({ className, size = 'md' }: SpinnerProps) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-gray-200 border-t-emerald-600',
                sizes[size],
                className
            )}
        />
    );
};
