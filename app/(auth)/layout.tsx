export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-8">{children}</div>;
}
