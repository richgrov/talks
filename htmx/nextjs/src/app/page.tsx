import Image from "next/image";
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

interface CardProps {
  title: string;
  shade: boolean;
  outlets: boolean;
  dayOpen: Date;
  dayClose: Date;
}

function dateHoursMins(date: Date) {
  return date.toLocaleTimeString(navigator.language, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function CheckXLabel(props: { name: string; value: boolean }) {
  return (
    <div className="flex flex-row items-center">
      {props.value ? (
        <CheckIcon width={32} color="green" />
      ) : (
        <XMarkIcon width={32} color="darkred" />
      )}{" "}
      {props.name}
    </div>
  );
}

function Button(props: { title: string; href: string }) {
  return (
    <Link
      className="bg-black text-white rounded-full px-3 py-2"
      href={props.href}
    >
      {props.title}
    </Link>
  );
}

function OpenIndicator(props: { open: boolean }) {
  return (
    <span
      className={`rounded-full border-2 py-1 px-2 text-sm max-w-fit ${props.open ? "border-green-600 text-green-600" : "border-red-500 text-red-500"}`}
    >
      {props.open ? "OPEN" : "CLOSED"}
    </span>
  );
}

function Card(props: CardProps) {
  const now = new Date();
  now.setUTCFullYear(1970, 0, 1);
  const openNow = now >= props.dayOpen && now < props.dayClose;

  return (
    <div className="bg-zinc-200 rounded-xl w-1/3 max-w-xl">
      <div className="flex flex-row gap-4 p-3">
        <h3 className="font-semibold text-lg">{props.title}</h3>
        <div className="ml-auto flex flex-col items-end">
          <OpenIndicator open={openNow} />
          {dateHoursMins(props.dayOpen)} - {dateHoursMins(props.dayClose)}
        </div>
      </div>
      <Image
        src="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
        alt="temp"
        width={800}
        height={800}
      />
      <div className="flex flex-row items-center gap-5 p-3">
        <CheckXLabel name="Shade" value={props.shade} />
        <CheckXLabel name="Outlets" value={props.outlets} />
        <div className="ml-auto">
          <Button title="More" href={`?info=${props.title}`} />
        </div>
      </div>
    </div>
  );
}

function AddCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl w-1/3 max-w-xl border-dotted border-zinc-500 border-4">
      <PlusIcon className="text-zinc-500" width={48} />
      <p className="text-lg">Submit your own!</p>
    </div>
  );
}

function CardList() {
  return (
    <div className="flex max-w-[75%] mx-auto justify-center gap-5">
      <Card
        title="Sixth East Park"
        shade={false}
        outlets={true}
        dayOpen={new Date("1970-01-01 12:00:00")}
        dayClose={new Date("1970-01-01 12:00:00")}
      />
      <Card
        title="two"
        shade={true}
        outlets={false}
        dayOpen={new Date("1970-01-01 12:00:00")}
        dayClose={new Date("1970-01-01 16:00:00")}
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

export default function Home() {
  return (
    <>
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold">NomadNooks</h1>
        <h2 className="text-xl">Find outdoor study and work spots</h2>
      </div>
      <CardList />
      <Footer />
    </>
  );
}
