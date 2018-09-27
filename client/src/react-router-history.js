/**
 * Standard way to supply history instance to the v4 react router
 *
 * Example :
 * import { Router } from 'react-router-dom';
 * import myMiniApppHistory from 'Common/react-router-history';
 *
 *
 * ReactDOM.render(
 * <Provider store={store}>
 *   <Router history={divisionsAppHistory}>
 *     <MyApp />
 *    </Router>
 *  </Provider>,
 *  document.getElementById('some-id')
 * );
 *
 * To change the current route programatically navigate to any route using this:
 *
 * import history from 'Common/react-router-history';
 *
 * history.push(`your/route/${anyRouteParams}`);
 *
 */

import createBrowserHistory from 'history/createBrowserHistory';

export default createBrowserHistory();
