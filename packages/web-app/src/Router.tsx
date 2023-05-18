import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { routes } from 'src/utils/routes'

import { Docs } from './pages/docs/Docs'
import { Faucet } from './pages/faucet/Faucet'
import { Home } from './pages/home/Home'
import { Layout } from './pages/Layout'
import { NoMatch } from './pages/NoMatch'
import { Replay } from './pages/replay/Replay'
import { Train } from './pages/train/Train'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={routes.home} element={<Layout />}>
      <Route index element={<Home />} />
      <Route path={routes.faucet} element={<Faucet />} />
      <Route path={`${routes.train}/*`} element={<Train />} />
      <Route path={routes.docs} element={<Docs />} />
      <Route path={routes.replay} element={<Replay />} />
      <Route path="*" element={<NoMatch />} />
    </Route>,
  ),
)

export const Router = () => <RouterProvider router={router} />
