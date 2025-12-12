import React from 'react';
export default function StatCard({ title, value, hint }) {
return (
<div className="bg-white p-4 rounded-lg shadow-sm border">
<div className="text-sm text-slate-500">{title}</div>
<div className="text-2xl font-bold mt-2">{value}</div>
{hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
</div>
);
}