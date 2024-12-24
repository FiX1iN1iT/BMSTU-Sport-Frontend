import { gql } from '@apollo/client';

export interface SectionV2 {
    id?: number;
    title: string;
    description?: string;
    location?: string;
    date?: string;
    instructor?: string;
    duration?: number;
    imageUrl?: string;
}

export interface SportApplicationV2 {
    id: string;
    status: string;
    creationDate?: string;
    applyDate?: string;
    endDate?: string;
    user?: { email: string };
    numberOfSections?: number;
    fullName?: string;
}

export interface UserV2 {
    id?: string;
    email: string;
    password: string;
    isStaff?: boolean;
    isSuperuser?: boolean;
    firstName?: string;
    lastName?: string;
}

export const FETCH_SECTIONS = gql`
    query FetchSections($sectionTitle: String) {
        sections(sectionTitle: $sectionTitle) {
            id
            title
            description
            location
            date
            instructor
            duration
            imageUrl
        }
        draftApplicationId
        numberOfSections
    }
`;

export const CREATE_SECTION = gql`
    mutation CreateSection($title: String!) {
        createSection(title: $title) {
            section {
                id
                title
                description
                location
                date
                instructor
                duration
                imageUrl
            }
        }
    }
`;

export const ADD_SECTION_TO_DRAFT = gql`
    mutation AddSectionToDraft($sectionId: Int!) {
        addSectionToDraft(sectionId: $sectionId) {
            response {
                draftApplicationId
                numberOfSections
            }
        }
    }
`;

export const FETCH_SECTION = gql`
    query FetchSection($id: Int!) {
        section(id: $id) {
            id
            title
            description
            location
            date
            instructor
            duration
            imageUrl
        }
    }
`;


export const UPDATE_SECTION = gql`
    mutation UpdateSection($id: Int!, $title: String, $description: String, $location: String, $date: String, $instructor: String, $duration: Int) {
        updateSection(id: $id, title: $title, description: $description, location: $location, date: $date, instructor: $instructor, duration: $duration) {
            section {
                id
                title
                description
                location
                date
                instructor
                duration
            }
        }
    }
`;

export const DELETE_SECTION = gql`
    mutation DeleteSection($id: Int!) {
        deleteSection(id: $id) {
            success
        }
    }
`;

export const FETCH_APPLICATIONS = gql`
    query FetchApplications($status: String, $startApplyDate: String, $endApplyDate: String) {
        applications(status: $status, startApplyDate: $startApplyDate, endApplyDate: $endApplyDate) {
            id
            user {
                email
            }
            status
            creationDate
            applyDate
            endDate
            fullName
            numberOfSections
        }
    }
`;

export const CHANGE_STATUS = gql`
    mutation ApplicationApproveReject($applicationId: String!, $status: String!) {
        approveRejectApplication(applicationId: $applicationId, status: $status) {
            application {
                id
                status
            }
        }
    }
`;

export const FETCH_APPLICATION = gql`
    query FetchApplication($applicationId: Int!) {
        applicationDetail(applicationId: $applicationId) {
            id
            user {
                email
            }
            status
            creationDate
            applyDate
            endDate
            fullName
            numberOfSections
        }
        sectionsByApplication(applicationId: $applicationId) {
            id
            title
            description
            location
            date
            instructor
            duration
            imageUrl
        }
    }
`;

export const UPDATE_APPLICATION = gql`
    mutation UpdateApplication($applicationId: Int!, $input: UpdateApplicationInput!) {
        updateApplication(applicationId: $applicationId, input: $input) {
            application {
                id
                user {
                    email
                }
                status
                creationDate
                applyDate
                endDate
                fullName
                numberOfSections
            }
        }
    }
`;

export const DELETE_APPLICATION = gql`
    mutation DeleteApplication($applicationId: Int!) {
        deleteApplication(applicationId: $applicationId) {
            success
        }
    }
`;

export const SUBMIT_APPLICATION = gql`
    mutation SubmitApplication($applicationId: Int!) {
        submitApplication(applicationId: $applicationId) {
            success
        }
    }
`;

export const REMOVE_SECTION = gql`
    mutation RemoveSection($applicationId: Int!, $sectionId: Int!) {
        removeSection(applicationId: $applicationId, sectionId: $sectionId) {
            sectionsByApplication {
                id
                title
                description
                location
                date
                instructor
                duration
                imageUrl
            }
        }
    }
`;

export const INCREASE_PRIORITY = gql`
    mutation IncreasePriority($applicationId: Int!, $sectionId: Int!) {
        increasePriority(applicationId: $applicationId, sectionId: $sectionId) {
            sectionsByApplication {
                id
                title
                description
                location
                date
                instructor
                duration
                imageUrl
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                id
                email
                isStaff
                isSuperuser
            }
        }
    }
`;

export const LOGOUT_USER = gql`
    mutation Logout {
        logout {
            success
        }
    }
`;
