import React from 'react';

export default function ErrorMessage({ message, className }: { message: string, className?: string }) {
    return (
        <div className={`bg-slate-800 text-red-400 text-sm p-2 rounded capitalize ${className}`}>{message}</div>
    );
}
