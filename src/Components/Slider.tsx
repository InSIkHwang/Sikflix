import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";
import { IMovie } from "../api";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Wrapper = styled.div`
  position: relative;
  top: -120px;
  margin-bottom: 100px;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 1800px;
  margin: 0 auto;
`;

const SliderWrapper = styled.div`
  position: relative;
  flex: 1;
  height: 200px;
`;

const SliderButtons = styled.div`
  display: flex;
`;

const ButtonContainer = styled(motion.div)`
  height: 100%;
  display: flex;
  align-items: center;
`;

const Button = styled(motion.button)`
  background-color: #222; /* Light gray background color */
  border: none;
  cursor: pointer;
  height: 200px;
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
      duration: 0.1,
      type: "tween",
    },
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

const offset = 6;

interface SliderProps {
  movies: IMovie[];
  onBoxClicked: (movieId: number) => void;
}

const Slider: React.FC<SliderProps> = ({ movies, onBoxClicked }) => {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<
    "forward" | "backward"
  >("forward");

  const incraseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    const totalMovies = movies.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    setAnimationDirection("forward");
  };

  const decreaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    const totalMovies = movies.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    setAnimationDirection("backward");
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  return (
    <Wrapper>
      <SliderContainer>
        <ButtonContainer>
          <Button onClick={decreaseIndex}>
            <IoIosArrowBack color="white" />
          </Button>
        </ButtonContainer>
        <SliderWrapper>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
              variants={{
                hiddenForward: { x: window.outerWidth + 5 },
                visibleForward: { x: 0 },
                exitForward: { x: -window.outerWidth - 5 },
                hiddenBackward: { x: -window.outerWidth - 5 },
                visibleBackward: { x: 0 },
                exitBackward: { x: window.outerWidth + 5 },
              }}
              initial={
                animationDirection === "forward"
                  ? "hiddenForward"
                  : "hiddenBackward"
              }
              animate={
                animationDirection === "forward"
                  ? "visibleForward"
                  : "visibleBackward"
              }
              exit={
                animationDirection === "forward"
                  ? "exitForward"
                  : "exitBackward"
              }
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {movies
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    layoutId={movie.id + ""}
                    key={movie.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    onClick={() => onBoxClicked(movie.id)}
                    transition={{ type: "tween" }}
                    bgPhoto={makeImagePath(
                      movie.backdrop_path,
                      "w500" || movie.poster_path
                    )}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
        </SliderWrapper>
        <ButtonContainer>
          <Button onClick={incraseIndex}>
            <IoIosArrowForward color="white" />
          </Button>
        </ButtonContainer>
      </SliderContainer>
    </Wrapper>
  );
};

export default Slider;
