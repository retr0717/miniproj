import { Ellipsis } from "lucide-react"; // Import the loader spinner from lucide-react

export function Loader() {
  return (
    <div role="status" className="flex justify-center w-full pt-4">
      <Ellipsis className="w-8 h-8 text-blue-600 animate-spin dark:text-white-600" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}