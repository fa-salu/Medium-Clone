import Link from "next/link";

export default function HeroFooter() {
  return (
    <div>
      <footer className="flex justify-start md: justify-center items-center px-6 py-4 border-t border-gray-800 text-sm bg-black text-gray-500">
        <div className="flex space-x-4">
          <Link href="/" className="hidden md:flex hover:text-gray-400">
            Help
          </Link>
          <Link href="/" className="hidden md:flex hover:text-gray-400">
            Status
          </Link>
          <Link href="/" className="hover:text-gray-400">
            About
          </Link>
          <Link href="/" className="hover:text-gray-400">
            Careers
          </Link>
          <Link href="/" className="hover:text-gray-400">
            Privacy
          </Link>
          <Link href="/" className="hover:text-gray-400">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
