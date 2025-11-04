import React from 'react';
import { IoWallet } from "react-icons/io5";
const Subscription = () => {
  return (
    
     <div className="text-center">
                <div className="flex items-center justify-center space-x-3">
                  <IoWallet className="text-2xl text-gray-700" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">
                   Subscription
                  </h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                Welcome to the Subscription page.
                </p>
              </div>
  );
};

export default Subscription;
