export default function Footer({ agencyBrand }: { agencyBrand: string }) {
  return (
    <footer className="relative z-10 px-4 sm:px-6 md:px-12 py-8 text-sm text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
      <span>© {new Date().getFullYear()} Miguel Ceballos — Portafolio</span>
      <span>{agencyBrand}</span>
    </footer>
  );
}
