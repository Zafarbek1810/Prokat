import Head from "next/head";
import WithAuthComponent from "../src/Hocs/PrivateRoute";
import DashLayout from "../src/Components/DashLayout";
import Booking from "../src/Components/Pages/Booking";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Prokat uz</title>
        <meta name="description" content="Prokat Uz" />
        <link rel="icon" href="/icons/logo.svg" />
      </Head>
      <WithAuthComponent>
        <DashLayout>
          <Booking />
        </DashLayout>
      </WithAuthComponent>
    </div>
  );
}

// Static export: no server-side translations
