import React from "react";
import Toolbar from "./components/toolbar";
import "./styles.less";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/navbar/footer";
import ContactPage from "./components/contact-page";
import DVRK from "./components/dvrk-page";
import DocumentPage from "./components/documents-page";
import AboutPage from "./components/about-page";
import HomePage from "./components/home-page";
import CommitteePage from "./components/committee-page";
import ToolsPage from "./components/tools-page";
import PhotosPage from "./components/photos-page";
import Schedule from "./components/widgets/schedule";
import InfoScreen from "./components/info-screen";
import EditInfoScreen from "./components/edit-info-screen";
import NewsScreen from "./components/newscreen";
import ScheduleScreen from "./components/schedulescreen";
// import WIP from "./components/widgets/wip";
import IndividualCommitteePage from "./components/individual-committee-page";
import { getLanguageCookie, isEnglish } from "./util";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Cookies from "js-cookie";

const GoogleAuth = () => {
  const [token, setToken] = React.useState(Cookies.get("dv-token"));
  const [isLoggedIn, setIsLoggedIn] = React.useState(null);

  // Log in with token if it exists
  React.useEffect(() => {
    if (token) {
      fetch("/verify-token", { method: "POST", headers: { "Authorization": `Bearer ${token}` }})
      .then(res => setIsLoggedIn(res.ok))
      .catch(setIsLoggedIn(false));
    }
  }, [token]);

  const onSuccess = async (res) => {
    if (res.credential) {
      await fetch("/google-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(res)})
      .then(res => setIsLoggedIn(res.ok))
      .catch(setIsLoggedIn(false));
    }
  };

  return <GoogleOAuthProvider clientId="420624855220-dad51rlh0qhf2p0fco7s37h685clivps">
    { (isLoggedIn && <Outlet />) ?? (<><GoogleLogin onSuccess={onSuccess} onError={setIsLoggedIn(false)} /> <p>Unauthorised.</p></>) }
  </GoogleOAuthProvider>
};

const LanguageSelector = () => {
  return <main>
    <div className="language-picker page">
      <h1>Hi - language selection!</h1>
      <p>Before you can proceed we have to ask you which language you prefer!</p>
      <form id="language-form">
        <input type="radio" name="language" id="language-se" defaultChecked={true} />
        <label htmlFor="language-se">Svenska</label>
        <br />
        <input type="radio" name="language" id="language-en" />
        <label htmlFor="language-en">English</label>
        <br /><br />
        <i>By clicking <b>Ok</b>, you consent to us saving a cookie on your device, which saves your language preference across sessions.
          <br />
          This is required for site functionality, and it is the only cookie used on this website.
        </i>
        <br /><br />
      </form>
      <button className="kickoff-info-button" onClick={() => {
        let english = document.getElementById("language-en");
        if (english.checked) {
          document.cookie = "language=en; path=/";
        } else {
          document.cookie = "language=se; path=/";
        }
        location.reload();
      }}>Ok</button>
    </div>
  </main>;
};

const SchedulePage = () => {
  return (
    <div className="page">
      <h1>Events</h1>
      <Schedule full={true} />
    </div>
  );
};

const NotFoundPage = () => {
  const textSe = "Sidan du försökte nå kunde inte hittas. Om du misstänker att detta är ett fel, vänligen skicka oss ett mail via ";
  const textEn = "The page you tried to reach could not be found. If you believe this is a mistake, please send us an email at ";
  return (
    <div className="page">
        <h1>404</h1>
        <p>{ isEnglish() ? textEn : textSe } <a href="mailto:styrelsen@dvet.se">styrelsen@dvet.se</a>.</p>
    </div>
  );
}

const Layout = (props) => {
  return (
    <div>
      <Toolbar />
      <Navbar />
      <main>
        { props.error ? <NotFoundPage /> : <Outlet /> }
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  { element: <Layout />, errorElement: <Layout error />, children: [
    { path: "/",           element: <HomePage /> },
    { path: "/contact",    element: <ContactPage /> },
    { path: "/about",      element: <AboutPage /> },
    { path: "/committees", element: <CommitteePage /> },
    { path: "/tools",      element: <ToolsPage /> },
    { path: "/documents",  element: <DocumentPage /> },
    { path: "/photos",     element: <PhotosPage /> },
    { path: "/schedule",   element: <SchedulePage /> },

    { path: "/committees/the-board",        element: <IndividualCommitteePage committee="the-board" /> },
    { path: "/committees/board-of-studies", element: <IndividualCommitteePage committee="board-of-studies" /> },
    { path: "/committees/mega6",            element: <IndividualCommitteePage committee="mega6" /> },
    { path: "/committees/concats",          element: <IndividualCommitteePage committee="concats" /> },
    { path: "/committees/femmepp",          element: <IndividualCommitteePage committee="femmepp" /> },
    { path: "/committees/dv_ops",           element: <IndividualCommitteePage committee="dv_ops" /> },
    { path: "/committees/dvarm",            element: <IndividualCommitteePage committee="dvarm" /> },
    { path: "/committees/mega7",            element: <IndividualCommitteePage committee="mega7" /> },

    { element: <GoogleAuth />, children: [
      { path: "/info-screen/edit", element: <EditInfoScreen />, loader: async () => await fetch("/getInfoScreenSlides") }
    ]}
  ]},
  { path: "/info-screen", element: <InfoScreen />, loader: async () => await fetch("/getInfoScreenSlides") },
  { path: "/newsscreen",  element: <NewsScreen /> },
  { path: "/scscreen",    element: <ScheduleScreen/> },
  
  { path: "/committees/dvrk",                   element: <DVRK.MainPage /> },
  { path: "/committees/dvrk/schedule",          element: <DVRK.SchedulePage /> },
  { path: "/committees/dvrk/schedule/bachelor", element: <DVRK.BachelorSchedulePage /> },
  { path: "/committees/dvrk/schedule/master",   element: <DVRK.MasterSchedulePage /> },
  { path: "/committees/dvrk/contact",           element: <DVRK.ContactPage /> },
  { path: "/committees/dvrk/form",              element: <DVRK.FormPage /> },
  { path: "/committees/dvrk/bachelor",          element: <DVRK.BachelorPage /> },
  { path: "/committees/dvrk/master",            element: <DVRK.MasterPage /> },
]);

const App = () => {
  return (
    <>
    { getLanguageCookie() ? <RouterProvider router={router} /> : <LanguageSelector /> }
    </>
  );
};

export default App;
