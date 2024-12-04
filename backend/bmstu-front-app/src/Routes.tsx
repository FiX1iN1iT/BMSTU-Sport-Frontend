export const ROUTES = {
    HOME: "/",
    SECTIONS: "/sections",
    APPLICATIONS: "/applications",
    LOGIN: "/login",
	REGISTER: "/register",
	USER_DASHBOARD: "/account",
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "BMSTU Sport",
    SECTIONS: "Секции",
    APPLICATIONS: "Заявки",
    LOGIN: "Вход",
    REGISTER: "Регистрация",
    USER_DASHBOARD: "Профиль",
};
