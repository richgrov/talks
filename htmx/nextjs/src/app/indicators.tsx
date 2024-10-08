import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";

export function CheckXLabel(props: { name: string; value: boolean }) {
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

export function OpenIndicator(props: { open: boolean }) {
  return (
    <span
      className={`rounded-full border-2 py-1 px-2 text-sm max-w-fit ${props.open ? "border-green-600 text-green-600" : "border-red-500 text-red-500"}`}
    >
      {props.open ? "OPEN" : "CLOSED"}
    </span>
  );
}
