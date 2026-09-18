-- 1. Clientes iniciales para pruebas
INSERT INTO clientes (id, nombre, apellido, dni, telefono, email, direccion, activo) VALUES
(1, 'Carlos', 'Mendoza Quispe', '45892147', '987654321', 'carlos.mendoza@gmail.com', 'Jr. Las Palmeras 123', 1),
(2, 'María', 'Fernández Torres', '71234568', '912345678', 'maria.fernandez@gmail.com', 'Av. José Granda 450', 1),
(3, 'Juan', 'Pérez Rojas', '09876543', '955443322', 'juan.perez@hotmail.com', 'Calle Los Jazmines 210', 1)
ON DUPLICATE KEY UPDATE id = id;

-- 2. Productos de bodega iniciales para pruebas
INSERT INTO productos (id, nombre, categoria, descripcion, precio_unit, stock, fecha_produccion, fecha_caducidad, activo) VALUES
(1, 'Arroz Costeño 1kg', 'Abarrotes', 'Bolsa de arroz extra 1kg', 4.50, 50, '2026-01-10', '2027-01-10', 1),
(2, 'Aceite Primor 900ml', 'Abarrotes', 'Aceite vegetal clásico', 8.50, 30, '2026-02-15', '2027-02-15', 1),
(3, 'Leche Gloria Azul 400g', 'Lácteos', 'Tarro de leche evaporada entera', 4.20, 60, '2026-03-01', '2027-03-01', 1),
(4, 'Fideos Don Vittorio 500g', 'Abarrotes', 'Fideos spaghetti', 3.20, 40, '2026-01-20', '2027-01-20', 1),
(5, 'Azúcar Rubia Cartavio 1kg', 'Abarrotes', 'Bolsa de azúcar rubia', 3.80, 25, '2026-02-01', '2027-02-01', 1)
ON DUPLICATE KEY UPDATE id = id;

-- 3. Ventas de prueba
INSERT INTO ventas (id, cliente_id, producto_id, nombre_producto, cantidad, precio_unitario, total, estado) VALUES
(1, 1, 1, 'Arroz Costeño 1kg', 2, 4.50, 9.00, 'completada'),
(2, 1, 3, 'Leche Gloria Azul 400g', 3, 4.20, 12.60, 'completada'),
(3, 2, 2, 'Aceite Primor 900ml', 1, 8.50, 8.50, 'completada')
ON DUPLICATE KEY UPDATE id = id;