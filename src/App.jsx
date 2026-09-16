import { useState, useEffect } from "react";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";
import { APP_INFO } from "./config";
import {
  obtenerContactos,
  crearContacto,
  eliminarContacto,
  actualizarContacto,
} from "./api";

export default function App() {
  const [contactos, setContactos] = useState([]);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("A-Z");
  const [contactoEnEdicion, setContactoEnEdicion] = useState(null);

  const contactosFiltrados = contactos.filter((contacto) => {
    const texto = busqueda.toLowerCase().trim();

    return (
      contacto.nombre.toLowerCase().includes(texto) ||
      contacto.correo.toLowerCase().includes(texto) ||
      contacto.etiqueta.toLowerCase().includes(texto)
    );
  });

  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const comparacion = a.nombre.localeCompare(b.nombre);

    return orden === "A-Z" ? comparacion : -comparacion;
  });

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

  const iniciarEdicion = (contacto) => {
    setError("");
    setContactoEnEdicion(contacto);
  };

  const cancelarEdicion = () => {
    setContactoEnEdicion(null);
  };

  const guardarEdicion = async (datosActualizados) => {
    try {
      setError("");

      const actualizado = await actualizarContacto(
        contactoEnEdicion.id,
        datosActualizados
      );

      setContactos((prev) =>
        prev.map((contacto) =>
          contacto.id === actualizado.id ? actualizado : contacto
        )
      );

      setContactoEnEdicion(null);
    } catch (error) {
      console.error("Error al actualizar contacto:", error);

      setError(
        "No se pudo actualizar el contacto. Verifica el estado del servidor e intenta nuevamente."
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
          <FormularioContacto
            onAgregar={agregarContacto}
            contactoEnEdicion={contactoEnEdicion}
            onGuardarEdicion={guardarEdicion}
            onCancelarEdicion={cancelarEdicion}
          />
        </section>

        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, correo o etiqueta..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="mt-3 w-full border border-gray-300 rounded-lg px-4 py-3"
          >
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
          </select>
        </section>

        <section className="space-y-4">
          {contactosOrdenados.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No se encontraron contactos.
            </p>
          ) : (
            contactosOrdenados.map((contacto) => (
              <ContactoCard
                key={contacto.id || contacto.correo}
                {...contacto}
                onEditar={iniciarEdicion}
                onEliminar={eliminarContactoPorCorreo}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}