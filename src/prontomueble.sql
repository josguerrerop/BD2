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

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;


CREATE INDEX "IDX_session_expire" ON "session" ("expire");


create or replace function muebles_vendidos() returns trigger AS $mueble_v$
 declare id_M INT; 
 declare mont text; 
 declare id_cli INT;
 begin
 id_cli = new.id_cliente;
 SELECT EXTRACT(MONTH FROM  new.fecha) INTO mont;
 SELECT id_ FROM cant_mueble_vend WHERE mes=mont and id_cliente=id_cli into id_M;
 IF (id_C IS NULL) then
 insert into cant_mueble_vend (id_cliente,cant_comprados,mes) values (new.id_cliente,1,mont);
 raise notice '1 insertado %',mont;
 else 
 update cant_mueble_vend set cant_comprados=cant_comprados+1 WHERE mes=mont and id_cliente=id_cli;
 raise notice 'actualizado %',mont;
 end if;
 return new;
 end;
 $mueble_v$ LANGUAGE plpgsql;
 
  create trigger mueble_v after insert on compra
  for each row execute procedure muebles_vendidos();