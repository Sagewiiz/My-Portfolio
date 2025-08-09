import React, { lazy, Suspense } from "react";
import { appBarHeight } from "~/utils";
import type { AppsData } from "~/types";

const BearApp = lazy(() => import("~/components/apps/Bear"));
const TyporaApp = lazy(() => import("~/components/apps/Typora"));
const SafariApp = lazy(() => import("~/components/apps/Safari"));
const VSCodeApp = lazy(() => import("~/components/apps/VSCode"));
const FaceTimeApp = lazy(() => import("~/components/apps/FaceTime"));
const TerminalApp = lazy(() => import("~/components/apps/Terminal"));
const NotesApp = lazy(() => import("~/components/apps/Notes"));
const CalculatorApp = lazy(() => import("~/components/apps/Calculator"));

const withSuspense = (el: JSX.Element) => (
  <Suspense fallback={<div className="p-4 text-sm">Loading…</div>}>{el}</Suspense>
);

const apps: AppsData[] = [
  {
    id: "launchpad",
    title: "Launchpad",
    desktop: false,
    img: "img/icons/launchpad.png"
  },
  {
    id: "bear",
    title: "Bear",
    desktop: true,
    width: 860,
    height: 500,
    show: true,
    y: -40,
    img: "img/icons/bear.png",
    content: withSuspense(<BearApp />)
  },
  {
    id: "typora",
    title: "Typora",
    desktop: true,
    width: 600,
    height: 580,
    y: -20,
    img: "img/icons/typora.png",
    content: withSuspense(<TyporaApp />)
  },
  {
    id: "safari",
    title: "Safari",
    desktop: true,
    width: 1024,
    minWidth: 375,
    minHeight: 200,
    x: -20,
    img: "img/icons/safari.png",
    content: withSuspense(<SafariApp />)
  },
  {
    id: "vscode",
    title: "VSCode",
    desktop: true,
    width: 900,
    height: 600,
    x: 80,
    y: -30,
    img: "img/icons/vscode.png",
    content: withSuspense(<VSCodeApp />)
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    img: "img/icons/facetime.png",
    width: 500 * 1.7,
    height: 500 + appBarHeight,
    minWidth: 350 * 1.7,
    minHeight: 350 + appBarHeight,
    aspectRatio: 1.7,
    x: -80,
    y: 20,
    content: withSuspense(<FaceTimeApp />)
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    img: "img/icons/terminal.png",
    content: withSuspense(<TerminalApp />)
  },
  {
    id: "notes",
    title: "Notes",
    desktop: true,
    width: 600,
    height: 520,
    img: "img/icons/launchpad/notebook.png",
    content: withSuspense(<NotesApp />)
  },
  {
    id: "calculator",
    title: "Calculator",
    desktop: true,
    width: 320,
    height: 420,
    img: "img/icons/launchpad/meta.png",
    content: withSuspense(<CalculatorApp />)
  },
  {
    id: "github",
    title: "Github",
    desktop: false,
    img: "img/icons/github.png",
    link: "https://github.com/Sagewiiz"
  }
];

export default apps;
