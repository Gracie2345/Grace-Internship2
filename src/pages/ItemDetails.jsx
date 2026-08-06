import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import EthImage from "../images/ethereum.svg";

const ItemDetails = () => {
  const { nftId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

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
                <>
                  <div className="col-md-6 text-center">
                    <div
                      className="skeleton-box"
                      style={{
                        width: "100%",
                        height: "400px",
                        borderRadius: "8px",
                      }}
                    ></div>
                  </div>
                  <div className="col-md-6">
                    <div className="item_info">
                      <div
                        className="skeleton-box mb-3"
                        style={{ width: "60%", height: "36px" }}
                      ></div>
                      <div
                        className="skeleton-box mb-4"
                        style={{ width: "25%", height: "24px" }}
                      ></div>
                      <div
                        className="skeleton-box mb-2"
                        style={{ width: "100%", height: "16px" }}
                      ></div>
                      <div
                        className="skeleton-box mb-4"
                        style={{ width: "80%", height: "16px" }}
                      ></div>
                      <div
                        className="skeleton-box mb-3"
                        style={{ width: "40%", height: "50px" }}
                      ></div>
                      <div
                        className="skeleton-box mb-3"
                        style={{ width: "40%", height: "50px" }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : error || !item ? (
                <div className="col-md-12 text-center my-5">
                  <h2>Failed to load item details</h2>
                  <p>Unable to retrieve NFT with ID: {nftId || "Unknown"}</p>
                  <Link to="/" className="btn-main">
                    Back to Home
                  </Link>
                </div>
              ) : (
                <>
                  <div className="col-md-6 text-center">
                    <img
                      src={item.nftImage}
                      className="img-fluid img-rounded mb-sm-30 nft-image"
                      alt={item.title || "NFT"}
                      style={{ borderRadius: "12px", width: "100%" }}
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="item_info">
                      <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>
                        {item.title} {item.tag ? `#${item.tag}` : ""}
                      </h2>

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

                      <p className="mb-4" style={{ color: "#727272" }}>
                        {item.description}
                      </p>

                      <div className="item_author_wrapper mb-4">
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

                      <div className="de_tab tab_simple">
                        <div className="de_tab_content p-0">
                          <h6 style={{ marginBottom: "8px", fontWeight: "600" }}>
                            Price
                          </h6>
                          <div
                            className="nft-item-price"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <img
                              src={EthImage}
                              alt="Ethereum"
                              style={{
                                width: "28px",
                                height: "28px",
                                display: "block",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "28px",
                                fontWeight: "bold",
                                color: "#0d0c22",
                                lineHeight: 1,
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