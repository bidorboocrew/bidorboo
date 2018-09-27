import appHistory from './react-router-history';

export const switchRoute = routeAndParams => {
  appHistory.push(routeAndParams);
};
