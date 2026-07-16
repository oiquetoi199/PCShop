import React, { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Hiển thị trình soạn thảo nội dung có hỗ trợ chèn hình ảnh.
const CustomQuillEditor = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onImageInsert,
  error,
  className = "",
}) => {

  const quillRef = useRef(null);
  
  // Chèn hình ảnh đã chọn vào vị trí hiện tại của trình soạn thảo.
  const handleImageInsert = async () => {
    if (onImageInsert) {
      const imageUrl = await onImageInsert();
      if (imageUrl) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", imageUrl);
      }
    }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ script: "sub" }, { script: "super" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        // Cấu hình trình xử lý chèn hình ảnh cho trình soạn thảo.
        image: () => handleImageInsert(),
      },
    },
  }), []);

  return (
    <div className="mb-2">
      {label && <label htmlFor={id} className="block text-gray-700 dark:text-white mb-2">{label}</label>}
      <ReactQuill
        ref={quillRef}
        id={id}
        value={value}
        onChange={(content) => onChange({ target: { name, value: content } })}
        modules={modules}
        theme="snow"
        placeholder={placeholder}
        className={`border p-2 w-full rounded ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default CustomQuillEditor;
