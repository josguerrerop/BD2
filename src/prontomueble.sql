create database prontomueble;
\c prontomueble

create table proveedor(
id serial not null,
direccion varchar(20),
nombre varchar(20),
persona_contacto varchar(20),
primary key (id)
);

create table tel_proveedor(
id_proveedor int not null,
telefono int not null,
primary key (id_proveedor,telefono),
foreign key (id_proveedor) references proveedor (id)
);

create table vendedor(
id serial not null,
nombre varchar(20) not null,
primary key (id)
);

create table cant_ventas_vendedor(
id_vendedor int not null, 
cant_vendidos int default 0, 
mes varchar(10),
primary key(id_vendedor,mes),
foreign key (id_vendedor) references vendedor (id)
);


create table tipo_mueble(
id int not null,
tipo varchar(20),
primary key (id)
);

create table material(
id int not null,
material varchar(20),
primary key (id)
);

create table color(
id int not null,
color varchar(20),
primary key (id)
);

create table mueble(
id serial not null,
precio int,
precio_instalacion int,
dimensiones varchar(20),
id_proveedor int,
id_vendedor int,
id_color int,
id_tipo_mueble int,
id_material int,
primary key (id),
foreign key (id_proveedor) references proveedor (id),
foreign key (id_vendedor) references vendedor (id),
foreign key (id_color) references color (id),
foreign key (id_tipo_mueble) references tipo_mueble (id),
foreign key (id_material) references material (id)
);

create table cant_mueble_vend(
id_mueble int not null,
cant_m_ven int default 0,
mes varchar(20),
primary key (id_mueble,mes),
foreign key (id_mueble) references mueble (id)
);


create table cliente(
id serial not null,
nombre varchar(20),
direccion varchar(20),
correo varchar(20),
clave varchar(20),
numero_compras int,
primary key (id)
);

create table cantm_client_compra(
id_cliente int not null,
cant_comprados int default 0,
mes varchar(10),
primary key (id_cliente,mes),
foreign key (id_cliente) references cliente (id)
);

create table tel_cliente(
id_cliente int not null,
telefono int not null,
primary key (id_cliente,telefono),
foreign key (id_cliente) references cliente (id)
);

create table compra(
id_mueble int not null,
id_cliente int not null,
fecha date not null,
primary key (id_mueble,id_cliente,fecha),
foreign key (id_mueble) references mueble (id),
foreign key (id_cliente) references cliente (id)
);