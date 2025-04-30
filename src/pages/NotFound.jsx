import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-300 flex flex-col justify-center items-center text-center px-6">
      <div className="animate-bounce text-7xl font-extrabold text-blue-700 mb-4">404</div>
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-600 text-base md:text-lg mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow transition duration-300"
      >
        Go Back to Dashboard
      </Link>
      <div className="mt-10 text-sm text-gray-500">
        If you believe this is a mistake, please contact support.
      </div>
    </div>
  );
};

export default NotFound;
