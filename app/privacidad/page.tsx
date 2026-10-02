import type { Metadata } from "next";

// Política de privacidad pública. Meta la exige (URL en la configuración
// de la app y en la revisión) para poder conectar cuentas de Instagram de
// clientes. Describe lo que hace la app de verdad: si cambia lo que se
// guarda o con quién se comparte, hay que actualizarla aquí.

export const metadata: Metadata = {
  title: "Política de privacidad · Nexalya",
};

const CONTACT_EMAIL = "infosemdesign@gmail.com";
const UPDATED = "1 de octubre de 2026";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-slate-800 mt-8 mb-2">{children}</h2>;
}

export default function PrivacyPage() {
  return (
    <article className="max-w-2xl mx-auto text-sm text-slate-600 leading-relaxed">
      <h1 className="text-2xl font-semibold text-slate-900">Política de privacidad</h1>
      <p className="text-xs text-slate-400 mt-1">Última actualización: {UPDATED}</p>

      <p className="mt-4">
        Nexalya es una herramienta de gestión de redes sociales que usan agencias de marketing para planificar el
        contenido de sus clientes y analizar sus resultados. Esta política explica qué datos tratamos, para qué y
        cómo puedes ejercer tus derechos.
      </p>

      <H2>1. Responsable y contacto</H2>
      <p>
        El responsable del tratamiento es el equipo que opera Nexalya. Para cualquier cuestión sobre privacidad
        puedes escribirnos a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-600 hover:underline">{CONTACT_EMAIL}</a>.
      </p>

      <H2>2. Qué datos tratamos</H2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>
          <strong>Usuarios del equipo:</strong> nombre, email y contraseña (guardada cifrada con un algoritmo de
          hash, nunca en texto legible), y la sesión iniciada.
        </li>
        <li>
          <strong>Clientes de la agencia:</strong> datos de marca facilitados por la agencia (nombre, sector, web,
          público objetivo, tono, etc.) y el contenido planificado.
        </li>
        <li>
          <strong>Cuentas de Instagram conectadas:</strong> cuando una cuenta profesional de Instagram autoriza el
          acceso, obtenemos su identificador y nombre de usuario, el número de seguidores, las publicaciones e
          historias publicadas (texto, enlace, miniatura, fecha y tipo) y sus estadísticas (alcance,
          visualizaciones, me gusta, comentarios, guardados, compartidos, visitas al perfil, respuestas y
          seguidores ganados), además del token de acceso que permite leerlas.
        </li>
      </ul>
      <p className="mt-2">
        No accedemos a mensajes directos, no vemos la contraseña de Instagram (el inicio de sesión se hace en la web
        de Instagram) y no publicamos nada en nombre de la cuenta con este acceso: es solo de lectura.
      </p>

      <H2>3. Para qué los usamos</H2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Mostrar a la agencia y a su cliente la analítica de la cuenta (resultados por publicación, evolución de seguidores, qué contenido funciona mejor).</li>
        <li>Generar propuestas de calendario de contenido basadas en esos resultados, con ayuda de inteligencia artificial.</li>
        <li>Mantener la cuenta del equipo y la seguridad del servicio.</li>
      </ul>
      <p className="mt-2">
        No vendemos datos, no los usamos para publicidad y no los cedemos a terceros salvo a los proveedores
        necesarios para prestar el servicio (apartado 5) o por obligación legal.
      </p>

      <H2>4. Base legal</H2>
      <p>
        Tratamos los datos para prestar el servicio contratado con la agencia (ejecución de contrato) y, en el caso
        de Instagram, con el consentimiento que da el titular de la cuenta al autorizar la conexión. Ese
        consentimiento se puede retirar en cualquier momento (apartado 7).
      </p>

      <H2>5. Proveedores que intervienen</H2>
      <ul className="list-disc pl-5 space-y-1.5">
        <li><strong>Meta Platforms</strong> (Instagram), de donde se obtienen los datos de la cuenta conectada.</li>
        <li><strong>Netlify</strong>, alojamiento de la aplicación.</li>
        <li><strong>Turso</strong>, base de datos donde se guarda la información.</li>
        <li>
          <strong>Anthropic</strong>, proveedor de la inteligencia artificial que genera las propuestas de contenido:
          recibe el resumen de resultados de la cuenta y los datos de marca necesarios para cada propuesta.
        </li>
      </ul>
      <p className="mt-2">
        Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo; en ese caso lo hacen
        con las garantías previstas en el RGPD, como las cláusulas contractuales tipo de la Comisión Europea.
      </p>

      <H2>6. Cuánto tiempo los conservamos</H2>
      <p>
        Mientras la agencia mantenga al cliente en Nexalya. Si se desconecta una cuenta de Instagram, se borra su
        token de acceso y deja de actualizarse; si se elimina el cliente, se borran también sus publicaciones y
        estadísticas guardadas.
      </p>

      <H2>7. Tus derechos y cómo eliminar tus datos</H2>
      <p>
        Puedes pedir acceso, rectificación, supresión, oposición, limitación o portabilidad de tus datos escribiendo a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-600 hover:underline">{CONTACT_EMAIL}</a>. Para
        eliminar los datos de una cuenta de Instagram conectada:
      </p>
      <ol className="list-decimal pl-5 space-y-1.5 mt-2">
        <li>
          Quita el acceso desde Instagram: Configuración → Seguridad → Apps y sitios web → Nexalya → Eliminar.
          Desde ese momento no podemos leer ningún dato nuevo.
        </li>
        <li>
          Escríbenos indicando el nombre de usuario de la cuenta y borraremos sus datos guardados en un plazo
          máximo de 30 días.
        </li>
      </ol>
      <p className="mt-2">
        Si consideras que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección
        de Datos (aepd.es).
      </p>

      <H2>8. Seguridad</H2>
      <p>
        Solo pueden ver los datos las personas del equipo de la agencia con usuario y contraseña en Nexalya, los
        tokens de acceso nunca se muestran en pantalla una vez guardados, y las comunicaciones van cifradas (HTTPS).
      </p>

      <H2>9. Cambios</H2>
      <p>Si cambiamos esta política, actualizaremos la fecha de arriba y lo indicaremos en esta misma página.</p>
    </article>
  );
}
