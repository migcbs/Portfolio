export default function ContactoPage() {
  return (
    <div className="px-4 sm:px-6 md:px-12 py-16 md:py-24 max-w-xl">
      <h1 className="text-3xl md:text-5xl font-normal mb-4 animate-blur-fade-up">Contacto</h1>
      <p className="text-gray-400 mb-10 animate-blur-fade-up" style={{ animationDelay: "100ms" }}>
        Cuéntame sobre tu proyecto y te responderé a la brevedad.
      </p>
      <form className="flex flex-col gap-4 animate-blur-fade-up" style={{ animationDelay: "200ms" }}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          disabled
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-gray-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          disabled
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-gray-500"
        />
        <textarea
          name="message"
          placeholder="Mensaje"
          rows={5}
          disabled
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-gray-500"
        />
        <button
          type="button"
          disabled
          className="bg-white text-black rounded-full font-medium py-3 opacity-50 cursor-not-allowed"
        >
          Envío disponible próximamente
        </button>
      </form>
    </div>
  );
}
