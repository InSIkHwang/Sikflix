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
import { useLocation, useMatch } from "react-router-dom";

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
  movies: IMovie[];
}

const PopSlider: React.FC<PopSliderProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentIndex((prevIndex) =>
  //       prevIndex === movies.length - 1 ? 0 : prevIndex + 1
  //     );
  //   }, 3000);

  //   return () => clearInterval(intervalId);
  // }, [movies]);

  const currentMovieId = movies[currentIndex]?.id;

  const location = useLocation();
  let urlPathname = location.pathname;

  const useConditionalDetailQuery = (
    urlPathname: string,
    currentMovieId: number
  ) => {
    const { data, isLoading, refetch } = useQuery(
      ["detailData", currentMovieId],
      () => {
        if (currentMovieId !== null) {
          if (urlPathname === "/") {
            return getMovieDetail(currentMovieId);
          } else if (urlPathname === "/tv") {
            return getTvDetail(currentMovieId);
          }
        }
        return null;
      }
    );
    return { data, isLoading, refetch };
  };

  const {
    data: detail,
    isLoading: detailLoading,
    refetch: refetchDetail,
  } = useConditionalDetailQuery(urlPathname, currentMovieId);

  const useConditionalCreditsQuery = (
    urlPathname: string,
    currentMovieId: number
  ) => {
    const { data, isLoading, refetch } = useQuery(
      ["creditsData", currentMovieId],
      () => {
        if (currentMovieId !== null) {
          if (urlPathname === "/") {
            return getMovieCredit(currentMovieId);
          } else if (urlPathname === "/tv") {
            return getTvCredit(currentMovieId);
          }
        }
        return null;
      }
    );

    return { data, isLoading, refetch };
  };

  const {
    data: credit,
    isLoading: creditLoading,
    refetch: refetchCredit,
  } = useConditionalCreditsQuery(urlPathname, currentMovieId);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <SliderTitle>POPULAR MOVIES</SliderTitle>
      <Wrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        exit={{ opacity: 0 }}
      >
        <ArrowButton onClick={prevSlide}>{"<"}</ArrowButton>
        <Poster
          as={motion.div}
          key={currentMovieId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          bgPhoto={makeImagePath(
            movies[currentIndex].poster_path,
            "w780" || ""
          )}
        >
          <Rank>{currentIndex + 1}</Rank>
        </Poster>
        <Info>
          <MovieTitle>
            {"<"}
            {movies[currentIndex].title
              ? movies[currentIndex].title
              : movies[currentIndex].name}
            {">"}
          </MovieTitle>
          {detail && credit && (
            <>
              <MovieDetailInfo>
                <p>
                  {movies[currentIndex].release_date
                    ? "개봉일: " + movies[currentIndex].release_date
                    : "방영일: " + movies[currentIndex].first_air_date}
                </p>
                <div>
                  평점:{" "}
                  {Math.round(movies[currentIndex].vote_average * 10) / 10}
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
                {movies[currentIndex].overview
                  ? movies[currentIndex].overview
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
