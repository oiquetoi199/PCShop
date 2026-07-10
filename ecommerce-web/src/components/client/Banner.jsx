import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { FaNewspaper } from 'react-icons/fa';

const SlideUp = (delay) => {
  return {
    hidden: {
      y: "-100%",
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: delay
      }
    }
  }
};

const Banner = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchnewsDetail = async () => {
      const response = await fetch(`${apiUrl}/news/guest/hot`);

      if (!response.ok) {
          setNews(null);
          return;
      }

      const text = await response.text();

      if (!text) {
          setNews(null);
          return;
      }

      const data = JSON.parse(text);
      setNews(data);
    };

    fetchnewsDetail();
  }, []);

  return <section>
    <div className="container py-8">
      {
        news && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 place-items-center">
            <div className="relative">
              <img
                src={`data:image/png;base64,${news?.thumb}`}
                alt={news?.title}
                className="relative z-10 h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] lg:max-w-[500px] img-shadow"
                style={{ background: 'transparent', borderRadius: '10px', }}
              />
            </div>

            <div className="space-y-5 lg:max-w-[400px]:">
              <h1 className="flex items-center text-3xl font-bold text-green-500 mb-8">
                  <FaNewspaper className="mr-2" /> Tin tức mới
              </h1>
              <motion.h1
                viewport={{ once: true }}
                variants={SlideUp(1)}
                initial="hidden"
                whileInView="show"
                className="text-xl md:text-4xl uppercase font-semibold font-league mt-2 sm:mt-4"
              >
                {news?.title}
              </motion.h1>

              {/* <motion.p
                variants={SlideUp(1.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <TextWithExpandHTML text={news?.description} maxLength={200} />
              </motion.p> */}
              <motion.button
                variants={SlideUp(1.6)}
                initial="hidden"
                whileInView="show"
                className="btn-primary"
                viewport={{ once: true }}
              >
                <Link to={`/news-detail/${news?.id}`}>
                  Xem ngay
                </Link>

              </motion.button>
            </div>
          </div>
        )
      }
    </div>
  </section>
};

export default Banner;