import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
    variant?: 'default' | 'glass' | 'outline';
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
        default: 'bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800',
        glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border border-white/20 dark:border-white/10',
        outline: 'bg-transparent border border-gray-200 dark:border-slate-700'
    };

    return (
        <motion.div
            ref={ref}
            className={cn(
                'rounded-2xl p-6 transition-all',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
});

Card.displayName = 'Card';

export { Card };
