import Button from "@mui/material/Button";
import Image from "next/image";
import HeroNavbar from "./hero-navbar";
import HeroFooter from "./hero-footer";

export default function Home() {
  return (
    <div className="bg-[#F7F4ED] h-screen flex flex-col">
      <HeroNavbar />

      <main className="flex flex-col md:flex-row items-center justify-between md:pl-24  flex-grow">
        <div className="w-full md:w-1/2 ml-28 text-left">
          <h1 className="text-[56px] md:text-8xl font-serif  leading-tight text-[#191919]">
            Human <br /> stories & ideas
          </h1>
          <p className="text-gray-800 text-[20px] mt-6">
            A place to read, write, and deepen your understanding
          </p>
          <Button
            sx={{ textTransform: "none" }}
            className="!bg-black !text-white mt-8 px-6 py-2 !rounded-full text-lg shadow-md text-transform-none"
          >
            Start reading
          </Button>
        </div>
        <div className="w-full md:w-1/2 flex justify-end items-center">
          <Image
            src="https://miro.medium.com/v2/format:webp/4*SdjkdS98aKH76I8eD0_qjw.png"
            alt="Decorative illustration"
            width={350}
            height={200}
            className="w-auto h-auto"
          />
        </div>
      </main>
      <HeroFooter />
    </div>
  );
}