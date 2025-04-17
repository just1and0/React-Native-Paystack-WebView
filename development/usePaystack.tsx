import { useContext } from "react";
import { PaystackContext } from './PaystackProvider';

export const usePaystack = () => {
    const context = useContext(PaystackContext);
    if (!context) throw new Error('usePaystack must be used within a PaystackProvider');
    return context;
};