import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaFacebookMessenger } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const FloatingContact = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [company, setCompany] = useState(null);
    useEffect(() => {
        const fetchInfor= async () => {
          const response = await fetch(`${apiUrl}/company/guest/company-info`);
          const data = await response.json();
          setCompany(data);
        };
    
        fetchInfor();
    }, [apiUrl]);

    const formatPhoneNumber = (phone) => {
        if (!phone) return "";
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
    };

  return (
    <>
      <div className="fixed bottom-6 left-3 flex flex-col z-50">
        <div className="bg-white text-red-600 px-4 py-2 md:px-6 md:py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 flex items-center">
          <div className="relative flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-red-600 text-white rounded-full">
            <span className="absolute inset-0 bg-red-500 opacity-50 rounded-full animate-ping"></span>
            <FaPhoneAlt className="text-xs md:text-lg relative z-10" />
          </div>
          <div className="ml-2 flex flex-col">
            {company?.phones?.map((phone, index) => (
              <Link
                key={phone.id}
                to={`tel:${phone.phone}`}
                className="text-xs md:text-base font-semibold hover:underline"
              >
                {formatPhoneNumber(phone.phone)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-3 flex flex-col items-end space-y-2 z-50">
        {/* Messenger https://m.me/yourpageid */}
        <Link
          to={company?.linkMess}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          <FaFacebookMessenger className="text-xs md:text-lg" />
        </Link>

        {/* Zalo https://zalo.me/yourzaloid*/}
        <Link
          to={company?.linkZalo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-white border border-gray-300 text-blue-500 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
        >
          <SiZalo className="text-xs md:text-lg" />
        </Link>
      </div>
    </>
  );
};

export default FloatingContact;
