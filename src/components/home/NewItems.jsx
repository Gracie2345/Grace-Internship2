import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import "../../css/styles/owl.carousel.css";
import "../../css/styles/owl.theme.css";

// Sub-component to handle live countdown ticking
const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    if (!expiryDate) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
      return;
    }

    const calculateTimeLeft = () => {
      const difference = expiryDate - Date.now();
      
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { hours, minutes, seconds, expired: false };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);
      if (updatedTime.expired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!expiryDate || timeLeft.expired) {
    return <div className="de_countdown">EXPIRED</div>;
  }

  return (
    <div className="de_countdown">
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

const NewItems = () => {
  const [items, setItems] = useState([]);

  async function getNewItems() {
    const { data } = await axios.get(
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
    );
    setItems(data);
  }

  useEffect(() => {
    getNewItems();
  }, []);

  // Owl Carousel options
  const options = {
    loop: true,
    margin: 30,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      768: { items: 3 },
      1200: { items: 4 },
    },
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {items.length > 0 ? (
            <OwlCarousel className="owl-theme" {...options}>
              {items.map((item) => (
                <div className="nft__item" key={item.id}>
                  <div className="author_list_pp">
                    <Link to={`/author/${item.authorId}`}>
                      <img className="lazy" src={item.authorImage} alt="" />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  
                  {/* Renders countdown or EXPIRED for all items */}
                  <CountdownTimer expiryDate={item.expiryDate} />

                  <div className="nft__item_wrap">
                    <Link to={`/item-details/${item.nftId}`}>
                      <img
                        src={item.nftImage}
                        className="lazy nft__item_preview"
                        alt=""
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
              ))}
            </OwlCarousel>
          ) : (
            <div className="row">
              {new Array(4).fill(0).map((_, index) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                  <div className="nft__item">
                    <div className="author_list_pp"></div>
                    <div className="nft__item_wrap"></div>
                    <div className="nft__item_info"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewItems;