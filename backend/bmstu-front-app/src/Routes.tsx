export const ROUTES = {
    HOME: "/",
    SECTIONS: "/sections",
    APPLICATIONS: "/applications"
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    SECTIONS: "Секции",
    APPLICATIONS: "Заявки",
  };