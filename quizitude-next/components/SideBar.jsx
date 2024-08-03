// app/components/Sidebar.js
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;