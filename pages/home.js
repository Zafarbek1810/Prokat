import Head from "next/head";
import DashLayout from "../src/Components/DashLayout";
import WithAuthComponent from "../src/Hocs/PrivateRoute";
import LoginPage from "../src/Components/Pages/LoginPage";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Prokat uz</title>
        <meta name="description" content="Prokat Uz" />
        <link rel="icon" href="/icons/logo.svg" />
      </Head>
        <LoginPage/>
    </div>
  );
}
