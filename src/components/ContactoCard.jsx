export default function ContactoCard({
  id,
  nombre,
  telefono,
  correo,
  etiqueta,
  onEditar,
  onEliminar,
}) {
  const contacto = {
    id,
    nombre,
    telefono,
    correo,
    etiqueta,
  };

  return (
    <article className="tarjeta-contacto">
      <h3>{nombre}</h3>
      <p>📞 {telefono}</p>
      <p>✉️ {correo}</p>

      {etiqueta && <p>{etiqueta}</p>}

      <div className="acciones">
        <button
          className="btn-editar"
          onClick={() => onEditar(contacto)}
        >
          Editar
        </button>

        <button
          className="btn-eliminar"
          onClick={() => onEliminar(correo)}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}