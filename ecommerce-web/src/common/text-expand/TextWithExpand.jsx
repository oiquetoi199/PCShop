import { useState } from "react";

// Hiển thị văn bản rút gọn và cho phép mở rộng nội dung.
const TextWithExpand = ({ text, maxLength = 60 }) => {
    if (!text) return;
    const [isExpanded, setIsExpanded] = useState(false);

    // Mở rộng hoặc thu gọn phần nội dung đang hiển thị.
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