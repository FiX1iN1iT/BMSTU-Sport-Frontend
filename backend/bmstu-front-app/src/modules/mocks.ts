import { Section, SectionsResult } from "./bmstuSportApi";

export const SECTION_MOCK: Section = {
    pk: 0,
    title: "mock-Футбол",
    description: "У этой секции нет описания",
    location: "СК МГТУ",
    date: "2024-12-01",
    instructor: "Петров Петр Петрович",
    duration: 90,
    imageUrl: ""
};

export const SECTIONS_MOCK: SectionsResult = {
    sections: [
        {
            pk: 0,
            title: "mock-Футбол",
            description: "У этой секции нет описания",
            location: "СК МГТУ",
            date: "2024-10-22",
            instructor: "Петров Петр Петрович",
            duration: 90,
            imageUrl: ""
        },
        {
            pk: 1,
            title: "mock-Хоккей",
            description: "У этой секции нет описания",
            location: "СК МГТУ",
            date: "2024-10-22",
            instructor: "Петров Петр Петрович",
            duration: 90,
            imageUrl: ""
        }
    ],
    number_of_sections: 0,
    draft_application_id: 0
};
  
