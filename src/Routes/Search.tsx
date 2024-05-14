import { useQuery } from "react-query";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  IGetSearch,
  IMovieCredit,
  IMovieDetail,
  getMovieCredit,
  getMovieDetail,
  getSearchMovie,
  getSearchTv,
  getTvCredit,
  getTvDetail,
} from "../api";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import Detail from "../Components/Detail";

const Wrapper = styled.div`
  margin: 0 auto;
  position: relative;
  top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Keyword = styled.div`
  font-size: 20px;
  margin-bottom: 50px;
`;
const Category = styled.p`
  font-size: 30px;
  font-weight: 700;
  padding-bottom: 5px;
  border-bottom: 3px double white;
`;
const Result = styled.div`
  flex: 1;
  margin: 20px auto 100px auto;
  border: 3px solid #e51013;
  border-width: 3px 0px 3px 0px;
  border-radius: 10px;
`;
const Row = styled.div`
  display: flex;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  height: 255px;
  width: 170px;
  margin: 10px 5px;
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
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

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

function Search() {
  const { contentId } = useParams();
  const tvMatch = useMatch("/search/tv/:contentId");
  const movieMatch = useMatch("/search/movie/:contentId");

  const location = useLocation();
  const [clickedContentId, setClickedContentId] = useState<number | null>(
    contentId ? +contentId : null
  );
  const keyword = new URLSearchParams(location.search).get("keyword");
  const navigate = useNavigate();

  const { data: movie_Data, refetch: movie_refetch } = useQuery<IGetSearch>(
    ["search", "movie"],
    () => (keyword ? getSearchMovie(keyword) : Promise.resolve(null)),
    { enabled: !!keyword }
  );

  const { data: tv_Data, refetch: tv_refetch } = useQuery<IGetSearch>(
    ["search", "tv"],
    () => (keyword ? getSearchTv(keyword) : Promise.resolve(null)),
    {
      enabled: !!keyword,
    }
  );

  const onMovieBoxClicked = (movieId: number) => {
    setClickedContentId(movieId!);
    navigate(`/search/movie/${movieId}?keyword=${keyword}`);
  };

  const onTvBoxClicked = (tvId: number) => {
    setClickedContentId(tvId!);
    navigate(`/search/tv/${tvId}?keyword=${keyword}`);
  };
  const onOverlayClick = () => {
    navigate(-1);
  };

  const {
    data: movieDetail,
    isLoading: movieDetailLoading,
    refetch: refetchMovieDetail,
  } = useQuery<IMovieDetail>(["movie", clickedContentId], () =>
    getMovieDetail(clickedContentId!)
  );

  const {
    data: movieCredit,
    isLoading: movieCreditLoading,
    refetch: refetchMovieCredit,
  } = useQuery<IMovieCredit>(["movieCredit", clickedContentId], () =>
    getMovieCredit(clickedContentId!)
  );
  const {
    data: tvDetail,
    isLoading: tvDetailLoading,
    refetch: refetchTvDetail,
  } = useQuery<IMovieDetail>(["tv", clickedContentId], () =>
    getTvDetail(clickedContentId!)
  );

  const {
    data: tvCredit,
    isLoading: tvCreditLoading,
    refetch: refetchTvCredit,
  } = useQuery<IMovieCredit>(["tvCredit", clickedContentId], () =>
    getTvCredit(clickedContentId!)
  );

  useEffect(() => {
    movie_refetch();
    tv_refetch();
  }, [keyword, movie_refetch, tv_refetch]);

  const renderResults = (data: any, onBoxClicked: (id: number) => void) => {
    const results = data?.results || [];
    const rows: JSX.Element[] = [];

    for (let i = 0; i < results.length; i += 6) {
      const rowItems = results.slice(i, i + 6).map((item: any) => (
        <Box
          key={item.id}
          layoutId={item.id + ""}
          whileHover="hover"
          initial="normal"
          variants={boxVariants}
          transition={{ type: "tween" }}
          bgPhoto={makeImagePath(item.poster_path, "w500") || ""}
          onClick={() => onBoxClicked(item.id)}
        >
          <Info variants={infoVariants}>
            <h4>{item.title || item.name}</h4>
          </Info>
        </Box>
      ));
      rows.push(<Row key={i}>{rowItems}</Row>);
    }

    return rows;
  };

  return (
    <>
      <Wrapper>
        <Keyword>
          {keyword === null ? (
            <h3>검색어를 입력해주세요.</h3>
          ) : (
            <h3>"{keyword}"의 검색 결과입니다.</h3>
          )}
        </Keyword>
        <AnimatePresence>
          {" "}
          <Category>MOVIE</Category>
          <Result>{renderResults(movie_Data, onMovieBoxClicked)}</Result>
          <Category>TV SERIES</Category>
          <Result>{renderResults(tv_Data, onTvBoxClicked)}</Result>
        </AnimatePresence>
        <AnimatePresence>
          {tvMatch && (
            <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              ></Overlay>
              {tvDetail && tvCredit && (
                <Detail movieDetail={tvDetail} movieCredit={tvCredit} />
              )}
            </>
          )}

          {movieMatch && (
            <>
              <Overlay
                onClick={onOverlayClick}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              ></Overlay>
              {movieDetail && movieCredit && (
                <Detail movieDetail={movieDetail} movieCredit={movieCredit} />
              )}
            </>
          )}
        </AnimatePresence>
      </Wrapper>
    </>
  );
}

export default Search;
