import { lazy, Suspense } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading";
import styles from "./pages/shared.module.css";

const Overview = lazy(() => import("./pages/overview"));
const Inbox = lazy(() => import("./pages/inbox"));
const Insights = lazy(() => import("./pages/insights"));
const NotFound = () => <section className={styles.notFound}><span>404</span><h1>We could not find that page.</h1><p>Return to the overview to keep exploring customer feedback.</p><Link to="/overview">Go to overview</Link></section>;

const AppRoutes = ({ pageProps }) => {
  const location = useLocation();
  return <Suspense key={location.pathname} fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="/overview" element={<Overview {...pageProps} />} />
      <Route path="/inbox" element={<Inbox {...pageProps} />} />
      <Route path="/insights" element={<Insights {...pageProps} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>;
};

export default AppRoutes;
