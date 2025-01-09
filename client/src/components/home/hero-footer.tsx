import Link from "next/link";

export default function HeroFooter() {
  return (
    <div>
      <footer className="flex justify-center items-center px-6 py-4 border-t border-gray-800 text-sm text-gray-500">
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-black">
            Help
          </Link>
          <Link href="/" className="hover:text-black">
            Status
          </Link>
          <Link href="/" className="hover:text-black">
            About
          </Link>
          <Link href="/" className="hover:text-black">
            Careers
          </Link>
          <Link href="/" className="hover:text-black">
            Privacy
          </Link>
          <Link href="/" className="hover:text-black">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
