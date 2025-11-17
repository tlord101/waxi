import React from 'react';

const SidebarToggleButton: React.FC = () => {
  const handleClick = () => {
    // Dispatch a global event that dashboard sidebar can listen for
    window.dispatchEvent(new CustomEvent('toggle-dashboard-sidebar'));
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
