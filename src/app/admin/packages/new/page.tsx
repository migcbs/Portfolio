import { ServiceForm } from "../service-form";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nuevo paquete</h1>
      <ServiceForm action={createService} />
    </div>
  );
}
