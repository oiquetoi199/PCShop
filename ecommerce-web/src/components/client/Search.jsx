import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

// Hiển thị ô tìm kiếm và điều hướng đến danh sách kết quả.
const Search = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({ keyword: "", categoryId: "all" });
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { categoryId, keyword } = location.state || {};

  useEffect(() => {
    if (keyword) {
      setFormData({
        categoryId, keyword
      })
    }

    // Gọi API để tải danh sách danh mục và cập nhật dữ liệu lựa chọn.
    const fetchCategories = async () => {
      const response = await fetch(`${apiUrl}/category/guest/find-child`);
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // Xử lý từ khóa tìm kiếm và tải hoặc điều hướng đến kết quả phù hợp.
  const handleSearch = async () => {
    navigate('/category-group/search', {
      state: {
        categoryId: formData.categoryId,
        keyword: formData.keyword,
        action: "search",
        statusClick: Date.now()
      },
    });
    setIsOpen(false);
  };

  // Cập nhật state khi giá trị của trường nhập liệu thay đổi.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý phím được nhấn để hỗ trợ thao tác bàn phím.
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <div className="sm:hidden fixed top-4 right-20 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-blue-600 text-white rounded-full"
        >
          {isOpen ? <FaTimes size={18} /> : <FaSearch size={18} />}
        </button>
      </div>

      <div className="hidden sm:block fixed top-16 left-0 right-0 z-40 bg-white shadow-md">
        <div className="w-full flex justify-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 w-full max-w-4xl">
            <input
              id="keyword"
              name="keyword"
              type="text"
              value={formData.keyword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập từ khóa..."
              className="flex-1 bg-transparent text-gray-900 px-3 py-2 text-base focus:outline-none border border-gray-200 rounded-md w-full"
            />

            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full sm:w-40 border border-gray-300 bg-gray-50 text-gray-700 px-2 py-2 rounded-md text-base focus:outline-none"
            >
              {/* <option key="all" value="all">
                Tất cả
              </option> */}
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition text-base w-full sm:w-auto"
            >
              <FaSearch size={16} />
              <span>Tìm</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 z-40 bg-white shadow-md p-3">
          <div className="flex flex-col gap-2">
            <input
              id="keyword"
              name="keyword"
              type="text"
              value={formData.keyword}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập từ khóa..."
              className="flex-1 bg-transparent text-gray-900 px-3 py-2 text-base focus:outline-none border border-gray-200 rounded-md w-full"
            />

            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-700 px-2 py-2 rounded-md text-base focus:outline-none"
            >
              <option key="all" value="all">
                Tất cả
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition text-base"
            >
              <FaSearch size={16} />
              <span>Tìm</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
