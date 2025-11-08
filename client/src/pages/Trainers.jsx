import React from 'react';
import { IoAccessibility } from "react-icons/io5"; 
const Trainers= () => {
  return (
    
    <div className="text-center">
            <div className="flex items-center justify-center space-x-3">
              <IoAccessibility className="text-2xl text-gray-700" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">
               Trainers
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
             Welcome to the Trainers page.
            </p>
          </div>
  );
};

export default Trainers;