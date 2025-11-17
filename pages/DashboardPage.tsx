import React from "react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, setCurrentPage }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300
          z-[50]
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full 
          bg-black/90 backdrop-blur-xl border-r border-white/10
          transition-transform duration-300 z-[60]
          w-[85%] max-w-xs   /* Mobile width */
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          md:static md:translate-x-0 md:w-64 md:bg-black/80
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">My Dashboard</h2>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white text-2xl"
          >
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col px-6 py-5 text-white space-y-4 text-base">
          <button
            onClick={() => { setCurrentPage("Investments"); setIsOpen(false); }}
            className="hover:text-byd-red transition-colors text-left"
          >
            Investments
          </button>

          <button
            onClick={() => { setCurrentPage("Purchases"); setIsOpen(false); }}
            className="hover:text-byd-red transition-colors text-left"
          >
            Purchases
          </button>

          <button
            onClick={() => { setCurrentPage("DepositFunds"); setIsOpen(false); }}
            className="hover:text-byd-red transition-colors text-left"
          >
            Deposit Funds
          </button>

          <button
            onClick={() => { setCurrentPage("Home"); setIsOpen(false); }}
            className="hover:text-byd-red transition-colors text-left"
          >
            Back to Home
          </button>
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="
          fixed top-5 left-4 z-[70] md:hidden 
          text-white bg-byd-red p-3 rounded-full shadow-lg
        "
        onClick={() => setIsOpen(true)}
      >
        <ion-icon name="menu-outline" class="text-2xl"></ion-icon>
      </button>
    </>
  );
};

export default Sidebar;
