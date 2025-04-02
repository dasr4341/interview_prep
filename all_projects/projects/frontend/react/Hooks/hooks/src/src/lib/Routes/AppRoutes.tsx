import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../../Pages/Home/Home";
import { routes } from "./routes";
import UseEffect from "../../Pages/useEffect/UseEffect";
import UseFieldArray from "../../Pages/UseFieldArray/UseFieldArray";

export default function AppRoutes() {
  return (
    <>
      <Suspense>
        <Routes>
          <Route element={<Navigate to={routes.home.path} />} path="" />
          <Route element={<Home />} path={routes.home.path} />
          <Route element={<UseEffect />} path={routes.useEffect.path} />
          <Route element={<UseFieldArray />} path={routes.UseFieldArray.path} />
        </Routes>
      </Suspense>
    </>
  );
}
