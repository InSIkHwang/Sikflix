import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  IMovie,
  IMovieCredit,
  IMovieDetail,
  getMovieCredit,
  getMovieDetail,
  getTvCredit,
  getTvDetail,
} from "../api";
import { makeImagePath } from "../utils";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";
import { useLocation, useMatch, useParams } from "react-router-dom";

const Container = styled(motion.div)`
  width: 100%;
  height: 650px;
`;

const Wrapper = styled(motion.div)`
  width: 100%;
  display: flex;
  overflow-x: hidden;
  justify-content: center;
  margin-bottom: 30px;
`;

const SliderTitle = styled.div`
  font-size: 45px;
  font-weight: 500;
  text-shadow: 3px 4px 5px #e51013;
  text-align: center;
  margin-bottom: 20px;
`;

const Poster = styled.div<{ bgPhoto: string }>`
  width: 400px;
  height: 600px;
  margin-right: 20px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  border-radius: 10px;
`;

const Rank = styled.div`
  width: 50px;
  height: 50px;
  left: 350px;
  position: relative;
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  color: white;
  text-shadow: 3px 4px 5px #000000;
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 5px;
`;

const Info = styled.div`
  width: 400px;
`;
const MovieTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  border-bottom: 1px solid white;
  padding-bottom: 5px;
`;

const MovieDetailInfo = styled.div`
  margin-top: 10px;
  padding: 0 20px;
  color: white;
  font-size: 18px;
  line-height: 28px;
  padding-bottom: 24px;
  &.overview {
    overflow: auto;
    white-space: normal;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
  }
`;

const ArrowButton = styled.button`
  font-size: 24px;
  padding: 10px;
  margin: 0 10px;
  background: none;
  color: white;
  border: none;
  cursor: pointer;
`;

interface PopSliderProps {
  data: IMovie[];
}

const PopSlider: React.FC<PopSliderProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const urlPathname = location.pathname;
  const category =
    urlPathname === "/" || urlPathname.startsWith("/movies/")
      ? "MOVIES"
      : "TV SERIES";

  const getNextIndex = (currentIndex: number) =>
    currentIndex === data.length - 1 ? 0 : currentIndex + 1;
  const getPrevIndex = (currentIndex: number) =>
    currentIndex === 0 ? data.length - 1 : currentIndex - 1;

  const currentMovie = data[currentIndex];
  const currentMovieId = currentMovie?.id;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === data.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [data]);

  const {
    data: detail,
    isLoading: detailLoading,
    refetch: refetchDetail,
  } = useQuery(["detailData", currentMovieId], () => {
    if (!currentMovieId) return null;
    if (urlPathname === "/" || urlPathname.startsWith("/movies/")) {
      return getMovieDetail(currentMovieId);
    } else {
      return getTvDetail(currentMovieId);
    }
  });

  const {
    data: credit,
    isLoading: creditLoading,
    refetch: refetchCredit,
  } = useQuery(["creditsData", currentMovieId], () => {
    if (!currentMovieId) return null;
    if (urlPathname === "/" || urlPathname.startsWith("/movies/")) {
      return getMovieCredit(currentMovieId);
    } else {
      return getTvCredit(currentMovieId);
    }
  });

  const nextSlide = () => setCurrentIndex(getNextIndex(currentIndex));
  const prevSlide = () => setCurrentIndex(getPrevIndex(currentIndex));

  return (
    <>
      <SliderTitle>POPULAR {category}</SliderTitle>
      <Wrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        exit={{ opacity: 0 }}
      >
        <ArrowButton onClick={prevSlide}>{"<"}</ArrowButton>
        {data[currentIndex] && ( // 데이터가 존재할 때만 슬라이더를 렌더링
          <Poster
            as={motion.div}
            key={currentMovieId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            bgPhoto={makeImagePath(
              data[currentIndex].poster_path,
              "w780" || ""
            )}
          >
            <Rank>{currentIndex + 1}</Rank>
          </Poster>
        )}
        <Info>
          <MovieTitle>
            {currentMovie.title
              ? `<${currentMovie.title}>`
              : `<${currentMovie.name}>`}
          </MovieTitle>
          {detail && credit && (
            <>
              <MovieDetailInfo>
                <p>
                  {currentMovie.release_date
                    ? `개봉일: ${currentMovie.release_date}`
                    : `방영일: ${currentMovie.first_air_date}`}
                </p>
                <div>
                  평점: {Math.round(data[currentIndex].vote_average * 10) / 10}
                  <IoStar color="yellow" size={18} />
                </div>
                <p>
                  장르:{" "}
                  {detail.genres &&
                    detail.genres.length &&
                    detail.genres
                      .map((genre: { name: string }) => genre.name)
                      .join(", ")}
                </p>
                {detail.production_companies.length > 0 && (
                  <p>제작사: {detail.production_companies[0].name}</p>
                )}
                {credit.cast.length > 0 && (
                  <>
                    <p>
                      제작:{" "}
                      {credit.crew
                        .slice(0, 3)
                        .map(
                          (member: { name: string; job: string }) =>
                            `${member.name}(${member.job})`
                        )
                        .join(", ")}
                    </p>
                    <p>
                      출연:{" "}
                      {credit.cast
                        .slice(0, 3)
                        .map((actor: { name: string }) => actor.name)
                        .join(", ")}
                    </p>
                  </>
                )}
              </MovieDetailInfo>
              <MovieDetailInfo className="overview">
                줄거리: <br />
                {data[currentIndex].overview
                  ? data[currentIndex].overview
                  : "(줄거리 소개가 없습니다.)"}
              </MovieDetailInfo>
            </>
          )}
        </Info>
        <ArrowButton onClick={nextSlide}>{">"}</ArrowButton>
      </Wrapper>
    </>
  );
};

export default PopSlider;
