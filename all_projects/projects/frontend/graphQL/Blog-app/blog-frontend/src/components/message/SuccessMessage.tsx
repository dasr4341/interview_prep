import React from 'react';

export default function SuccessMessage({ message, className }: { message: string, className?: string }) {
    return (
        <div className={`bg-slate-800 text-green-600 text-sm p-2 rounded capitalize ${className}`}>{message}</div>
    );
}
