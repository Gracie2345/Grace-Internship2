import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import AOS from "aos";

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiryDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiryDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("EXPIRED");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  if (!expiryDate || timeLeft === "EXPIRED") return null;

  return <div className="de_countdown">{timeLeft}</div>;
};

// Custom Arrow Components matching template structure
const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="owl-prev" onClick={onClick}>
      <i className="fa fa-angle-left"></i>
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="owl-next" onClick={onClick}>
      <i className="fa fa-angle-right"></i>
    </div>
  );
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    async function fetchNewItems() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setItems(data);
      } catch (err) {
        console.error("Error fetching new items:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNewItems();
  }, []);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    cssEase: "linear",
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row" data-aos="fade-up">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading ? (
            <div className="d-flex gap-3 overflow-hidden">
              {new Array(4).fill(0).map((_, index) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                  <div className="nft__item" style={{ height: "350px" }}>
                    <div
                      className="skeleton-box"
                      style={{ width: "100%", height: "200px", borderRadius: "8px" }}
                    ></div>
                    <div
                      className="skeleton-box mt-3"
                      style={{ width: "70%", height: "20px" }}
                    ></div>
                    <div
                      className="skeleton-box mt-2"
                      style={{ width: "40%", height: "16px" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-lg-12">
              <div className="de_carousel">
                <Slider {...sliderSettings}>
                  {items.map((item) => (
                    <div className="px-2" key={item.id || item.nftId}>
                      <div className="nft__item">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.authorId}`}>
                            <img className="lazy" src={item.authorImage} alt="" />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>

                        {item.expiryDate && <CountdownTimer expiryDate={item.expiryDate} />}

                        <div className="nft__item_wrap">
                          <Link to={`/item-details/${item.nftId}`}>
                            <img
                              src={item.nftImage}
                              className="lazy nft__item_preview"
                              alt={item.title || "NFT"}
                            />
                          </Link>
                        </div>
                        <div className="nft__item_info">
                          <Link to={`/item-details/${item.nftId}`}>
                            <h4>{item.title}</h4>
                          </Link>
                          <div className="nft__item_price">{item.price} ETH</div>
                          <div className="nft__item_like">
                            <i className="fa fa-heart"></i>
                            <span>{item.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;