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
        id: "highlights",
        title: "Highlights",
        file: "markdown/github-stats.md",
        icon: "i-ri:star-smile-line",
        excerpt: "A quick look into my profile."
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
        id: "byte-n-crypt",
        title: "Byte-N-Crypt",
        file: "https://raw.githubusercontent.com/Sagewiiz/Byte-N-Crypt/main/README.md",
        icon: "i-simple-icons:python",
        excerpt: "Encryption/crypto utilities and experiments.",
        link: "https://github.com/Sagewiiz/Byte-N-Crypt"
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
