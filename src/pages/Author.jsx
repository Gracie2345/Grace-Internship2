import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";

const Author = () => {
  const [authorData, setAuthorData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Follower State Management
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);

  const params = useParams();
  const authorId = params.authorId || params.id;

  async function getAuthorData() {
    if (!authorId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
      );
      setAuthorData(data);
      setFollowers(data.followers);
    } catch (error) {
      console.error("Error fetching author data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAuthorData();
  }, [authorId]);

  // Dynamic Follow / Unfollow Handler
  const handleFollow = () => {
    if (isFollowing) {
      setFollowers((prev) => prev - 1);
      setIsFollowing(false);
    } else {
      setFollowers((prev) => prev + 1);
      setIsFollowing(true);
    }
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              {/* Profile Header Block */}
              {loading ? (
                /* Profile Skeleton Loading State */
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <div className="skeleton-box skeleton-author-avatar"></div>
                        <div className="profile_name" style={{ width: "200px" }}>
                          <div className="skeleton-box skeleton-author-name"></div>
                          <div className="skeleton-box skeleton-author-handle"></div>
                          <div className="skeleton-box skeleton-author-address"></div>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="skeleton-box skeleton-author-btn"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Loaded Profile Data */
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={authorData?.authorImage} alt={authorData?.authorName} />
                        <i className="fa fa-check"></i>
                        <div className="profile_name">
                          <h4>
                            {authorData?.authorName}
                            <span className="profile_username">
                              @{authorData?.tag}
                            </span>
                            <span id="wallet" className="profile_wallet">
                              {authorData?.address}
                            </span>
                            <button id="btn_copy" title="Copy Text">
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {followers} followers
                        </div>
                        <button className="btn-main" onClick={handleFollow}>
                          {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Author's NFT Grid */}
              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <div className="de_tab_content">
                    <div className="tab-1">
                      <div className="row">
                        {loading
                          ? new Array(8).fill(0).map((_, index) => (
                              <div
                                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                                key={index}
                              >
                                <div className="nft__item">
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
                          : authorData?.nftCollection?.map((nft) => (
                              <div
                                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                                key={nft.id || nft.nftId}
                              >
                                <div className="nft__item">
                                  <div className="author_list_pp">
                                    <Link to={`/author/${authorId}`}>
                                      <img
                                        className="lazy"
                                        src={authorData.authorImage}
                                        alt=""
                                      />
                                      <i className="fa fa-check"></i>
                                    </Link>
                                  </div>
                                  <div className="nft__item_wrap">
                                    <Link to={`/item-details/${nft.nftId}`}>
                                      <img
                                        src={nft.nftImage}
                                        className="lazy nft__item_preview"
                                        alt={nft.title}
                                      />
                                    </Link>
                                  </div>
                                  <div className="nft__item_info">
                                    <Link to={`/item-details/${nft.nftId}`}>
                                      <h4>{nft.title}</h4>
                                    </Link>
                                    <div className="nft__item_price">
                                      {nft.price} ETH
                                    </div>
                                    <div className="nft__item_like">
                                      <i className="fa fa-heart"></i>
                                      <span>{nft.likes}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;