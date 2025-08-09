import type { BearData } from "~/types";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-fa-solid:user",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-la:id-badge",
        excerpt: "Brief intro and contact details."
      },
      {
        id: "github-stats",
        title: "GitHub Stats",
        file: "markdown/github-stats.md",
        icon: "i-icon-park-outline:github",
        excerpt: "Some quick stats from my GitHub profile."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-octicon:browser",
        excerpt: "Stack and credits for this portfolio."
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-octicon:repo",
    md: [
      {
        id: "class-companion",
        title: "Class Companion",
        file: "https://raw.githubusercontent.com/Sagewiiz/Class-Companion/main/README.md",
        icon: "i-bx:bot",
        excerpt: "AI‑powered classroom assistant robot (voice, OpenCV, PyQt).",
        link: "https://github.com/Sagewiiz/Class-Companion"
      },
      {
        id: "loan-genie",
        title: "Loan-Genie",
        file: "https://raw.githubusercontent.com/Sagewiiz/Loan-Genie/master/README.md",
        icon: "i-gg:credit-card",
        excerpt: "ML‑powered loan approval prediction system.",
        link: "https://github.com/Sagewiiz/Loan-Genie"
      },
      {
        id: "pathfinder",
        title: "PathFinder",
        file: "https://raw.githubusercontent.com/Sagewiiz/PathFinder/master/README.md",
        icon: "i-tabler:route",
        excerpt: "Career guidance using LLMs & real‑time avatar interaction.",
        link: "https://github.com/Sagewiiz/PathFinder"
      },
      {
        id: "techxcelerate",
        title: "TechXcelerate",
        file: "https://raw.githubusercontent.com/Sagewiiz/TechXcelerate/main/README.md",
        icon: "i-simple-icons:bootstrap",
        excerpt: "AI theme/site work.",
        link: "https://github.com/Sagewiiz/TechXcelerate"
      },
      {
        id: "dataflow",
        title: "DataFlow File Manager",
        file: "https://raw.githubusercontent.com/Sagewiiz/DataFlow-File-Manager/master/README.md",
        icon: "i-bx:data",
        excerpt: "Minimal, efficient file manager.",
        link: "https://github.com/Sagewiiz/DataFlow-File-Manager"
      },
      {
        id: "portfolio",
        title: "Portfolio (this site)",
        file: "https://raw.githubusercontent.com/Sagewiiz/Portfolio/main/README.md",
        icon: "i-ri:gamepad-line",
        excerpt: "macOS‑style portfolio customized for me.",
        link: "https://github.com/Sagewiiz/Portfolio"
      }
    ]
  }
];

export default bear;
