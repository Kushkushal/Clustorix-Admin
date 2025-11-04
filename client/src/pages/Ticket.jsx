import React from 'react';
import { ImTicket } from "react-icons/im";
const Ticket = () => {
  return (

    <div className="text-center">
      <div className="flex items-center justify-center space-x-3">
        <ImTicket className="text-2xl text-gray-700" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">
          Ticket
        </h1>
      </div>
      <p className="text-gray-600 text-sm sm:text-base">
        Welcome to the Ticket page.
      </p>
    </div>
  );
};

export default Ticket;
