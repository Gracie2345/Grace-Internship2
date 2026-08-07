import React, { useEffect } from "react";
import ExploreItems from "../components/explore/ExploreItems";
import SubheaderImage from "../images/subheader.jpg";

const Explore = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    //DOes this work
  }, []);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        {/* Subheader banner section with increased height padding */}
        <section
          id="section-subheader"
          className="text-light"
          style={{
            background: `url(${SubheaderImage}) center center / cover no-repeat`,
            padding: "110px 0 90px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="center-y relative text-center" style={{ width: "100%" }}>
            <div className="container">
              <div className="row">
                <div 
                  className="col-md-12 text-center"
                  data-aos="fade-in"
                  data-aos-easing="ease-in-out"
                  data-aos-duration="800"
                >
                  <h1>Explore</h1>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-explore" aria-label="section">
          <div className="container">
            <div className="row">
              <ExploreItems />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;