import React from 'react';
export default function SmallTable({ columns, rows }) {
return (
<div className="bg-white border rounded-lg overflow-hidden">
<table className="w-full text-sm">
<thead className="bg-slate-50 text-slate-600">
<tr>{columns.map((c) => (<th key={c} className="p-3 text-left">{c}</th>))}</tr>
</thead>
<tbody>
{rows.map((r, i) => (
<tr key={i} className="border-t hover:bg-slate-50">
{r.map((cell, j) => (<td key={j} className="p-3">{cell}</td>))}
</tr>
))}
</tbody>
</table>
</div>
);
}