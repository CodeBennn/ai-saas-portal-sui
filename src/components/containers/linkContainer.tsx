import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function LinksContainer() {
  const activedClass = "p-2 border-r border-gray-500 bg-blue-400/20";
  const defaultClass = "p-2";
  const router = useRouter();
  const currentPath = router.pathname; 
  
  return (
    <div className="flex border border-gray-500 text-blue-300 rounded-md mt-6 mb-4">
      <div className={currentPath === "/" ? activedClass : defaultClass}>
        <Link
          href="/"
          className="text-lg hover:text-gray-300 transition-colors"
        >
          Home
        </Link>
      </div>
      <div className={currentPath === "/tasks" ? activedClass : defaultClass}>
        <Link
          href="/tasks"
          className="text-lg hover:text-gray-300 text-white transition-colors"
        >
          Tasks
        </Link>
      </div>
    </div>
  );
}
