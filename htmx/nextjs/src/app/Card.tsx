import { PlusIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import Button from "@/app/Button";
import { localTimeOfDay } from "@/time-util";
import RandomImage from "./RandomImage";
import { CheckXLabel, OpenIndicator } from "./indicators";

interface CardProps {
  id: number;
  title: string;
  shade: boolean;
  outlets: boolean;
  dayOpen: Date;
  dayClose: Date;
}

export function Card(props: CardProps) {
  const now = new Date();
  now.setUTCFullYear(1970, 0, 1);
  const openNow = now >= props.dayOpen && now < props.dayClose;

  return (
    <div className="bg-zinc-200 rounded-xl w-11/12 max-w-lg shadow-lg shadow-gray-400">
      <div className="flex flex-row gap-4 p-3">
        <h3 className="font-semibold text-lg">{props.title}</h3>
        <div className="ml-auto flex flex-col items-end">
          <OpenIndicator open={openNow} />
          {localTimeOfDay(props.dayOpen)} - {localTimeOfDay(props.dayClose)}
        </div>
      </div>
      <div className="h-56">
        <RandomImage className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-row items-center gap-5 p-3">
        <CheckXLabel name="Shade" value={props.shade} />
        <CheckXLabel name="Outlets" value={props.outlets} />
        <div className="ml-auto">
          <Button title="More" href={`?info=${props.id}`} />
        </div>
      </div>
    </div>
  );
}

export function AddCard() {
  return (
    <Link
      className="flex flex-col items-center justify-center rounded-xl w-1/3 max-w-xl border-dotted border-zinc-500 border-4"
      href="?new"
    >
      <PlusIcon className="text-zinc-500" width={48} />
      <p className="text-lg">Submit your own!</p>
    </Link>
  );
}
