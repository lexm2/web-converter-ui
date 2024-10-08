import Tables from "views/Dashboard/Tables.js";
import LoadDeck from "views/Pages/LoadDeck.js";
import Dashboard from "views/Dashboard/Dashboard.js";

import {
  StatsIcon,
  DocumentIcon,
} from "components/Icons/Icons";

var dashRoutes = [
  {
    path: "/tables",
    name: "Tables",
    icon: <StatsIcon color='inherit' />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/loaddata",
    name: "Load Deck",
    icon: <DocumentIcon color='inherit' />,
    component: LoadDeck,
    layout: "/auth",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <StatsIcon color='inherit' />,
    component: Dashboard,
    layout: "/admin",
  },
];

export default dashRoutes;