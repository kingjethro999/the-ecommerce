import { CustomerDetail } from "../components/customer-detail";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Customer Details</h1>
        <p className="text-muted-foreground">
          View customer information and order history
        </p>
      </div>
      <CustomerDetail userId={id} />
    </div>
  );
}
