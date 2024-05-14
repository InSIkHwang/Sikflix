import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  IMovieCredit,
  IMovieDetail,
  getMovieCredit,
  getMovieDetail,
  getMovies,
  getPopularMovies,
  getTopMovies,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  useParams,
  useNavigate,
  useMatch,
  useLocation,
} from "react-router-dom";
import Detail from "../Components/Detail";
import Slider from "../Components/Slider";
import PopSlider from "../Components/PopSlider";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: keep-all; // 문단으로 끊어져서 줄바꿈 됨
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  height: 200px;
  font-size: 66px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const SliderTitle = styled(motion.h1)`
  font-size: 30px;
  font-weight: 500;
  margin: 10px 20px;
  position: relative;
  overflow: hidden;
  padding-left: 30px;
  top: -120px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ccc;
    transform-origin: left;
    transform: scaleX(0);
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 10 }, // 초기 상태
  visible: { opacity: 1, y: 0 }, // 최종 상태
};

const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

const offset = 6;

function Home() {
  const { movieId } = useParams();
  const [clickedMovieId, setClickedMovieId] = useState<number | null>(
    movieId ? +movieId : null
  );

  const location = useLocation();
  const urlPathname = location.pathname;
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const {
    data: topData,
    isLoading: topLoading,
    refetch: refetchTop,
  } = useQuery<IGetMoviesResult>(["movies", "topRate"], getTopMovies);

  const {
    data: popularData,
    isLoading: popularLoading,
    refetch: refetchPopular,
  } = useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);

  const {
    data: movieDetail,
    isLoading: detailLoading,
    refetch: refetchDetail,
  } = useQuery<IMovieDetail>(["movie", clickedMovieId], () =>
    getMovieDetail(clickedMovieId!)
  );

  const {
    data: movieCredit,
    isLoading: creditLoading,
    refetch: refetchCredit,
  } = useQuery<IMovieCredit>(["credit", clickedMovieId], () =>
    getMovieCredit(clickedMovieId!)
  );
  useEffect(() => {
    refetch();
    refetchPopular();
    refetchTop();
  }, [urlPathname]);

  useEffect(() => {
    refetchDetail();
    refetchCredit();
  }, [clickedMovieId]);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };
  const onBoxClicked = (movieId: number) => {
    setClickedMovieId(movieId!);
    navigate(`/movies/${movieId}`);
  };

  const bigMovieMatch = useMatch("/movies/:movieId");

  const onOverlayClick = () => {
    navigate("/");
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (data?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId!
    ) ||
      topData?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId!
      ));
  return (
    <Wrapper>
      {" "}
      {isLoading && topLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          {data && topData && (
            <>
              <SliderTitle
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                NOW PLAYING_
                <motion.div
                  variants={underlineVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </SliderTitle>
              <Slider movies={data.results} onBoxClicked={onBoxClicked} />
              <SliderTitle
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                TOP RATED_
                <motion.div
                  variants={underlineVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </SliderTitle>
              <Slider movies={topData.results} onBoxClicked={onBoxClicked} />
            </>
          )}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                ></Overlay>
                {clickedMovie && movieDetail && movieCredit && (
                  <Detail movieDetail={movieDetail} movieCredit={movieCredit} />
                )}
              </>
            ) : null}
          </AnimatePresence>
          {popularData && movieDetail && movieCredit && (
            <PopSlider data={popularData.results} />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
