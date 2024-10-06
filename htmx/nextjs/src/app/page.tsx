import { dateFromLocalTime } from "@/time-util";
import { AddCard, AddCardModal, Card, CardModal } from "./Card";
import postgres from "postgres";

const sql = postgres({
  database: "nooks",
  username: "test",
  password: "password",
});

async function CardList() {
  const places =
    await sql`SELECT Nooks.Id, Name, Open, Close, Shade, Outlets from Nooks JOIN Ammenities on (Nooks.ID = Ammenities.ID)`;

  return (
    <div className="flex max-w-[75%] mx-auto justify-center gap-5">
      {places.map((place) => (
        <Card
          key={place.id}
          title={place.name}
          shade={place.shade}
          outlets={place.outlets}
          dayOpen={dateFromLocalTime(place.open)}
          dayClose={dateFromLocalTime(place.close)}
        />
      ))}
      <AddCard />
    </div>
  );
}

function Footer() {
  return (
    <footer className="fixed bottom-0 p-2">
      Made for the talk <a className="underline">Rethinking Webdev with HTMX</a>{" "}
      by <a className="underline">Richard Grover</a>
    </footer>
  );
}

export default function Home(props: {
  searchParams: Record<string, string> | undefined;
}) {
  const createModal = props.searchParams?.new as string | undefined;
  const info = props.searchParams?.info as string | undefined;

  return (
    <>
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold">NomadNooks</h1>
        <h2 className="text-xl">Find outdoor study and work spots</h2>
      </div>
      <CardList />
      <Footer />
      {typeof createModal !== "undefined" ? (
        <AddCardModal />
      ) : (
        info && <CardModal card={info} />
      )}
    </>
  );
}
