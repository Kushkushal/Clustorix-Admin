import React from 'react';
import { IoIosSettings } from "react-icons/io";

const Settings = () => {
  return (


    <div className="text-center">
      <div className="flex items-center justify-center space-x-3">
        <IoIosSettings className="text-2xl text-gray-700" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">
          Settings
        </h1>
      </div>
      <p className="text-gray-600 text-sm sm:text-base">
        Welcome to the Settings page.
      </p>
    </div>
  );
};

export default Settings;
