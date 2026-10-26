// Textos legales en español argentino (es-AR). Misma estructura que ./content (portugués).
// Marco: Ley 25.326 de Protección de los Datos Personales, Ley 24.240 de Defensa del Consumidor
// y Código Civil y Comercial. Datos fijos de la empresa en ./company.
import { company as c } from './company';
import { Ul } from './content';
import type { LegalDoc } from './content';

const mail = <a href={`mailto:${c.ar.email}`} className="underline text-primary">{c.ar.email}</a>;
const wa = <a href={c.ar.whatsappUrl} target="_blank" rel="noreferrer" className="underline text-primary">{c.ar.whatsappLabel}</a>;
const sitio = (u: string) => u.replace('https://', '');

export const privacidadEs: LegalDoc = {
  title: 'Política de Privacidad',
  intro: (
    <p>
      Esta política explica, en palabras simples, cómo {c.legalName} («{c.tradeName}», CNPJ {c.cnpj}, con sede en Brasil) trata tus
      datos personales en {sitio(c.site)}, {sitio(c.platform)} y {sitio(c.store)}. Se rige por la Ley 25.326 de Protección de los Datos
      Personales de la República Argentina y, cuando corresponde, por la Ley General de Protección de Datos de Brasil (LGPD, Ley 13.709/2018).
    </p>
  ),
  sections: [
    {
      id: 'responsable',
      title: '1. Quién es el responsable',
      body: (
        <>
          <p>{c.legalName}, CNPJ {c.cnpj}, nombre comercial {c.tradeName}. Para cualquier consulta sobre privacidad: {mail} o WhatsApp {wa}.</p>
          <p>Persona a cargo de la protección de datos: {c.dpoName}, en el mismo correo.</p>
        </>
      ),
    },
    {
      id: 'datos',
      title: '2. Qué datos recopilamos y para qué',
      body: (
        <>
          <p>Pedimos solo lo necesario para cada finalidad:</p>
          <Ul
            items={[
              <><strong>Formularios de contacto, interés y cupón:</strong> nombre, correo, teléfono (con código de país), cursos de interés y el mensaje que escribas. Los usamos para responderte, avisarte de las clases y enviarte el cupón de bienvenida. Base: tu consentimiento.</>,
              <><strong>Reserva y compra de cursos (tienda):</strong> nombre, apellido, teléfono y correo; el documento de identidad se ingresa directamente en el pago. Lo usamos para confirmar tu lugar, emitir comprobantes y certificados y cumplir obligaciones fiscales. Base: ejecución del contrato y obligación legal.</>,
              <><strong>Pedidos por WhatsApp:</strong> tu número y los mensajes que nos envíes, para atenderte y reservar tu lugar.</>,
              <><strong>Registros de acceso:</strong> como en cualquier sitio, los servidores registran la IP, la fecha y la hora de cada acceso. Los guardamos por el plazo mínimo que exige la ley brasileña (6 meses) y solo los usamos para seguridad y para cumplir órdenes judiciales.</>,
              <><strong>Seguridad del sitio:</strong> limitamos la cantidad de envíos de formulario por minuto y usamos un campo invisible contra robots. No te identifican.</>,
              <><strong>Estadísticas de visita (solo si aceptás):</strong> páginas vistas, tipo de dispositivo y origen aproximado, de forma agregada, mediante Google Analytics 4.</>,
            ]}
          />
          <p>No pedimos datos sensibles (salud, religión, origen étnico, etc.) ni recopilamos datos de menores de 18 años; si llegara a ocurrir por error, los eliminamos apenas nos enteremos.</p>
        </>
      ),
    },
    {
      id: 'compartimos',
      title: '3. Con quién los compartimos',
      body: (
        <>
          <p>No vendemos datos. Solo los compartimos con quienes necesitamos para brindar el servicio:</p>
          <Ul
            items={[
              'Proveedores de alojamiento y automatización de nuestra atención (servidores de Ivana Academy y la herramienta de flujos que recibe los formularios);',
              'Cloudflare, que entrega y protege el sitio (red de distribución y seguridad) y mide el rendimiento de las páginas;',
              'Medios de pago de la tienda (Mercado Pago), que tratan los datos de pago según su propia política;',
              'WhatsApp (Meta), cuando nos escribís por ahí;',
              'Google, solo si aceptás las cookies de estadísticas;',
              'Autoridades, cuando exista una obligación legal u orden judicial.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'transferencia',
      title: '4. Transferencia a otros países',
      body: (
        <p>Nuestra sede y nuestros sistemas están en Brasil, y algunos proveedores pueden guardar datos en otros países. Como Brasil no figura entre los países con nivel de protección adecuado reconocidos por la Argentina, al aceptar esta política y enviarnos tus datos consentís expresamente esa transferencia (art. 12 de la Ley 25.326). Aplicamos las medidas de seguridad descriptas más abajo.</p>
      ),
    },
    {
      id: 'conservacion',
      title: '5. Cuánto tiempo los guardamos',
      body: (
        <Ul
          items={[
            'Contactos e intereses: mientras exista relación y, después, hasta 24 meses sin interacción, o hasta que pidas la eliminación;',
            'Datos de compra, comprobantes y certificados: el plazo que exijan las leyes fiscales y de consumo (en general, 5 años);',
            'Registro de tu elección de cookies: 12 meses en tu navegador.',
          ]}
        />
      ),
    },
    {
      id: 'derechos',
      title: '6. Tus derechos',
      body: (
        <>
          <p>Podés, cuando quieras y de forma gratuita en intervalos no menores a seis meses (art. 14 de la Ley 25.326): acceder a tus datos, rectificarlos o actualizarlos, pedir su supresión, y retirar tu consentimiento.</p>
          <p>Hacé el pedido desde el <a href="/es_ar/derechos/" className="underline text-primary">formulario de derechos sobre tus datos</a>, por {mail} o por WhatsApp {wa}. Respondemos en un máximo de 10 días corridos para consultas de acceso y 5 días hábiles para rectificación o supresión. Por tu seguridad, podemos pedirte que confirmes tu identidad.</p>
          <p>La Agencia de Acceso a la Información Pública (AAIP), órgano de control de la Ley 25.326, recibe denuncias y reclamos de las personas titulares de datos (argentina.gob.ar/aaip).</p>
        </>
      ),
    },
    {
      id: 'cookies',
      title: '7. Cookies y almacenamiento en el navegador',
      body: (
        <>
          <Ul
            items={[
              <><strong>Esenciales (siempre activos):</strong> guardan tu elección de cookies (<code>ivana-consent</code>) y una copia de la agenda pública de clases (<code>ivana-agenda-v1</code>) para que el sitio cargue más rápido. No te identifican.</>,
              <><strong>Estadísticas (solo con tu aceptación):</strong> cookies de Google Analytics 4 (<code>_ga</code>, <code>_ga_*</code>), con vigencia de hasta 2 años. Si las rechazás o retirás tu aceptación, no se cargan y se borran las ya creadas.</>,
              <><strong>Medición de rendimiento (Cloudflare Web Analytics):</strong> Cloudflare, que entrega el sitio, mide el tiempo de carga y las visitas de forma agregada. Según la propia Cloudflare, este servicio no usa cookies ni te identifica individualmente; por eso funciona sin pedir consentimiento. Podés oponerte escribiéndonos al correo de privacidad.</>,
              <><strong>Publicidad:</strong> no usamos cookies de publicidad ni píxeles de redes sociales en este sitio.</>,
            ]}
          />
          <p>Para cambiar tu elección, usá «Preferencias de cookies» al pie de cualquier página. Las tipografías del sitio son propias; abrir una página no envía tu IP a Google Fonts.</p>
        </>
      ),
    },
    {
      id: 'seguridad',
      title: '8. Seguridad',
      body: <p>Usamos conexión segura (HTTPS), control de acceso a los sistemas y recopilación mínima de datos. Ningún sistema es infalible; si ocurriera un incidente que pueda afectarte de forma relevante, te avisaremos a vos y a la autoridad competente.</p>,
    },
    {
      id: 'imagenes',
      title: '9. Fotos y videos de las clases',
      body: <p>Podemos registrar imágenes durante los cursos. Solo publicamos imágenes en las que una alumna sea identificable con su autorización. Para pedir que quitemos una imagen tuya, escribinos a {mail}.</p>,
    },
    {
      id: 'cambios',
      title: '10. Cambios en esta política',
      body: <p>Podemos actualizar este texto. La fecha de la última versión figura arriba; los cambios importantes se avisarán en el sitio.</p>,
    },
  ],
};

export const terminosEs: LegalDoc = {
  title: 'Términos de Uso',
  intro: (
    <p>
      Al usar los sitios de {c.tradeName} ({sitio(c.site)}, {sitio(c.platform)} y {sitio(c.store)}) aceptás estos términos. Se complementan con la{' '}
      <a href="/es_ar/privacidad/" className="underline text-primary">Política de Privacidad</a> y la{' '}
      <a href="/es_ar/reembolso/" className="underline text-primary">Política de Reembolso y Cancelación</a>.
    </p>
  ),
  sections: [
    {
      id: 'quienes',
      title: '1. Quiénes somos',
      body: <p>{c.legalName}, CNPJ {c.cnpj}, que opera bajo el nombre {c.tradeName}. Contacto: {mail} o WhatsApp {wa}.</p>,
    },
    {
      id: 'servicios',
      title: '2. Qué ofrecemos',
      body: (
        <>
          <p>Cursos presenciales (talleres e inmersiones) y cursos online de manualidades, que se compran en {sitio(c.store)} o se coordinan por WhatsApp. Este sitio sirve para difundir clases, fechas, valores y cómo inscribirte.</p>
          <p>Las fechas, los horarios, los lugares, los valores y los cupos pueden cambiar. Vale lo que figure en la página del curso en la tienda al momento de la compra.</p>
        </>
      ),
    },
    {
      id: 'inscripcion',
      title: '3. Inscripción, cupos y clases',
      body: (
        <Ul
          items={[
            'El lugar queda asegurado recién cuando se confirma el pago (o la seña acordada por WhatsApp).',
            'Cada clase tiene un número limitado de cupos.',
            'Si una clase no se realiza por decisión nuestra, elegís entre reprogramar o recibir el reembolso total.',
            'Lo que está incluido (materiales, apostilla, certificado, café) se describe en cada curso.',
          ]}
        />
      ),
    },
    {
      id: 'uso',
      title: '4. Cómo podés usar el contenido',
      body: (
        <>
          <p>Las clases, apostillas, recetas, videos, marcas e imágenes están protegidos por derechos de autor y pertenecen a {c.legalName} o a sus licenciantes. Tu compra te da una licencia personal e intransferible de uso.</p>
          <p>Podés producir y vender lo que hagas a partir de lo que aprendiste. Está prohibido copiar, compartir, revender o publicar las apostillas, clases y demás materiales, total o parcialmente, sin autorización por escrito.</p>
        </>
      ),
    },
    {
      id: 'responsabilidad',
      title: '5. Resultados y responsabilidad',
      body: (
        <>
          <p>Enseñamos técnicas de manualidades. Los resultados personales y económicos dependen de cada persona, del mercado y de muchos factores; no prometemos ni garantizamos ingresos, ventas ni ganancias.</p>
          <p>En las clases presenciales, seguí las indicaciones de seguridad (por ejemplo, con ceras calientes, esencias y herramientas). Quien produzca para vender debe cumplir las normas que rigen su producto (registro, rotulado y normas sanitarias aplicables).</p>
        </>
      ),
    },
    {
      id: 'conducta',
      title: '6. Convivencia y uso del sitio',
      body: <p>No uses los sitios para fraudes, para enviar contenido ilegal, intentar vulnerarlos o sobrecargarlos. Podemos limitar o cerrar el acceso ante abusos. En clase esperamos respeto hacia compañeras y equipo.</p>,
    },
    {
      id: 'enlaces',
      title: '7. Enlaces y servicios de terceros',
      body: <p>Nuestros sitios llevan a servicios de terceros (tienda, pagos, WhatsApp, Instagram). Cada uno tiene sus propias reglas y no somos responsables por su contenido ni por sus prácticas.</p>,
    },
    {
      id: 'ley',
      title: '8. Ley aplicable y resolución de conflictos',
      body: <p>Para quienes contratan desde la Argentina rigen la Ley 24.240 de Defensa del Consumidor, el Código Civil y Comercial y la Ley 25.326. Antes de cualquier reclamo, escribinos a {c.ar.email} para intentar resolverlo. Se respeta tu derecho a iniciar acciones ante los tribunales del lugar de tu domicilio y a recurrir a los organismos de defensa del consumidor.</p>,
    },
    {
      id: 'cambios',
      title: '9. Cambios',
      body: <p>Podemos actualizar estos términos; vale la versión publicada en esta página, con la fecha arriba. Las compras ya hechas siguen las reglas vigentes al momento de la compra.</p>,
    },
  ],
};

export const reembolsoEs: LegalDoc = {
  title: 'Política de Reembolso y Cancelación',
  intro: (
    <p>
      Esta política rige para los cursos que vende {c.tradeName}. Respeta la Ley 24.240 de Defensa del Consumidor y el Código Civil y Comercial;
      si hubiera diferencia, vale lo que sea más favorable para vos.
    </p>
  ),
  sections: [
    {
      id: 'arrepentimiento',
      title: '1. Derecho de arrepentimiento (10 días)',
      body: (
        <>
          <p>En las compras hechas por internet o fuera del local comercial podés arrepentirte dentro de los 10 días corridos contados desde la contratación o desde que recibís el servicio, lo que ocurra último, sin necesidad de dar explicaciones (art. 34 de la Ley 24.240 y art. 1110 del Código Civil y Comercial). Rige para cursos online y presenciales.</p>
          <p>Cómo pedirlo: usá el <a href="/es_ar/arrepentimiento/" className="underline text-primary">Botón de arrepentimiento</a> (sin registro, con código de confirmación dentro de las 24 horas) o escribinos a {mail} o por WhatsApp {wa} indicando el nombre y el correo que usaste en la compra.</p>
        </>
      ),
    },
    {
      id: 'como',
      title: '2. Cómo se hace el reembolso',
      body: <p>Se te devuelve el monto pagado completo, por el mismo medio de pago que usaste. El plazo en que el dinero se acredita depende del banco o de la tarjeta.</p>,
    },
    {
      id: 'reprogramacion',
      title: '3. Reprogramación de clase',
      body: <p>Si no podés asistir, avisanos lo antes posible. Podés pasar a la próxima clase del mismo curso, sin costo, según la disponibilidad de cupos.</p>,
    },
    {
      id: 'despues',
      title: '4. Cancelación después del plazo de arrepentimiento',
      body: <p>Pasado ese plazo, los pedidos de cancelación y devolución se analizan caso por caso, dialogando con vos y buscando una solución justa para ambas partes.</p>,
    },
    {
      id: 'clase',
      title: '5. Si cancelamos o modificamos la clase',
      body: <p>Si cancelamos la clase o cambiamos la fecha o el lugar de modo que no puedas participar, elegís entre una nueva clase sin costo o el reembolso total.</p>,
    },
    {
      id: 'online',
      title: '6. Cursos online y materiales digitales',
      body: <p>En los cursos online rige el plazo de arrepentimiento desde la compra. Después, el acceso sigue las condiciones descriptas en la página de cada curso.</p>,
    },
    {
      id: 'sena',
      title: '7. Seña acordada por WhatsApp',
      body: <p>Cuando el lugar se reserva con una seña por atención personalizada, la seña se descuenta del valor del curso. Su devolución sigue lo indicado más arriba.</p>,
    },
  ],
};
