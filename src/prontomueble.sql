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
fecha date,
primary key(id_vendedor,fecha),
foreign key (id_vendedor) references vendedor (id)
);


create table tipo_mueble(
id int not null,
tipo varchar(20),
primary key (id)
);

create table material(
id serial  not null,
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
fecha date,
primary key (id_mueble,fecha),
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

create table cliente(
id serial not null,
nombre varchar(20),
direccion varchar(20),
correo varchar(20),
clave varchar(20),
numero_compras int,
primary key (id)
);

create table sesion_cliente (
id_cliente INT not null,
correo varchar(30),
clave varchar(30),
primary key (id_cliente),
foreign key (id_cliente) references cliente (id)
);


create table cantm_client_compra(
id_cliente int not null,
cant_comprados int default 0,
fecha date,
primary key (id_cliente,fecha),
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
fecha timestamp not null,
primary key (id_mueble,id_cliente,fecha),
foreign key (id_mueble) references mueble (id),
foreign key (id_cliente) references cliente (id)
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


CREATE INDEX "IDX_session_expire" ON "session" ("expire");


 create or replace function cliente_compras() returns trigger AS $compras_c$
 declare id_C INT; 
 declare mont date; 
 declare id_cli INT;
 begin
 id_cli = new.id_cliente;
 SELECT DATE(new.fecha) INTO mont;
 SELECT id_cliente FROM cantm_client_compra WHERE fecha=mont and id_cliente=id_cli into id_C;
 IF (id_C IS NULL) then
 insert into cantm_client_compra (id_cliente,cant_comprados,fecha) values (new.id_cliente,1,mont);
 else 
 update cantm_client_compra set cant_comprados=cant_comprados+1 WHERE fecha=mont and id_cliente=id_cli;
 end if;
 return new;
 end;
 $compras_c$ LANGUAGE plpgsql;
 
  create trigger compras_c after insert on compra
  for each row execute procedure cliente_compras();
create view vista_mueble as 
select mueble.id, id_proveedor, id_vendedor, precio, dimensiones, precio_instalacion, 
id_color, id_tipo_mueble, id_material, color, material, tipo, proveedor.nombre as nombre_prov, 
vendedor.nombre as nombre_vend from mueble inner join color on mueble.id_color = color.id 
inner join material on mueble.id_material =material.id inner join 
tipo_mueble on mueble.id_tipo_mueble = tipo_mueble.id inner join 
proveedor  on mueble.id_proveedor = proveedor.id inner join vendedor on mueble.id_vendedor = vendedor.id;

CREATE OR REPLACE RULE limit_precio
AS ON insert 
TO mueble WHERE NEW.precio<100000
DO(
update mueble set precio =200000 WHERE precio<100000;
);