import HomePage from "@/components/homePage";

export const metadata = {
  title: "DNS Guard",
  description: "Real-time Network Vulnerabilities Checker",
};

export default function Home() {
  return (
    <div className="container mx-auto h-screen w-full items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:px-20 pt-8 font-[family-name:var(--font-geist-sans)]">
      <HomePage />
    </div>
  );
}
