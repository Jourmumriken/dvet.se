import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import text from "../../../content/committees/dvrk/dvrk.md";
import contact from "../../../content/committees/dvrk/dvrkcontact.md";
import textEn from "../../../content/committees/dvrk/dvrk-en.md";
import contactEn from "../../../content/committees/dvrk/dvrkcontact-en.md";
import { CalenderSchedule, Schedule } from "./widgets/schedule";
import "./../dvrk-styles.less";
import { NavLink, useNavigate } from "react-router-dom";
import DVRKLogo from "../../../assets/committee-logos/dvrk-logo.png";
import DURKMAN from "../../../assets/dvrk.jpg";
const DURKMAN_URL = "url(" + new String(DURKMAN) + ")";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { isEnglish } from "../util";
import Footer from "../components/navbar/footer";

// Yoinked from https://stackoverflow.com/a/21742107
const isIOS = () => {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return true;
    } else {
        return false;
    }
};

const documentOptions = [
    {
        label: <span>{isEnglish() ? "Bachelor" : "Kandidat"}</span>,
        value: "/committees/dvrk/bachelor"
    },
    {
        label: <span>Master</span>,
        value: "/committees/dvrk/master"
    }
];
const scheduleOptions = [
    {
        label: <span>{isEnglish() ? "Bachelor" : "Kandidat"}</span>,
        value: "/committees/dvrk/schedule/bachelor"
    },
    {
        label: <span>Master</span>,
        value: "/committees/dvrk/schedule/master"
    }
];
const DVRKbar = () => {
    const nav = useNavigate();
    const clickAction = (uri) => { nav(uri); window.scrollTo(0, 0); };
    let placeholderLanguage = isEnglish() ? "english" : "swedish";
    let documentDropdown = <Dropdown
        className="nav__dropdown_parent"
        controlClassName="nav__dropdown"
        placeholderClassName={"placeholder placeholder-document document-" + placeholderLanguage}
        options={documentOptions}
        onChange={v => { clickAction(v.value); }}
        // Edit this in the styles.less file instead (.placeholder::after),
        // this hack is done to avoid showing selected value in the dropdown.
        placeholder={<span>Dokument</span>}
    />;
    let scheduleDropdown = <Dropdown
        className="nav__dropdown_parent"
        controlClassName="nav__dropdown"
        placeholderClassName={"placeholder placeholder-schedule schedule-" + placeholderLanguage}
        options={scheduleOptions}
        onChange={v => { window.open(v.value, "_self"); }}
        // Edit this in the styles.less file instead (.placeholder::after),
        // this hack is done to avoid showing selected value in the dropdown.
        placeholder={<span>Dokument</span>}
    />;
    return <>
        <header className="dvrk-header" style={{ backgroundImage: DURKMAN_URL }}>
            <div className="header-text">
                <img draggable="false" src={DVRKLogo} />
            </div>
        </header>
        <nav className="dvrk-nav">
            <div>
                <NavLink className="nav__link" to="/committees/dvrk" end>
                    {isEnglish() ? "Home" : "Hem"}
                </NavLink>
                {scheduleDropdown}
                <NavLink className="nav__link" to="/committees/dvrk/contact" end>
                    {isEnglish() ? "Contact" : "Kontakt"}
                </NavLink>
                <NavLink className="nav__link" to="/committees/dvrk/form" end>
                    {isEnglish() ? "Form" : "Formulär"}
                </NavLink>
                {documentDropdown}
                <NavLink className="nav__link" to="/" end>
                    {isEnglish() ? "Back" : "Tillbaka"}
                </NavLink>
            </div>
        </nav>
    </>;
};

const IframePage = (props) => (
    isIOS() ?
        <>
            <button
                className="kickoff-info-button"
                onClick={() => window.open(props.url, "_this")}
                style={{ padding: "20px" }}
            >
                Click here to get to the document!
            </button>
        </>
        :
        <>
            <h1>{props.title}</h1>
            <iframe
                src={props.url}
                frameBorder="0"
                style={{
                    width: "100%",
                    height: "90vh",
                    overflow: "auto",
                    WebkitOverflowScrolling: "touch",
                }}
                scrolling="yes"
            >
            </iframe>
        </>
);

// If you know a better way to do this, plz pull request :)
const ContentHolder = (props) => (
    <div>
        <DVRKbar />
        <main>
            <div className="dvrk-page">
                {props.element}
            </div>
        </main>
        <Footer />
    </div>
);

const MainPage = () => {
    return (
        <ContentHolder element={
            /* <Schedule eventUrl="/getKickOffEvents" restUrl="/committees/dvrk/schedule" /> */
            <ReactMarkdown children={isEnglish() ? textEn : text} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
        } />
    );
};

const ContactPage = () => {
    return (
        <ContentHolder element={
            <ReactMarkdown children={isEnglish() ? contactEn : contact} rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}></ReactMarkdown>
        } />
    );
};

const SchedulePage = (props) => {
    return (
        <>
            <ContentHolder element={
                <>
                    <h1>{props.title ?? "Schedule"}</h1>
                    <CalenderSchedule full={false} eventUrl={"/getKickoffEvents" + (props.extension ?? "")} />
                    {/* <Schedule full={true} eventUrl={"/getKickoffEvents" + (props.extension ?? "")} /> */}
                    <div style={{ height: "2em" }}></div>
                </>
            } />
        </>

    );
};

const BachelorSchedulePage = () =>
    <SchedulePage extension="?type=Kandidat" title={isEnglish() ? "Bachelor schedule" : "Kandidatschema"} />;

const MasterSchedulePage = () =>
    <SchedulePage extension="?type=Master" title="Master schedule" />;

const FormPage = () => {
    return (
        <IframePage
            url="https://forms.gle/yTBk3hzc1X6qwDzY6" // TODO: must have a survey in English
            title={isEnglish() ? "Recentiors declaration!" : "Recentiorsdeklarationen!"}
        />
    );
};

const BachelorPage = () => {
    return (
        <ContentHolder element={
            <IframePage
                url="/recceguiden"
                title={isEnglish() ? "Reception guide for bachelor students!" : "Recceguiden för kandidater!"}
            />
        } />
    );
};

const MasterPage = () => {
    return (
        <ContentHolder element={
            <IframePage
                url="/masterguide"
                title="Receptionguide for master students!"
            />
        } />
    );
};

export default { MainPage, ContactPage, SchedulePage, BachelorSchedulePage, MasterSchedulePage, FormPage, BachelorPage, MasterPage };
