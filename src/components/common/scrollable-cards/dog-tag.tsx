import { cn } from "@/lib/utils";

export default function DogTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "cursor-pointer hover:scale-105 transition-all duration-300 bg-white shadow-lg rounded-lg overflow-hidden border p-4 flex flex-col flex-shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}
