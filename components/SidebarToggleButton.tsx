import React from 'react';

interface Props {
  setCurrentPage: (page: string) => void;
}

const SidebarToggleButton: React.FC<Props> = ({ setCurrentPage }) => {
  const handleClick = () => {
    // Navigate to Dashboard first so the sidebar component mounts
    setCurrentPage('Dashboard');
    // Give React a tick to mount Dashboard, then open the sidebar
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-dashboard-sidebar'));
    }, 120);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Open menu"
      className="fixed top-4 left-4 z-50 md:hidden bg-byd-red text-white p-3 rounded-full hover:bg-byd-red-dark transition-colors shadow-lg"
    >
      {/* three-line white hamburger */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
        <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
};

export default SidebarToggleButton;
