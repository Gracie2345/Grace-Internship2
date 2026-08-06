import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    async function fetchAuthorData() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        setAuthor(data);
        setFollowers(data.followers);
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthorData();
  }, [authorId]);

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

        {/* Banner Section - Fixed with template AuthorBanner asset */}
        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{
            background: `url(${AuthorBanner}) top / cover no-repeat`,
            height: "360px",
            width: "100%",
          }}
        ></section>

        {/* Author Details Section */}
        <section aria-label="section">
          <div className="container">
            <div className="row">
              {loading ? (
                /* Skeleton Loading State */
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <div className="skeleton-box skeleton-avatar-lg"></div>
                        <div className="profile_name">
                          <div className="skeleton-box skeleton-title-lg"></div>
                          <div className="skeleton-box skeleton-text-sm"></div>
                          <div className="skeleton-box skeleton-text-sm"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Author Main Profile Card */
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={author?.authorImage} alt={author?.authorName} />
                        <i className="fa fa-check"></i>
                        <div className="profile_name">
                          <h4>
                            {author?.authorName}
                            <span className="profile_username">@{author?.tag}</span>
                            <span id="wallet" className="profile_wallet">
                              {author?.address}
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
                        <div className="profile_follower">{followers} followers</div>
                        <button className="btn-main" onClick={handleFollow}>
                          {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Author NFT Collection */}
              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <div className="row">
                    {loading
                      ? Array.from({ length: 8 }).map((_, index) => (
                          <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                            <div className="nft__item skeleton-card">
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
                      : author?.nftCollection?.map((nft) => (
                          <div
                            key={nft.id || nft.nftId}
                            className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                            style={{ display: "block" }}
                          >
                            <div className="nft__item">
                              <div className="author_list_pp">
                                <Link to={`/author/${authorId}`}>
                                  <img
                                    className="lazy"
                                    src={author?.authorImage}
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
                                <div className="nft__item_price">{nft.price} ETH</div>
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
        </section>
      </div>
    </div>
  );
};

export default Author;