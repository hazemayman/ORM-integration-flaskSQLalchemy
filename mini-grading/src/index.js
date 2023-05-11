import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

import Root from './components/root'
import ErrorPage from "./components/error_page";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Subjects from './components/subjects';
import Entity from './components/entity';
import Doctors from './components/doctors';
import Students from './components/students';
import Grades from './components/grades';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "subjects",
    element: <Subjects />,
    errorElement: <ErrorPage />,
  },
  {
    path: "students",
    element: <Students />,
    errorElement: <ErrorPage />,
  },
  {
    path: "doctors",
    element: < Doctors/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "grades",
    element: < Grades/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "subjects/:id",
    element: <Entity  entity_type = "subjects"/>,
  },
  {
    path: "students/:id",
    element: <Entity  entity_type = "students"/>,
  },
  {
    path: "doctors/:id",
    element: <Entity  entity_type = "doctors"/>,
  },
  {
    path: "grades/:id",
    element: <Entity  entity_type = "grades"/>,
  },
]);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
