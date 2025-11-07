import { Link } from "react-router";
import Button from "../../components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center font-sans">
      <h1 className="animate-pulse text-9xl font-extrabold tracking-widest text-red-600">
        404
      </h1>

      <p className="mt-8 mb-6 text-lg text-gray-600">
        Maaf, kami tidak dapat menemukan halaman yang dicari.
      </p>

      <Link to="/">
        <Button className="inline-block rounded-sm border border-transparent bg-red-600 px-8 py-3 text-base leading-5 font-medium text-white shadow-lg transition-colors duration-200 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none">
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
}
