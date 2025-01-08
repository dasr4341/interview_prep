import { Route, Routes } from "react-router";
import Home from "../components/Home";
import route from "./route";
import LifeCycle from "../components/LifeCycle/LifeCycle";

function AppRouter() {
  return (
    <Routes>
      <Route index path={route.home.path} element={<LifeCycle />} />
      <Route path={route.lifeCycle.path} element={<LifeCycle />} />
      {/* <Route index path="about" element={<About />} /> */}

      {/* <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="concerts">
        <Route index element={<ConcertsHome />} />
        <Route path=":city" element={<City />} />
        <Route path="trending" element={<Trending />} />
      </Route> */}
    </Routes>
  );
}

export default AppRouter;
