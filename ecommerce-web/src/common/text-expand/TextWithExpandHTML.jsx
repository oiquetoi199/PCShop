import { useState } from "react";

const TextWithExpandHTML = ({ text, maxLength = 200 }) => {
    if (!text) return null;
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <span className="ql-editor">
            <span dangerouslySetInnerHTML={{ __html: isExpanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "") }} />
            {text.length > maxLength && (
                <button onClick={toggleExpand} className="text-blue-500 hover:underline ml-2">
                    {isExpanded ? "Ẩn bớt" : "Xem thêm"}
                </button>
            )}
        </span>
    );
};

export default TextWithExpandHTML;
