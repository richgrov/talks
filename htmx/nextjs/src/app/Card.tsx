import Image from "next/image";
import {
  CheckIcon,
  MapPinIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import Button from "@/app/Button";
import { localTimeOfDay } from "@/time-util";
import { ReactNode } from "react";
import { revalidatePath } from "next/cache";
import { sql } from "@/sql";
import { z } from "zod";

interface CardProps {
  id: number;
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

function OpenIndicator(props: { open: boolean }) {
  return (
    <span
      className={`rounded-full border-2 py-1 px-2 text-sm max-w-fit ${props.open ? "border-green-600 text-green-600" : "border-red-500 text-red-500"}`}
    >
      {props.open ? "OPEN" : "CLOSED"}
    </span>
  );
}

function Dialog(props: { title: string; children: ReactNode }) {
  return (
    <dialog
      open
      className="fixed top-0 w-full h-full bg-opacity-50 bg-black flex items-center justify-center"
    >
      <div className="bg-white w-4/5 max-w-screen-sm mx-auto p-5 rounded-xl">
        <div className="flex">
          <h4 className="text-xl font-bold">{props.title}</h4>
          <Link href="/" className="ml-auto">
            <XMarkIcon width={36} />
          </Link>
        </div>
        {props.children}
      </div>
    </dialog>
  );
}

export async function CardModal(props: { card: number }) {
  const [place] = await sql`SELECT Name, Address
    FROM Nooks WHERE Id = ${props.card}`;

  return (
    <Dialog title={place.name}>
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
        {place.address}
      </p>
    </Dialog>
  );
}

export function Card(props: CardProps) {
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
          <Button title="More" href={`?info=${props.id}`} />
        </div>
      </div>
    </div>
  );
}

const FormSchema = z.object({
  name: z.string(),
  open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  address: z.string(),
  shade: z.coerce.boolean(),
  outlets: z.coerce.boolean(),
});

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

export function AddCardModal() {
  async function addPlace(formData: FormData) {
    "use server";

    const vals = FormSchema.parse({
      name: formData.get("name"),
      address: formData.get("address"),
      open: formData.get("open"),
      close: formData.get("close"),
      photos: formData.get("photos"),
      shade: formData.get("shade"),
      outlets: formData.get("outlets"),
    });

    await sql.begin(async (sql) => {
      const [row] = await sql`INSERT INTO Nooks(Name, Open, Close, Address)
        VALUES (${vals.name}, ${vals.open}, ${vals.close}, ${vals.address})
        RETURNING Id`;
      console.log(row);

      await sql`INSERT INTO Ammenities(Id, Shade, Outlets)
        VALUES (${row.id}, ${vals.shade}, ${vals.outlets})`;
    });

    revalidatePath("/");
  }
  return (
    <Dialog title="Submit a new Place">
      <form className="flex flex-col gap-3" action={addPlace}>
        <label>
          Name
          <input
            type="text"
            name="name"
            className="bg-zinc-200 rounded text-md p-2 outline-none w-full"
            required
          />
        </label>
        <label>
          Address
          <input
            type="text"
            name="address"
            className="bg-zinc-200 rounded text-md p-2 outline-none w-full"
            required
          />
        </label>
        <div className="flex gap-2">
          <label className="grow">
            Open
            <input
              type="time"
              name="open"
              className="bg-zinc-200 rounded text-md p-2 outline-none w-full"
              required
            />
          </label>
          <label className="grow">
            Close
            <input
              type="time"
              name="close"
              className="bg-zinc-200 rounded text-md p-2 outline-none w-full"
              required
            />
          </label>
        </div>
        <label>
          Photos
          <input
            type="file"
            name="photos"
            className="bg-zinc-200 rounded text-md p-2 outline-none w-full"
            required
          />
        </label>
        <div>
          <label>
            Shade
            <input
              type="checkbox"
              name="shade"
              className="bg-zinc-200 rounded text-md p-2 outline-none w-4 h-4 align-middle mx-2"
            />
          </label>
          <label>
            Outlets
            <input
              type="checkbox"
              name="outlets"
              className="bg-zinc-200 rounded text-md p-2 outline-none w-4 h-4 align-middle mx-2"
            />
          </label>
        </div>
        <input
          type="submit"
          className="bg-black text-white rounded text-md py-2"
        />
      </form>
    </Dialog>
  );
}
