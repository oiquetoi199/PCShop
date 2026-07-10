import Signin from "./Signin";
import Login from "./Login";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const LoginPopup = ({ loginPopup, handleLoginPopup, onLoginSuccess }) => {
    const [showSignIn, setShowSignIn] = useState(false);
    const loginPopupRef = useRef();

    const handleSignIn = () => {
        setShowSignIn(!showSignIn);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (loginPopupRef.current && e.target === loginPopupRef.current) {
                handleLoginPopup(false);
            }
        };

        window.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [handleLoginPopup]);

    return (
        <>
            {loginPopup && (
                <div
                    ref={loginPopupRef}
                    className="fixed top-0 left-0 w-full h-full z-50 overflow-y-auto bg-black bg-opacity-50"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-2xl bg-gray-400 backdrop-blur-md shadow-custom-inset sm:w-[600px] md:w-[380px]"
                        >
                            {showSignIn ? (
                                <Signin handleSignIn={handleSignIn} />
                            ) : (
                                <Login handleSignIn={handleSignIn} onLoginSuccess={onLoginSuccess} />
                            )}
                        </motion.div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginPopup;