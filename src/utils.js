import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

// Función para validar el stock de un producto
export function validateProductStock(cartProducts, productId, quantity, products) {
    // Encuentra el producto por su ID
    const product = products.find(p => p.id === productId);

    if (!product) {
        throw new Error('Producto no encontrado');
    }

    // Verifica si la cantidad solicitada es mayor al stock disponible
    if (product.stock < quantity) {
        throw new Error(`No hay suficiente stock del producto. Stock disponible: ${product.stock}`);
    }

    return true;  
}


