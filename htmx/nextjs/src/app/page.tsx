import { dateFromLocalTime } from "@/time-util";
import { AddCard, Card, CardModal } from "./Card";

function CardList() {
  return (
    <div className="flex max-w-[75%] mx-auto justify-center gap-5">
      <Card
        title="Sixth East Park"
        shade={false}
        outlets={true}
        dayOpen={dateFromLocalTime("12:00")}
        dayClose={dateFromLocalTime("12:00")}
      />
      <Card
        title="two"
        shade={true}
        outlets={false}
        dayOpen={dateFromLocalTime("12:00")}
        dayClose={dateFromLocalTime("16:00")}
      />
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
  const info = props.searchParams?.info as string | undefined;

  return (
    <>
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold">NomadNooks</h1>
        <h2 className="text-xl">Find outdoor study and work spots</h2>
      </div>
      <CardList />
      <Footer />
      {info && <CardModal card={info} />}
    </>
  );
}
