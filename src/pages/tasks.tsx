import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import TasksContainer from "@/components/containers/tasksContainer";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export default function Tasks() {
  return (
    <main
      className={cn(
        "relative w-full min-h-svh h-full max-w-360 flex flex-col items-center justify-center mx-auto py-5 px-4 bg-gray-800",
        inter.className
      )}
    >
      <Header />
      <TasksContainer />
      <Footer />
    </main>
  );
}
