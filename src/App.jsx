import { useEffect, useState } from "react";
import { TVShowApi } from "./api/tv-shows";
import { BACKDROP_BASE_URL } from "./config";
import { TVShowDetail } from "./components/TVShowDetail/TVShowDetail";
import s from "./style.module.css";
import { Logo } from "./components/Logo/Logo";
import logoImg from "./assets/images/logo.png";
import { TVShowList } from "./components/TVShowList/TVShowList";
import { SearchBar } from "./components/SearchBar/SearchBar";

export function App() {
  const [currentTVShow, setCurrentTVShow] = useState("");
  const [recommendationList, setRecommendationList] = useState([]);

  async function fetchPopulars() {
    try{
      const popularTVShowList = await TVShowApi.fetchPopulars();
      if (setCurrentTVShow.length > 0) {
        setCurrentTVShow(popularTVShowList[0]);
      }
    }catch(error){
      alert("Something went wrong when fetching the popular tv show.")
    }
  }

  async function fetchRecommendations(tvShowId) {
    try{
      const recommendationListResp = await TVShowApi.fetchRecommendations(
        tvShowId
      );
      if (recommendationListResp.length > 0) {
        setRecommendationList(recommendationListResp.slice(0, 10));
      }
    }catch(error){
      alert("Something went wrong when fetching the recommendation list.")
    }
    
  }
  
  useEffect(() => {
    fetchPopulars();
  }, []);

  useEffect(() => {
    if (currentTVShow) {
      fetchRecommendations(currentTVShow.id);
    }
  }, [currentTVShow]);

  function updateCurrentTVShow(tvShow) {
    setCurrentTVShow(tvShow)
  }

  async function fetchByTitle(title) {
    try{
      const searchResponse = await TVShowApi.fetchByTitle(
        title
      );
      if (searchResponse.length > 0) {
        setCurrentTVShow(searchResponse[0]);
      }
    }catch(error){
      alert("Something went wrong when searching TV Shows.")
    }
  }

  return (
    <div
      className={s.main_container}
      style={{
        background: currentTVShow
          ? `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
    url("${BACKDROP_BASE_URL}${currentTVShow.backdrop_path}") no-repeat center / cover`
          : "black",
      }}
    >
      <div className={s.header}>
        <div className="row">
          <div className="col-4">
            <Logo
              img={logoImg}
              title="NYEKFLIK"
              subtitle="Think, Find, We give it to you!"
            />
          </div>
          <div className="col-md-12 col-lg-4">
            <SearchBar onSubmit={fetchByTitle}/>
          </div>
        </div>
      </div>
      <div className={s.tv_show_detail}>
        {/* TVShowDetail will be rendered if currentTVShow is defined */}
        {currentTVShow && <TVShowDetail tvShow={currentTVShow} />}
      </div>
      <div className={s.recommended_tv_shows}>
        {currentTVShow && <TVShowList onClickItem={updateCurrentTVShow} tvShowList={recommendationList} />}
      </div>
    </div>
  );
}
