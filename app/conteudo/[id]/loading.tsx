import { Header } from "@/components/layout/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CarregandoConteudo() {
  return (
    <>
      <Header />
      <main>
        <Skeleton className="h-[50vh] min-h-[380px] w-full rounded-none sm:h-[62vh]" />
        <div className="container -mt-32 pb-20 sm:-mt-48">
          <div className="flex flex-col gap-8 lg:flex-row">
            <Skeleton className="mx-auto aspect-[2/3] w-48 shrink-0 rounded-lg sm:w-64 lg:mx-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-24 w-full max-w-2xl" />
              <Skeleton className="h-12 w-64" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
