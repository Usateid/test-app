export default function ScrollableCards({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2 pb-4 overflow-x-auto hide-scrollbar px-4">
      {children}
    </div>
  );
}
