import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ItemDetails = () => {
  const { nftId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchItemDetails() {
      setLoading(true);
      setError(false);
      try {
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );
        if (isMounted) {
          setItem(data);
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    window.scrollTo(0, 0);

    if (nftId) {
      fetchItemDetails();
    } else {
      setLoading(false);
      setError(true);
    }

    return () => {
      isMounted = false;
    };
  }, [nftId]);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              {loading ? (
                /* Loading / Skeleton State */
                <>
                  <div className="col-md-6 text-center">
                    <div
                      className="skeleton-box"
                      style={{
                        width: "100%",
                        height: "400px",
                        backgroundColor: "#eee",
                        borderRadius: "8px",
                      }}
                    ></div>
                  </div>
                  <div className="col-md-6">
                    <div className="item_info">
                      <div
                        className="skeleton-box"
                        style={{
                          width: "60%",
                          height: "32px",
                          backgroundColor: "#eee",
                          marginBottom: "15px",
                        }}
                      ></div>
                      <div
                        className="skeleton-box"
                        style={{
                          width: "30%",
                          height: "20px",
                          backgroundColor: "#eee",
                          marginBottom: "20px",
                        }}
                      ></div>
                      <div
                        className="skeleton-box"
                        style={{
                          width: "100%",
                          height: "15px",
                          backgroundColor: "#eee",
                          marginBottom: "10px",
                        }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : error || !item ? (
                /* Error State */
                <div className="col-md-12 text-center my-5">
                  <h2>Failed to load item details</h2>
                  <p>Unable to retrieve NFT with ID: {nftId || "Unknown"}</p>
                  <Link to="/" className="btn-main">
                    Back to Home
                  </Link>
                </div>
              ) : (
                /* Dynamic Content State */
                <>
                  {/* Left Column: NFT Image */}
                  <div className="col-md-6 text-center">
                    <img
                      src={item.nftImage}
                      className="img-fluid img-rounded mb-sm-30 nft-image"
                      alt={item.title || "NFT"}
                    />
                  </div>

                  {/* Right Column: Details */}
                  <div className="col-md-6">
                    <div className="item_info">
                      <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>
                        {item.title} {item.tag ? `#${item.tag}` : ""}
                      </h2>

                      {/* Views & Likes Badges */}
                      <div className="item_info_counts mb-3">
                        <div className="item_info_views">
                          <i className="fa fa-eye"></i>
                          {item.views ?? 0}
                        </div>
                        <div className="item_info_like">
                          <i className="fa fa-heart"></i>
                          {item.likes ?? 0}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-4" style={{ color: "#727272" }}>
                        {item.description}
                      </p>

                      {/* Vertical Owner & Creator Stack */}
                      <div className="item_author_wrapper mb-4">
                        {/* Owner Section */}
                        <div className="mb-3">
                          <h6 style={{ marginBottom: "8px", fontWeight: "600" }}>
                            Owner
                          </h6>
                          <div className="item_author d-flex align-items-center">
                            <div
                              className="author_list_pp"
                              style={{
                                position: "relative",
                                top: "auto",
                                left: "auto",
                                width: "45px",
                                height: "45px",
                                marginRight: "12px",
                                display: "inline-block",
                              }}
                            >
                              <Link to={`/author/${item.ownerId}`}>
                                <img
                                  className="lazy"
                                  src={item.ownerImage}
                                  alt={item.ownerName || "Owner"}
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                                <i
                                  className="fa fa-check"
                                  style={{
                                    position: "absolute",
                                    right: "0",
                                    bottom: "0",
                                    background: "#8364e2",
                                    color: "#fff",
                                    padding: "3px",
                                    borderRadius: "50%",
                                    fontSize: "9px",
                                  }}
                                ></i>
                              </Link>
                            </div>
                            <div className="author_list_info">
                              <Link
                                to={`/author/${item.ownerId}`}
                                style={{
                                  fontWeight: "bold",
                                  color: "#111",
                                  fontSize: "15px",
                                }}
                              >
                                {item.ownerName}
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Creator Section */}
                        <div>
                          <h6 style={{ marginBottom: "8px", fontWeight: "600" }}>
                            Creator
                          </h6>
                          <div className="item_author d-flex align-items-center">
                            <div
                              className="author_list_pp"
                              style={{
                                position: "relative",
                                top: "auto",
                                left: "auto",
                                width: "45px",
                                height: "45px",
                                marginRight: "12px",
                                display: "inline-block",
                              }}
                            >
                              <Link to={`/author/${item.creatorId}`}>
                                <img
                                  className="lazy"
                                  src={item.creatorImage}
                                  alt={item.creatorName || "Creator"}
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    display: "block",
                                  }}
                                />
                                <i
                                  className="fa fa-check"
                                  style={{
                                    position: "absolute",
                                    right: "0",
                                    bottom: "0",
                                    background: "#8364e2",
                                    color: "#fff",
                                    padding: "3px",
                                    borderRadius: "50%",
                                    fontSize: "9px",
                                  }}
                                ></i>
                              </Link>
                            </div>
                            <div className="author_list_info">
                              <Link
                                to={`/author/${item.creatorId}`}
                                style={{
                                  fontWeight: "bold",
                                  color: "#111",
                                  fontSize: "15px",
                                }}
                              >
                                {item.creatorName}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div className="de_tab tab_simple">
                        <div className="de_tab_content p-0">
                          <h6 style={{ marginBottom: "8px", fontWeight: "600" }}>
                            Price
                          </h6>
                          <div className="nft-item-price d-flex align-items-center">
                            {/* Blue Ethereum Diamond Circle Icon */}
                            <span
                              style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: "#6385f4",
                                borderRadius: "50%",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "10px",
                              }}
                            >
                              <i
                                className="fa-brands fa-ethereum"
                                style={{
                                  color: "#ffffff",
                                  fontSize: "15px",
                                }}
                              ></i>
                            </span>

                            {/* Price Text */}
                            <span
                              style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "#0d0c22",
                                lineHeight: "1",
                              }}
                            >
                              {item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;