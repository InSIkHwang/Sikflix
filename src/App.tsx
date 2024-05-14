import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/search/movie/:contentId" element={<Search />} />
        <Route path="/search/tv/:contentId" element={<Search />} />
        <Route path="/" element={<Home />}></Route>
        <Route path="/movies/:movieId" element={<Home />} />
        <Route path="/tvs/:tvId" element={<Tv />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
