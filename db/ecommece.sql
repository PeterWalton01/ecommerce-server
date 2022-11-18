DROP TABLE IF EXISTS public.cart_items;
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.carts;
DROP TABLE IF EXISTS public.products;

-- DROP TABLE IF EXISTS public.carts;


CREATE TABLE public.products (
    "product_id" serial NOT NULL PRIMARY KEY,
    "product_code" character varying(20) UNIQUE NOT NULL,
    "description" character varying(60) NOT NULL,
    "unit_price" numeric(12,2) NOT NULL,
    "supplier_code" character varying(12) NOT NULL
);


CREATE TABLE public.users (
    "user_id" serial NOT NULL PRIMARY KEY,
    "email" character varying(64) UNIQUE NOT NULL,
    "first_name" character varying(50),
    "last_name" character varying(50),
    "creation_date" timestamp without time zone NOT NULL,
    "last_access" timestamp without time zone NOT NULL,
    "password" character varying(64) NOT NULL
);



CREATE TABLE public.carts (
    "cart_id" serial NOT NULL PRIMARY KEY,
    "creation_date" timestamp without time zone NOT NULL,
    "cart_status" character varying(8) NOT NULL
);




CREATE TABLE public.cart_items (
    "cart_item_id" serial NOT NULL PRIMARY KEY,
    "cart_id" integer NOT NULL,
    "product_id" integer NOT NULL,
    "description" character varying(60) NOT NULL,
    "unit_price" numeric(12,2) NOT NULL,
    "quantity" smallint NOT NULL,
    "creation_date" timestamp without time zone NOT NULL,
	CONSTRAINT fk_carts01 FOREIGN KEY(cart_id) REFERENCES carts(cart_id),
	CONSTRAINT fk_products01 FOREIGN KEY(product_id) REFERENCES products(product_id),
	UNIQUE(cart_id, product_id)
);



CREATE TABLE public.orders (
    "order_id" serial NOT NULL PRIMARY KEY,
    "email" character varying(64) NOT NULL,
    "order_status" character varying(12) NOT NULL,
    "creation_date" timestamp without time zone NOT NULL,
    CONSTRAINT fk_users01 FOREIGN KEY(email) REFERENCES users(email)	

);

CREATE TABLE public.order_items (
    "order_item_id" serial NOT NULL PRIMARY KEY,
    "product_id" integer NOT NULL,
    "order_id" integer NOT NULL,
    "description" character varying(60) NOT NULL,
    "unit_price" numeric(12,2) NOT NULL,
    "quantity" smallint NOT NULL,
    "creation_date" timestamp without time zone NOT NULL,
    "altered_date" timestamp without time zone NOT NULL,
	CONSTRAINT fk_products02 FOREIGN KEY(product_id) REFERENCES products(product_id),
    CONSTRAINT fk_orders01 FOREIGN KEY(order_id) REFERENCES orders(order_id),
    UNIQUE(product_id, order_id)
);