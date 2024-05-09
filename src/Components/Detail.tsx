import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";
import { makeImagePath } from "../utils";
import { IMovie, IMovieDetail, IMovieCredit } from "../api";

interface Props {
  movie: IMovie;
  movieDetail: IMovieDetail | null;
  movieCredit: IMovieCredit | null;
}

const BigMovie = styled(motion.div)`
  position: fixed;
  min-width: 600px;
  width: 40vw;
  min-height: 80vh;
  top: 100px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: #0f0f0f;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center top;
  height: 300px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  height: 100%;
  position: relative;
  top: -50px;
  line-height: 28px;
  color: ${(props) => props.theme.white.lighter};
`;

const BigHeader = styled(motion.div)`
  padding: 20px;
  position: relative;
  display: flex;
  top: -90px;
  color: ${(props) => props.theme.white.lighter};
  border-bottom: 1px solid #ccc;
  align-items: center;
  p {
    font-size: 20px;
    font-weight: 500;
    padding-right: 10px;
    margin-left: 10px;
    border-right: 1px solid #ccc;
  }
`;

const BigLanguage = styled(motion.span)`
  font-size: 16px;
  border: 2px solid #255fff;
  border-radius: 3px;
  padding: 0 5px;
`;

const BigStar = styled(motion.span)`
  color: yellow;
`;

const BigGenres = styled.span`
  font-size: 16px;
  border: 2px solid #255fff;
  border-radius: 3px;
  margin-left: 5px;
  padding: 0 3px;
`;

const Credit = styled.div`
  top: -70px;
  font-size: 18px;
  position: relative;
  display: flex;
  margin-bottom: 10px;
  padding-left: 20px;
  align-items: center;
  color: ${(props) => props.theme.white.lighter};
  p {
    padding-left: 5px;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
`;

const CreditProfile = styled.div<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  margin-left: 20px;
  height: 80px;
  width: 60px;
  top: -50px;
`;

const headerVariants = {
  hidden: {
    y: 50, // 초기 상태에서 아래로 내려가 있도록
    opacity: 0,
  },
  visible: {
    y: 0, // 최종 위치
    opacity: 1,
    transition: {
      when: "beforeChildren", // 자식 요소들의 애니메이션이 시작되기 전에 부모 요소가 애니메이트됩니다.
      staggerChildren: 0.1, // 자식 요소들의 애니메이션을 0.1초 간격으로 시작
    },
  },
};

const headerTransition = {
  type: "spring", // 스프링 애니메이션
  damping: 10, // 애니메이션의 반동 정도
  stiffness: 100, // 스프링의 강도
};

const childVariants = {
  hidden: { opacity: 0, y: 20 }, // 초기 상태
  visible: { opacity: 1, y: 0 }, // 최종 상태
};

// 애니메이션 옵션
const headerAnimationOptions = {
  variants: headerVariants,
  initial: "hidden", // 초기 상태는 숨겨진 상태로
  animate: "visible", // 보이는 상태로 애니메이션
  transition: headerTransition, // 애니메이션 트랜지션 설정
};

const Detail: React.FC<Props> = ({ movie, movieDetail, movieCredit }) => {
  return (
    <BigMovie {...headerAnimationOptions}>
      <BigCover
        style={{
          backgroundImage: `linear-gradient(to top, #0f0f0f, transparent), url(${makeImagePath(
            movie.backdrop_path,
            "w780"
          )})`,
        }}
      />
      <BigTitle>{movie.title}</BigTitle>
      {movieDetail && movieCredit && (
        <>
          <BigHeader>
            <BigLanguage variants={childVariants}>
              {movie.original_language.toUpperCase()}
            </BigLanguage>

            <BigStar variants={childVariants} style={{ marginLeft: "10px" }}>
              <IoStar size={20} />
            </BigStar>
            <motion.p variants={childVariants}>
              {Math.round(movie.vote_average * 10) / 10}
            </motion.p>
            <motion.p variants={childVariants}>
              개봉일: {movie.release_date}
            </motion.p>
            {movieDetail?.genres.slice(0, 3).map((genre, index) => (
              <motion.span key={index} variants={childVariants}>
                <BigGenres>{genre.name}</BigGenres>
              </motion.span>
            ))}
          </BigHeader>
          <Credit>
            <span>감독: </span>
            <p>
              {
                movieCredit?.crew.find((member) => member.job === "Director")
                  ?.name
              }
            </p>
          </Credit>
          <Credit>
            <span>출연: </span>
            {movieCredit?.cast.slice(0, 3).map((cast, index) => (
              <div key={index}>
                <p>{cast.name},</p>
              </div>
            ))}
          </Credit>
          <ProfileWrapper>
            {movieCredit?.cast.slice(0, 3).map((cast, index) => (
              <CreditProfile
                key={index}
                bgPhoto={makeImagePath(
                  movieCredit?.cast[index].profile_path + "",
                  "w500" || null
                )}
              />
            ))}
          </ProfileWrapper>
        </>
      )}
      <BigOverview>{movie.overview}</BigOverview>
    </BigMovie>
  );
};

export default Detail;