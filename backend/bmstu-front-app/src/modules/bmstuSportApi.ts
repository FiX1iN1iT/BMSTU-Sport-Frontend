export interface Section {
    pk: number;
    title: string;
    description: string;
    location: string;
    date: string;
    instructor: string;
    duration: number;
    imageUrl: string;
}

export const getSection = async (
    id: number | string
): Promise<Section> => {
    return fetch(`/api/sections/${id}/`).then(
        (response) => response.json()
    );
};

export interface SectionsResult {
    sections: Section[];
    draft_application_id: number;
    number_of_sections: number
}

export const getSections = async (section_title = ""): Promise<SectionsResult> => {
    return fetch(`/api/sections/?section_title=${section_title}`).then(
        (response) => response.json()
    );
};

export const addSectionToDraft = async (section_id: number): Promise<Boolean> => {
    return fetch(`/api/applications/draft/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({section_id: section_id})
    })
    .then(
        (response) => response.ok
    );
};

export interface Application {
    pk: number;
    status: string;
    creation_date: string;
    apply_date: string | null;
    end_date: string | null;
    creator: string;
    moderator: string | null;
    full_name: string | null;
    number_of_sections: number | null;
}

export interface ApplicationResult {
    application: Application;
    sections: Section[];
}

export const getApplication = async (
    id: number | string
): Promise<ApplicationResult> => {
    return fetch(`/api/applications/${id}/`).then(
        (response) => response.json()
    );
};

export const deleteApplication = async (id: number): Promise<Response> => {
    return fetch(`/api/applications/${id}/`, {
        method: 'DELETE'
    })
    .then(
        (response) => response.json()
    );
};

export const editApplication = async (id: number | string, full_name: string): Promise<Response> => {
    return fetch(`/api/applications/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({full_name: full_name})
    })
    .then(
        (response) => response.json()
    );
};

export const higherPriority = async (application_id: number, section_id: number): Promise<Response> => {
    return fetch(`/api/applications/${application_id}/priority/${section_id}`, {
        method: 'PUT'
    })
    .then(
        (response) => response.json()
    );
};

export const deletePriority = async (application_id: number, section_id: number): Promise<Response> => {
    return fetch(`/api/applications/${application_id}/priority/${section_id}`, {
        method: 'DELETE'
    })
    .then(
        (response) => response.json()
    );
};

export const submitApplication = async (id: number): Promise<Response> => {
    return fetch(`/api/applications/${id}/submit`, {
        method: 'PUT'
    })
    .then(
        (response) => response.json()
    );
};
