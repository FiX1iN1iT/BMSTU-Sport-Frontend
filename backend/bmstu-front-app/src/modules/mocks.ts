import { Section, SectionsResult } from "./bmstuSportApi";

export const SECTION_MOCK: Section = {
    pk: 0,
    title: "mock-Футбол",
    description: "У этой секции нет описания",
    location: "СК МГТУ",
    date: "2024-10-22",
    instructor: "Петров Петр Петрович",
    duration: 90,
    imageUrl: "http://127.0.0.1:9000/bmstu-sport/1.png"
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
            imageUrl: "http://127.0.0.1:9000/bmstu-sport/1.png"
        }
    ],
    number_of_sections: 0,
    draft_application_id: 0
};
  
