import React from "react";
import ExploreItems from "../components/explore/ExploreItems";

const Explore = () => {
  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

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