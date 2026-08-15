import { PortfolioForm } from "../portfolio-form";
import { createPortfolioProject } from "../actions";

export default function NewPortfolioProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Nuevo proyecto</h1>
      <PortfolioForm action={createPortfolioProject} />
    </div>
  );
}
