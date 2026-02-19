import { motion } from 'framer-motion';

const PlaceholderPage = ({ title }: { title: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
            <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-500 max-w-md">
                This feature is currently under development. Please check back later.
            </p>
        </motion.div>
    );
};

export default PlaceholderPage;
