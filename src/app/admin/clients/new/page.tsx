import { ClientForm } from "../client-form";
import { createClient } from "../actions";

export default function NewClientPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nuevo cliente</h1>
      <ClientForm action={createClient} />
    </div>
  );
}
