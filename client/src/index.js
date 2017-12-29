// @flow
import registerServiceWorker from './registerServiceWorker'

import './index.css'
import * as routes from './common/config/routes'
import store from './common/store'

routes.map(store.getState().routing.basePath)
registerServiceWorker()
