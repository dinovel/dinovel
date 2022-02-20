import { HomeView } from "../views/home.ts";
import { ResourcesView } from "../views/resources.ts";

export const AppRouter = {
  home: HomeView,
  resources: ResourcesView,
}

export type RouterLink = {
  name: keyof typeof AppRouter;
  text: string;
}

export const AppRouterNames: RouterLink[] = [{
  name: 'home',
  text: 'Home',
}, {
  name: 'resources',
  text: 'Resources',
}]
