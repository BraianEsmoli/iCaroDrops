import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID,
    });

    const productos = response.results.map(page => ({
      nombre: page.properties.Producto.title[0]?.plain_text || 'Sin nombre',
      imagen: page.properties["Imagen producto"].files?.[0]?.external?.url || '',
      descripcion: page.properties.Descripción.rich_text[0]?.plain_text || 'Sin descripción',
      talles: page.properties.Talles.rich_text[0]?.plain_text || '-',
      precio: `$${page.properties.Precio.number || 0}`,
      agotado: page.properties.Estado.select?.name === 'Agotado'
    }));

    res.status(200).json(productos);
  } catch (error) {
    console.error('Notion API error:', error);
    res.status(500).json({ error: 'Error al obtener productos desde Notion' });
  }
}