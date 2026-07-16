// Định dạng ngày và giờ sang chuỗi hiển thị dễ đọc.
export const formatDateTime = (date) => {
    if (!date) {
        return '';
    }
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('vi-VN', options);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const formattedTime = new Date(date).toLocaleTimeString('vi-VN', timeOptions);

    return `${formattedDate} ${formattedTime}`;
};

// Định dạng giá trị ngày sang chuỗi hiển thị dễ đọc.
export const formatDate = (date) => {
    if (!date) {
        return '';
    }
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('vi-VN', options);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

    return `${formattedDate}`;
};