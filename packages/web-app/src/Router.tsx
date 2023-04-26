import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Docs } from './pages/docs/Docs'
import { Faucet } from './pages/faucet/Faucet'
import { Home } from './pages/home/Home'
import { Layout } from './pages/Layout'
import { NoMatch } from './pages/NoMatch'
import { Replay } from './pages/replay/Replay'
import { Train } from './pages/train/Train'

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="faucet" element={<Faucet />} />
          <Route path="train/*" element={<Train />} />
          <Route path="docs" element={<Docs />} />
          <Route path="replay" element={<Replay />} />

          {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
