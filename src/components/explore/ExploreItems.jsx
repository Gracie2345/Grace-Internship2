import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AOS from "aos";

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

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
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
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
    return null;
  }

  return (
    <div className="de_countdown">
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

const ExploreItems = () => {
  const [nftItems, setNftItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  async function fetchExploreItems(filterValue = "") {
    setLoading(true);
    try {
      const url = filterValue
        ? `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=${filterValue}`
        : "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";

      const { data } = await axios.get(url);
      setNftItems(data);
    } catch (error) {
      console.error("Error fetching explore items:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExploreItems(filter);
  }, [filter]);

  // Refresh AOS recalculations when items finish loading or count expands
  useEffect(() => {
    if (!loading) {
      AOS.refresh();
    }
  }, [loading, visibleCount]);

  const loadMoreItems = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div className="col-md-12 mb-4">
        <select
          id="filter-item"
          value={filter}
          onChange={handleFilterChange}
          style={{
            display: "block",
            width: "200px",
            height: "40px",
            padding: "6px 12px",
            fontSize: "14px",
            color: "#333",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "6px",
            WebkitAppearance: "menulist",
            MozAppearance: "menulist",
            appearance: "menulist",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most Liked</option>
        </select>
      </div>

      {loading
        ? new Array(8).fill(0).map((_, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <div
                    className="skeleton-box"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  ></div>
                </div>
                <div className="nft__item_wrap">
                  <div
                    className="skeleton-box"
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "8px",
                    }}
                  ></div>
                </div>
                <div className="nft__item_info" style={{ marginTop: "15px" }}>
                  <div
                    className="skeleton-box"
                    style={{
                      width: "70%",
                      height: "20px",
                      borderRadius: "4px",
                      marginBottom: "10px",
                    }}
                  ></div>
                  <div
                    className="skeleton-box"
                    style={{
                      width: "40%",
                      height: "16px",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        : nftItems.slice(0, visibleCount).map((nft) => (
            <div
              className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
              key={nft.id || nft.nftId}
              data-aos="fade-in"
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to={`/author/${nft.authorId}`}>
                    <img className="lazy" src={nft.authorImage} alt="" />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>

                {nft.expiryDate && (
                  <CountdownTimer expiryDate={nft.expiryDate} />
                )}

                <div className="nft__item_wrap">
                  <Link to={`/item-details/${nft.nftId}`}>
                    <img
                      src={nft.nftImage}
                      className="lazy nft__item_preview"
                      alt={nft.title || ""}
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to={`/item-details/${nft.nftId}`}>
                    <h4>{nft.title}</h4>
                  </Link>
                  <div className="nft__item_price">{nft.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{nft.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

      {visibleCount < nftItems.length && (
        <div className="col-md-12 text-center mt-4">
          <button
            onClick={loadMoreItems}
            id="loadmore"
            className="btn-main lead"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;