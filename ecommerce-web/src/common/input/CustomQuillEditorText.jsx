import React, { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Hiển thị trình soạn thảo văn bản định dạng dùng chung.
const CustomQuillEditorText = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  className = "",
}) => {
  const quillRef = useRef(null);

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
        ["link"], // Đã loại bỏ "image"
        ["clean"],
      ],
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

export default CustomQuillEditorText;
