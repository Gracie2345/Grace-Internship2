import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotCollections() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(data);
      } catch (err) {
        console.error("Error fetching hot collections:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHotCollections();
  }, []);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        {/* Removed data-aos="fade-up" from the div below */}
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading ? (
            <div className="d-flex gap-3 overflow-hidden">
              {new Array(4).fill(0).map((_, index) => (
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                  <div className="nft_coll" style={{ height: "300px" }}>
                    <div
                      className="skeleton-box"
                      style={{ width: "100%", height: "180px", borderRadius: "8px" }}
                    ></div>
                    <div
                      className="skeleton-box mt-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        margin: "-25px auto 10px auto",
                      }}
                    ></div>
                    <div
                      className="skeleton-box"
                      style={{ width: "60%", height: "20px", margin: "0 auto 8px auto" }}
                    ></div>
                    <div
                      className="skeleton-box"
                      style={{ width: "30%", height: "14px", margin: "0 auto" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Slider {...sliderSettings}>
              {collections.map((col) => (
                <div className="p-2" key={col.id || col.nftId}>
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <Link to={`/item-details/${col.nftId}`}>
                        <img
                          src={col.nftImage}
                          className="lazy img-fluid"
                          alt={col.title || "NFT"}
                        />
                      </Link>
                    </div>
                    <div className="nft_coll_pp">
                      <Link to={`/author/${col.authorId}`}>
                        <img
                          className="lazy pp-coll"
                          src={col.authorImage}
                          alt={col.title || "Author"}
                        />
                      </Link>
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="nft_coll_info">
                      <Link to={`/item-details/${col.nftId}`}>
                        <h4>{col.title}</h4>
                      </Link>
                      <span>ERC-{col.code || "192"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;