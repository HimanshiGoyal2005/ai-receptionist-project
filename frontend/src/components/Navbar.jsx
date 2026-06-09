function Navbar({ title }) {
  return (
    <div className="h-16 bg-[#080B11]/70 backdrop-blur-md border-b border-gray-800/60 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10 transition-all">
      {/* Title with metallic fluid gradient look */}
      <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        {title}
      </h2>

      {/* Profile Section */}
      <div className="flex items-center gap-3 bg-[#0F1420]/50 border border-gray-800/60 px-3 py-1.5 rounded-xl">
        <span className="text-xs font-medium text-gray-400 tracking-wide">
          Himanshi
        </span>
        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]">
          H
        </div>
      </div>
    </div>
  );
}

export default Navbar;
