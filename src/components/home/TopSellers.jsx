import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);

  async function getTopSellers() {
    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
      );
      setSellers(data);
    } catch (error) {
      console.error("Error fetching top sellers:", error);
    }
  }

  useEffect(() => {
    getTopSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="de_tab table.sample">
              {sellers.length > 0 ? (
                <ol className="author_list">
                  {sellers.map((seller, index) => (
                    <li key={seller.id || seller.authorId || index}>
                      <div className="author_list_pp">
                        <Link to={`/author/${seller.authorId || seller.id}`}>
                          <img
                            className="lazy pf_avatar"
                            src={seller.authorImage}
                            alt=""
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${seller.authorId || seller.id}`}>
                          {seller.authorName}
                        </Link>
                        <span>{seller.price} ETH</span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <ol className="author_list">
                  {new Array(12).fill(0).map((_, index) => (
                    <li key={index}>
                      <div className="author_list_pp"></div>
                      <div className="author_list_info"></div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;