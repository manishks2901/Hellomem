

import { Home, Shirt, Store, HelpCircle, User } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md md:hidden">
      <ul className="flex justify-between items-center px-4 py-2 text-xs text-gray-600">
        <li className="flex flex-col items-center text-purple-700">
          <Home size={24} />
          <span className="text-xs">Home</span>
        </li>
        <li className="flex flex-col items-center">
          <Shirt size={24} />
          <span className="text-xs">Categories</span>
        </li>
        <li className="flex flex-col items-center">
          <Store size={24} />
          <span className="text-xs">Mall</span>
        </li>
        <li className="flex flex-col items-center">
          <HelpCircle size={24} />
          <span className="text-xs">Help</span>
        </li>
        <li
            className="flex flex-col items-center cursor-pointer"
            onClick={() => window.location.href = "/login"}
        >
            <User size={24} />
            <span className="text-xs">Account</span>
        </li>  </ul>
    </nav>
  );
}
