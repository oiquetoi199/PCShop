import HotDessert from "../../../components/client/HotDessert";
// import Banner from "../../../components/client/Banner";
import PopularRecipe from "../../../components/client/PopularRecipe";
// import Testimonial from "../../../components/client/Testimonial";
// import Hero from "../../../components/client/Hero";

// Hiển thị các khu vực nội dung chính của trang chủ.
const HomePages = () => {
    return (
        <>
            <HotDessert />
            <PopularRecipe />
        </>
    )
}

export default HomePages;