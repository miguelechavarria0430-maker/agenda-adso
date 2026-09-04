import { useState, useEffect } from "react";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";
import { APP_INFO } from "./config";
import {
  obtenerContactos,
  crearContacto,
  eliminarContacto,
} from "./api";

export default function App() {
  const [contactos, setContactos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarContactos = async () => {
      try {
        const datos = await obtenerContactos();
        setContactos(datos);
      } catch (error) {
        console.error("Error al cargar contactos:", error);
        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté activo."
        );
      }
    };

    cargarContactos();
  }, []);

  const agregarContacto = async (nuevoContacto) => {
    try {
      setError("");

      const creado = await crearContacto(nuevoContacto);

      setContactos((prev) => [...prev, creado]);
    } catch (error) {
      console.error("Error al crear contacto:", error);

      setError(
        "No se pudo guardar el contacto. Verifica tu conexión o el estado del servidor e intenta nuevamente."
      );

      throw error;
    }
  };

  const eliminarContactoPorCorreo = async (correo) => {
    try {
      setError("");

      const contacto = contactos.find(
        (contactoActual) => contactoActual.correo === correo
      );

      if (!contacto) return;

      await eliminarContacto(contacto.id);

      setContactos((prev) =>
        prev.filter((contactoActual) => contactoActual.correo !== correo)
      );
    } catch (error) {
      console.error("Error al eliminar contacto:", error);

      setError(
        "No se pudo eliminar el contacto. Verifica el estado del servidor e intenta nuevamente."
      );
    }
  };

  return (
    <main className="min-h-screen py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">
        {APP_INFO.name} v{APP_INFO.version}
      </h1>

      <div className="max-w-4xl mx-auto">

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <FormularioContacto onAgregar={agregarContacto} />
        </section>

        <section className="space-y-4">
          {contactos.map((contacto) => (
            <ContactoCard
              key={contacto.id || contacto.correo}
              {...contacto}
              onEliminar={eliminarContactoPorCorreo}
            />
          ))}
        </section>

      </div>
    </main>
  );
}