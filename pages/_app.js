import { ToastContainer } from 'react-toastify'
import { UserContextProvider } from '../src/Context/UserContext'
import '../styles/globals.css'
import { GlobalStyle } from '../styles/globalStyle'
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLayoutEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { appWithTranslation } from 'next-i18next';
// import "../public/assets/css/themes/lite-purple.min.css"
// import "../public/assets/css/plugins/perfect-scrollbar.min.css"
import 'rsuite/dist/rsuite.min.css';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true)

  useLayoutEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])

  return (
    <>
      <Head>
        <meta name="description" content="Dargoh markaz" />
        <link rel="icon" href="/icons/logo.svg" />
                <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,400i,600,700,800,900" rel="stylesheet" />
        <link href="/assets/css/themes/lite-purple.min.css" rel="stylesheet" />
        <link href="/assets/css/plugins/perfect-scrollbar.min.css" rel="stylesheet" />
        <link href="/assets/css/plugins/bootstrap/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/css/plugins/ladda-themeless.min.css" />
      </Head>
      <UserContextProvider>
        <Component {...pageProps} />
        {/* {loading && <Loader />} */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </UserContextProvider>
      <GlobalStyle />




      <Script defer src="/assets/js/plugins/jquery-3.3.1.min.js" strategy="afterInteractive"></Script>
      <Script defer src="/assets/js/plugins/bootstrap.bundle.min.js" strategy="afterInteractive"></Script>
      <Script defer src="/assets/js/plugins/perfect-scrollbar.min.js" strategy="afterInteractive"></Script>
      <Script defer src="/assets/js/scripts/tooltip.script.min.js" strategy="lazyOnload"></Script>
      <Script defer src="/assets/js/scripts/script.min.js" strategy="lazyOnload"></Script>
      <Script defer src="/assets/js/scripts/script_2.min.js" strategy="lazyOnload"></Script>
      <Script defer src="/assets/js/scripts/sidebar.large.script.min.js" strategy="lazyOnload"></Script>
      <Script defer src="/assets/js/plugins/feather.min.js" strategy="lazyOnload"></Script>
      <Script defer src="/assets/js/plugins/metisMenu.min.js" strategy="lazyOnload"></Script>
      <Script defer src="/assets/js/scripts/layout-sidebar-vertical.min.js" strategy="lazyOnload"></Script>
    </>
  )

}


export default appWithTranslation(MyApp)
