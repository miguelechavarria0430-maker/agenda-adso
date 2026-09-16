import { useEffect, useState } from "react";

export default function FormularioContacto({
  onAgregar,
  contactoEnEdicion,
  onGuardarEdicion,
  onCancelarEdicion,
}) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    etiqueta: "",
  });

  const [errores, setErrores] = useState({
    nombre: "",
    telefono: "",
    correo: "",
  });

  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (contactoEnEdicion) {
      setForm({
        nombre: contactoEnEdicion.nombre || "",
        telefono: contactoEnEdicion.telefono || "",
        correo: contactoEnEdicion.correo || "",
        etiqueta: contactoEnEdicion.etiqueta || "",
      });

      setErrores({
        nombre: "",
        telefono: "",
        correo: "",
      });
    }
  }, [contactoEnEdicion]);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  function validarFormulario() {
    const nuevosErrores = {
      nombre: "",
      telefono: "",
      correo: "",
    };

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (!form.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    }

    if (!form.correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!form.correo.includes("@")) {
      nuevosErrores.correo = "El correo debe contener @.";
    }

    setErrores(nuevosErrores);

    return (
      !nuevosErrores.nombre &&
      !nuevosErrores.telefono &&
      !nuevosErrores.correo
    );
  }

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      telefono: "",
      correo: "",
      etiqueta: "",
    });

    setErrores({
      nombre: "",
      telefono: "",
      correo: "",
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const esValido = validarFormulario();

    if (!esValido) return;

    try {
      setEnviando(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (contactoEnEdicion) {
        await onGuardarEdicion(form);
      } else {
        await onAgregar(form);
        limpiarFormulario();
      }
    } finally {
      setEnviando(false);
    }
  };

  const cancelarEdicion = () => {
    limpiarFormulario();
    onCancelarEdicion();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre *
        </label>

        <input
          name="nombre"
          value={form.nombre}
          onChange={onChange}
          placeholder="Ej: Ana Pérez"
          className="mt-1 block w-full rounded-lg border border-gray-300 p-3"
        />

        {errores.nombre && (
          <p className="mt-1 text-xs text-red-600">
            {errores.nombre}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teléfono *
        </label>

        <input
          name="telefono"
          value={form.telefono}
          onChange={onChange}
          placeholder="Ej: 3001234567"
          className="mt-1 block w-full rounded-lg border border-gray-300 p-3"
        />

        {errores.telefono && (
          <p className="mt-1 text-xs text-red-600">
            {errores.telefono}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Correo *
        </label>

        <input
          name="correo"
          value={form.correo}
          onChange={onChange}
          placeholder="Ej: ana@sena.edu.co"
          className="mt-1 block w-full rounded-lg border border-gray-300 p-3"
        />

        {errores.correo && (
          <p className="mt-1 text-xs text-red-600">
            {errores.correo}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Etiqueta
        </label>

        <input
          name="etiqueta"
          value={form.etiqueta}
          onChange={onChange}
          placeholder="Ej: Compañero"
          className="mt-1 block w-full rounded-lg border border-gray-300 p-3"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-3">

        <button
          type="submit"
          disabled={enviando}
          className="w-full md:w-auto bg-purple-600 hover:bg-purple-700
          disabled:bg-purple-300 disabled:cursor-not-allowed
          text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
        >
          {enviando
            ? "Guardando..."
            : contactoEnEdicion
            ? "Guardar cambios"
            : "Agregar contacto"}
        </button>

        {contactoEnEdicion && (
          <button
            type="button"
            onClick={cancelarEdicion}
            className="w-full md:w-auto bg-gray-500 hover:bg-gray-600
            text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
          >
            Cancelar edición
          </button>
        )}

      </div>

    </form>
  );
}