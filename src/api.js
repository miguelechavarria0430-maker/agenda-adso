import { API_BASE_URL } from "./config";

export const obtenerContactos = async () => {
  const respuesta = await fetch(`${API_BASE_URL}/contactos`);

  if (!respuesta.ok) {
    throw new Error("Error al cargar los contactos");
  }

  return respuesta.json();
};

export const crearContacto = async (nuevoContacto) => {
  const respuesta = await fetch(`${API_BASE_URL}/contactos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoContacto),
  });

  if (!respuesta.ok) {
    throw new Error("Error al guardar el contacto");
  }

  return respuesta.json();
};

export const eliminarContacto = async (id) => {
  const respuesta = await fetch(`${API_BASE_URL}/contactos/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("Error al eliminar el contacto");
  }
};

export const actualizarContacto = async (id, data) => {
  const respuesta = await fetch(`${API_BASE_URL}/contactos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar el contacto");
  }

  return respuesta.json();
};