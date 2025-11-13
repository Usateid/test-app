import { cn } from "@/lib/utils";

export default function PageLayout({
  children,
  title,
  description,
  cta,
  usePadding = false,
}: {
  title?: string;
  description?: string;
  cta?: React.ReactNode;
  children: React.ReactNode;
  usePadding?: boolean;
}) {
  return (
    <div className={cn(usePadding && "mt-4 px-2 space-y-6")}>
      {title && description && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          {cta && <div className="flex items-center justify-end">{cta}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
