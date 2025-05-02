export async function obtenerProductosDesdeNotion() {
  const NOTION_TOKEN = "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";
  const DATABASE_ID = "1ddfb5da662d81528dfdc59c49db8ed1";
  const URL = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;

  try {
      const response = await fetch(URL, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${NOTION_TOKEN}`,
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28'
          }
      });

      const data = await response.json();

      const productos = data.results.map(page => {
          const nombre = page.properties.Producto.title[0]?.plain_text || 'Sin nombre';
          const imagenes = page.properties["Imagen producto"].files.map(f => f.file?.url || f.external?.url) || [];
          const descripcion = page.properties.Descripcion.rich_text[0]?.plain_text || 'Sin descripción';

          // Leer talles como array de selección múltiple
          const tallesArray = page.properties.Talles.multi_select || [];
          const talles = tallesArray.map(t => t.name).join(', ') || '-';

          const precio = page.properties.Precio.number !== null ? `$${page.properties.Precio.number}` : '$0';
          const agotado = page.properties.Estado.select?.name === 'Agotado';

          return {
              nombre,
              imagen: imagenes[0] || '',
              imagenes,
              descripcion,
              talles,
              precio,
              agotado
          };
      });

      return productos;

  } catch (error) {
      console.error("Error al consultar Notion:", error);
      return [];
  }
}