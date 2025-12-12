import React from 'react';
import { NavLink } from 'react-router-dom';
export default function NavItem({ to, label }) {
return (
<NavLink
to={to}
className={({ isActive }) => `block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 ${isActive ? 'bg-sky-50 border-l-4 border-sky-500' : ''}`}
end
>
{label}
</NavLink>
);
}