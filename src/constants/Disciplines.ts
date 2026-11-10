// Undergraduate programmes of Nigeria Maritime University, Okerenkoko, grouped by faculty.
// Source: ACADEMICS menu on the official site, https://nmu.edu.ng (checked November 2026).
export const DISCIPLINE_GROUPS = [
  {
    faculty: "Faculty of Engineering",
    programmes: [
      "B.Eng. Civil Engineering",
      "B.Eng. Electrical Engineering",
      "B.Eng. Marine Engineering",
      "B.Eng. Mechanical Engineering",
      "B.Eng. Petroleum & Gas Engineering",
    ],
  },
  {
    faculty: "Faculty of Environmental Management",
    programmes: [
      "B.Sc. Environmental Management & Pollution Control",
      "B.Sc. Fisheries & Aquaculture",
      "B.Sc. Marine Geology",
      "B.Sc. Meteorology & Climate Change",
    ],
  },
  {
    faculty: "Faculty of Transport",
    programmes: [
      "B.Sc. Marine Economics & Finance",
      "B.Sc. Nautical Science",
      "B.Sc. Port Management",
      "B.Sc. Transport & Logistics Management",
    ],
  },
  {
    faculty: "Faculty of Science",
    programmes: [
      "B.Sc. Biology",
      "B.Sc. Computer Science",
      "B.Sc. Industrial Chemistry",
      "B.Sc. Industrial Mathematics",
      "B.Sc. Industrial Physics",
    ],
  },
] as const;

export const DISCIPLINES: string[] = DISCIPLINE_GROUPS.flatMap((g) => g.programmes);

export const GRADUATION_YEARS = Array.from({ length: 15 }, (_, i) =>
  String(2027 - i)
);
