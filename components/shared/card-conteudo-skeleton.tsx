import { Skeleton } from "@/components/ui/skeleton";

export function CardConteudoSkeleton() {
  return (
    <div className="w-[160px] shrink-0 sm:w-[190px]">
      <Skeleton className="aspect-[2/3] w-full rounded-md" />
    </div>
  );
}
