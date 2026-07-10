import { useState } from "react";

const TextWithExpand = ({ text, maxLength = 60 }) => {
    if (!text) return;
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (text.length <= maxLength) {
        return <span>{text}</span>;
    }

    return (
        <span>
            {isExpanded ? text : `${text.substring(0, maxLength)}... `}
            <button onClick={toggleExpand} className="text-blue-500 hover:underline">
                {isExpanded ? 'Ẩn bớt' : 'Xem thêm'}
            </button>
        </span>
    );
};

export default TextWithExpand;