
import { useState, useEffect } from "react";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

const API_URL = "http://localhost:3002/contactos";

export default function App() {
  const [contactos, setContactos] = useState([]);
  const [error, setError] = useState("");

  // Cargar contactos desde JSON Server
  useEffect(() => {
    const cargarContactos = async () => {
      try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
          throw new Error("Error al cargar los contactos");
        }

        const datos = await respuesta.json();
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

  // Agregar contacto usando JSON Server
  const agregarContacto = async (nuevoContacto) => {
    try {
      setError("");

      const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoContacto),
      });

      if (!respuesta.ok) {
        throw new Error("Error al guardar el contacto");
      }

      const creado = await respuesta.json();

      setContactos((prev) => [...prev, creado]);
    } catch (error) {
      console.error("Error al crear contacto:", error);

      setError(
        "No se pudo guardar el contacto. Verifica tu conexión o el estado del servidor e intenta nuevamente."
      );

      throw error;
    }
  };

  // Eliminar contacto
  const eliminarContacto = async (correo) => {
    try {
      setError("");

      const contacto = contactos.find(
        (contacto) => contacto.correo === correo
      );

      if (!contacto) return;

      const respuesta = await fetch(`${API_URL}/${contacto.id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("Error al eliminar el contacto");
      }

      setContactos((prev) =>
        prev.filter((contacto) => contacto.correo !== correo)
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
        Agenda ADSO v6
      </h1>

      <div className="max-w-4xl mx-auto">

        {/* MENSAJE GLOBAL DE ERROR */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* FORMULARIO */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <FormularioContacto onAgregar={agregarContacto} />
        </section>

        {/* LISTA DE CONTACTOS */}
        <section className="space-y-4">
          {contactos.map((contacto) => (
            <ContactoCard
              key={contacto.id || contacto.correo}
              {...contacto}
              onEliminar={eliminarContacto}
            />
          ))}
        </section>

      </div>
    </main>
  );
}
