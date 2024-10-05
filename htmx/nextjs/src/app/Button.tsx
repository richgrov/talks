import Link from "next/link";

export default function Button(props: { title: string; href: string }) {
  return (
    <Link
      className="bg-black text-white rounded-full px-3 py-2"
      href={props.href}
    >
      {props.title}
    </Link>
  );
}
