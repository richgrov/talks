import Image from "next/image";
import {
  CheckIcon,
  MapPinIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { dateFromLocalTime, localTimeOfDay } from "@/time-util";

interface CardProps {
  title: string;
  shade: boolean;
  outlets: boolean;
  dayOpen: Date;
  dayClose: Date;
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

function CardModal(props: { card: string }) {
  return (
    <dialog
      open
      className="fixed top-0 w-full h-full bg-opacity-50 bg-black flex items-center justify-center"
    >
      <div className="bg-white w-4/5 max-w-screen-sm mx-auto p-5 rounded-xl">
        <div className="flex">
          <h4 className="text-xl font-bold">{props.card}</h4>
          <Link href="/" className="ml-auto">
            <XMarkIcon width={36} />
          </Link>
        </div>
        <div className="flex overflow-x-scroll">
          <Image
            src="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
            alt="temp"
            width={500}
            height={500}
          />
          <Image
            src="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
            alt="temp"
            width={500}
            height={500}
          />
          <Image
            src="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
            alt="temp"
            width={500}
            height={500}
          />
        </div>
        <p className="flex items-center pt-5">
          <MapPinIcon width={32} />
          Address
        </p>
      </div>
    </dialog>
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
          {localTimeOfDay(props.dayOpen)} - {localTimeOfDay(props.dayClose)}
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
