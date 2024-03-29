import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://rinae.dev/",
  author: "Dohyung Ahn (안도형)",
  desc: "평범한 개발자가 배우고 느낀 것을 기록하는 공간입니다.",
  title: "리내로그",
  lightAndDarkMode: true,
  postPerPage: 7,
};

export const LOCALE = {
  lang: "ko", // html lang code. Set this empty and default will be "en"
  langTag: ["ko-KR"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/adhrinae",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/adh.rinae",
    linkTitle: `${SITE.title} on Facebook`,
    active: false,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/adhrinae",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:me@rinae.dev",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: "X",
    href: "https://x.com/adhrinae",
    linkTitle: `${SITE.title} on X`,
    active: true,
  },
];
