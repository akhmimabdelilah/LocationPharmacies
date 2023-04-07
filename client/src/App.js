import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
const Home = lazy(() => import('./pages/Home'));
const Cities = lazy(() => import('./pages/Cities'));
const Zones = lazy(() => import('./pages/Zones'));
const NoMatch = lazy(() => import('./components/NoMatch'));

const App = () => {
	return (
		<>
			<NavBar />
			<Suspense fallback={<div className="container">Loading...</div>}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/cities" element={<Cities />} />
					<Route path="/zones" element={<Zones />} />
					{/* <Route path="/products" element={<Products />} />
					<Route path="/products/:slug" element={<ProductDetails />} />*/}
					<Route path="*" element={<NoMatch />} /> 
				</Routes>
			</Suspense>
		</>
	);
};

export default App;