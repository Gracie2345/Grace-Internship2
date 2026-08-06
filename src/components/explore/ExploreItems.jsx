import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Helper component to keep timer ticking cleanly every second
const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calcTimeLeft = () => {
      // Calculate remaining difference in milliseconds
      const millisLeft = expiryDate - Date.now();

      if (millisLeft <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const totalSeconds = Math.floor(millisLeft / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    // Calculate immediately on load
    calcTimeLeft();

    // Update every 1 second
    const timer = setInterval(calcTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!timeLeft) return null;

  return (
    <div className="de_countdown">
      <span>{timeLeft}</span>
    </div>
  );
};

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [likedItems, setLikedItems] = useState({});

  useEffect(() => {
    async function fetchExploreItems() {
      setLoading(true);
      try {
        const url = filter
          ? `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=${filter}`
          : `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore`;

        const { data } = await axios.get(url);
        setItems(data);
      } catch (error) {
        console.error("Error fetching explore items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExploreItems();
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  const toggleLike = (id) => {
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="section-explore" className="no-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="items_filter">
              <select
                id="filter-items"
                value={filter}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Default</option>
                <option value="price_low_to_high">Price, Low to High</option>
                <option value="price_high_to_low">Price, High to Low</option>
                <option value="likes_high_to_low">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                >
                  <div className="nft__item skeleton-card">
                    <div className="author_list_pp">
                      <div className="skeleton-box skeleton-avatar"></div>
                    </div>
                    <div className="nft__item_wrap">
                      <div className="skeleton-box skeleton-img"></div>
                    </div>
                    <div className="nft__item_info">
                      <div className="skeleton-box skeleton-title"></div>
                      <div className="skeleton-box skeleton-price"></div>
                    </div>
                  </div>
                </div>
              ))
            : items.slice(0, visibleCount).map((item) => {
                const isLiked = likedItems[item.id];
                const likeCount = isLiked ? item.likes + 1 : item.likes;

                return (
                  <div
                    key={item.id}
                    className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                    style={{ display: "block" }}
                  >
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <Link to={`/author/${item.authorId}`}>
                          <img className="lazy" src={item.authorImage} alt="" />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>

                      {/* Display countdown timer if expiryDate exists */}
                      {item.expiryDate && (
                        <CountdownTimer expiryDate={item.expiryDate} />
                      )}

                      <div className="nft__item_wrap">
                        <Link to={`/item-details/${item.nftId}`}>
                          <img
                            src={item.nftImage}
                            className="lazy nft__item_preview"
                            alt={item.title}
                          />
                        </Link>
                      </div>

                      <div className="nft__item_info">
                        <Link to={`/item-details/${item.nftId}`}>
                          <h4>{item.title}</h4>
                        </Link>
                        <div className="nft__item_price">{item.price} ETH</div>

                        {/* LIKE BUTTON WITH HOVER & TOGGLE STATE */}
                        <div
                          className={`nft__item_like ${isLiked ? "liked" : ""}`}
                          onClick={() => toggleLike(item.id)}
                        >
                          <i
                            className={isLiked ? "fa fa-heart" : "fa fa-heart-o"}
                          ></i>
                          <span>{likeCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {!loading && visibleCount < items.length && (
          <div className="col-md-12 text-center">
            <button id="loadmore" className="btn-main lead" onClick={loadMore}>
              Load more
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreItems;