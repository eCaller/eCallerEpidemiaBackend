-----------------------------------------------------
-- tabla casos
-----------------------------------------------------
CREATE TABLE casos (
    id integer NOT NULL,
    fecha timestamp without time zone NOT NULL,
    nombre character varying(100) NOT NULL,
    edad integer,
    telefono character varying(20),
    dni character varying(20),
    codigo character varying(10) NOT NULL,
    email character varying(50),
    direccion character varying(500),
    lat double precision,
    lng double precision,
    observaciones character varying(5000),
    estado character varying(2) NOT NULL,
    resultadotest character varying(1),
    resultado character varying(1),
    idmunicipio integer,
    CONSTRAINT chk_casos_estado CHECK (((estado)::text = ANY ((ARRAY['PC'::character varying, 'CO'::character varying, 'PT'::character varying, 'PR'::character varying, 'PE'::character varying, 'FI'::character varying])::text[]))),
    CONSTRAINT chk_casos_resultado CHECK (((resultado)::text = ANY ((ARRAY['D'::character varying, 'R'::character varying])::text[]))),
    CONSTRAINT chk_casos_resultadotest CHECK (((resultadotest)::text = ANY ((ARRAY['P'::character varying, 'N'::character varying])::text[])))
);

CREATE SEQUENCE casos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	

-----------------------------------------------------
-- tabla casospositivos
-----------------------------------------------------
CREATE TABLE casospositivos (
    id integer NOT NULL
);

CREATE SEQUENCE casospositivos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
-----------------------------------------------------
-- tabla casospositivosxrespuestas
-----------------------------------------------------
CREATE TABLE casospositivosxrespuestas (
    id integer NOT NULL,
    idcasopositivo integer NOT NULL,
    idrespuesta integer NOT NULL
);

CREATE SEQUENCE casospositivosxrespuestas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
-----------------------------------------------------
-- tabla casosxestados
-----------------------------------------------------
CREATE TABLE casosxestados (
    id integer NOT NULL,
    estado character varying(2) NOT NULL,
    fecha timestamp without time zone NOT NULL,
    idcaso integer,
    CONSTRAINT chk_casosxestados_estado CHECK (((estado)::text = ANY ((ARRAY['PC'::character varying, 'CO'::character varying, 'PT'::character varying, 'PR'::character varying, 'PE'::character varying, 'FI'::character varying])::text[])))
);

CREATE SEQUENCE casosxestados_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-----------------------------------------------------
-- tabla casosxrespuestas
-----------------------------------------------------
CREATE TABLE casosxrespuestas (
    id integer NOT NULL,
    idcaso integer NOT NULL,
    idrespuesta integer NOT NULL
);

CREATE SEQUENCE casosxrespuestas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
-----------------------------------------------------
-- tabla centros
-----------------------------------------------------
CREATE TABLE centros (
    id integer NOT NULL,
    nombre character varying(1000) NOT NULL
);

CREATE SEQUENCE centros_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-----------------------------------------------------
-- tabla citas
-----------------------------------------------------
CREATE TABLE citas (
    id integer NOT NULL,
    idcaso integer NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    tipo character varying(1) NOT NULL,
    idcentro integer,
    comentarios character varying(5000),
    CONSTRAINT chk_citas_tipo CHECK (((tipo)::text = ANY ((ARRAY['D'::character varying, 'C'::character varying])::text[])))
);

CREATE SEQUENCE citas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-----------------------------------------------------
-- tabla departamentos
-----------------------------------------------------
CREATE TABLE departamentos (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL
);

CREATE SEQUENCE departamentos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
-----------------------------------------------------
-- tabla distritos
-----------------------------------------------------
CREATE TABLE distritos (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    idmunicipio integer NOT NULL,
    lat double precision,
    lng double precision
);

CREATE SEQUENCE distritos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
-----------------------------------------------------
-- tabla municipios
-----------------------------------------------------
CREATE TABLE municipios (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    idprovincia integer NOT NULL,
    lat double precision,
    lng double precision
);

CREATE SEQUENCE municipios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-----------------------------------------------------
-- tabla preguntas
-----------------------------------------------------
CREATE TABLE preguntas (
    id integer NOT NULL,
    codigo character varying(2) NOT NULL,
    pregunta character varying(5000) NOT NULL,
    tipo character varying(1) NOT NULL,
    orden integer,
    CONSTRAINT chk_preguntas_tipo CHECK (((tipo)::text = ANY ((ARRAY['R'::character varying, 'C'::character varying])::text[])))
);

CREATE SEQUENCE preguntas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
-----------------------------------------------------
-- tabla provincias
-----------------------------------------------------
CREATE TABLE provincias (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    iddepartamento integer NOT NULL
);

CREATE SEQUENCE provincias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
-----------------------------------------------------
-- tabla respuestas
-----------------------------------------------------
CREATE TABLE respuestas (
    id integer NOT NULL,
    codigo character varying(2) NOT NULL,
    respuesta character varying(1000) NOT NULL,
    orden integer,
    idpregunta integer NOT NULL
);

CREATE SEQUENCE respuestas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
-----------------------------------------------------
-- tabla usuarios
-----------------------------------------------------
CREATE TABLE usuarios (
    id integer NOT NULL,
    username character varying(25) NOT NULL,
    password character varying(100) NOT NULL,
    nombre character varying(255) NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    imagen bytea,
    rol character varying(1),
    CONSTRAINT chk_usuarios_rol CHECK (((rol)::text = ANY ((ARRAY['A'::character varying, 'N'::character varying])::text[])))
);

CREATE SEQUENCE usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	
-----------------------------------------------------
-- tabla variables
-----------------------------------------------------
CREATE TABLE variables (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    valor character varying(15000) NOT NULL
);

CREATE SEQUENCE variables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
	

-----------------------------------------------------
-- Secuencias
-----------------------------------------------------

ALTER TABLE ONLY casos ALTER COLUMN id SET DEFAULT nextval('casos_id_seq'::regclass);

ALTER TABLE ONLY casospositivos ALTER COLUMN id SET DEFAULT nextval('casospositivos_id_seq'::regclass);

ALTER TABLE ONLY casospositivosxrespuestas ALTER COLUMN id SET DEFAULT nextval('casospositivosxrespuestas_id_seq'::regclass);

ALTER TABLE ONLY casosxestados ALTER COLUMN id SET DEFAULT nextval('casosxestados_id_seq'::regclass);

ALTER TABLE ONLY casosxrespuestas ALTER COLUMN id SET DEFAULT nextval('casosxrespuestas_id_seq'::regclass);

ALTER TABLE ONLY centros ALTER COLUMN id SET DEFAULT nextval('centros_id_seq'::regclass);

ALTER TABLE ONLY citas ALTER COLUMN id SET DEFAULT nextval('citas_id_seq'::regclass);

ALTER TABLE ONLY departamentos ALTER COLUMN id SET DEFAULT nextval('departamentos_id_seq'::regclass);

ALTER TABLE ONLY distritos ALTER COLUMN id SET DEFAULT nextval('distritos_id_seq'::regclass);

ALTER TABLE ONLY municipios ALTER COLUMN id SET DEFAULT nextval('municipios_id_seq'::regclass);

ALTER TABLE ONLY preguntas ALTER COLUMN id SET DEFAULT nextval('preguntas_id_seq'::regclass);

ALTER TABLE ONLY provincias ALTER COLUMN id SET DEFAULT nextval('provincias_id_seq'::regclass);

ALTER TABLE ONLY respuestas ALTER COLUMN id SET DEFAULT nextval('respuestas_id_seq'::regclass);

ALTER TABLE ONLY usuarios ALTER COLUMN id SET DEFAULT nextval('usuarios_id_seq'::regclass);

ALTER TABLE ONLY variables ALTER COLUMN id SET DEFAULT nextval('variables_id_seq'::regclass);




	
-----------------------------------------------------
-- Inserción de datos básicos
-----------------------------------------------------

insert into casospositivos (id) values (1), (2), (3), (4);

SELECT pg_catalog.setval('casospositivos_id_seq', 4, false);

insert into casospositivosxrespuestas (id, idcasopositivo, idrespuesta)  values 
(4,1,7),
(13,1,9),
(14,1,12),
(15,2,7),
(16,2,9),
(17,3,7),
(18,3,12),
(19,4,9),
(20,4,12);

SELECT pg_catalog.setval('casospositivosxrespuestas_id_seq', 20, true);


insert into preguntas (id, codigo, pregunta, tipo, orden) values 
(1, 'A', '¿Has estado en los últimos 14 días en una zona de alto riesgo epidémico por COVID-19?', 'R', 1),
(2, 'B', '¿Has tenido contacto en los últimos 14 días o convives con alguna persona portadora del COVID-19?', 'R', 2),
(3, 'C', 'Señala los factores de riesgo que presentes en la actualidad', 'C', 3),
(4, 'D', '¿Toses con cierta frecuencia y la tos es seca?', 'R', 4),
(5, 'E', '¿Tienes 38ºC o más de temperatura corporal?', 'R', 5),
(6, 'F', '¿Tienes dificultad al respirar / sensación de falta de aire?', 'R', 6),
(12, 'G', 'Señala los síntomas que experimentes actualmente', 'C', 7);

SELECT pg_catalog.setval('preguntas_id_seq', 12, true);


insert into respuestas (id, codigo, respuesta, orden, idpregunta) values 
(1, 1, 'Sí', 1, 1),
(2, 2, 'No', 2, 1),
(36, 3, 'No lo sé', 3, 1),
(3, 1, 'Sí', 1, 2),
(4, 2, 'No', 2, 2),
(37, 3, 'No lo sé', 3, 2),
(5, 1, 'Edad superior a 60 años', 1, 3),
(6, 2, 'Hipertensión arterial', 2, 3),
(38, 3, 'Cáncer', 3, 3),
(39, 4, 'Diabetes', 4, 3),
(40, 5, 'Inmunodepresión', 5, 3),
(41, 6, 'Enfermedades cardiovasculares', 6, 3),
(42, 7, 'Enfermedad renal', 7, 3),
(43, 8, 'Enfermedad hepática', 8, 3),
(7, 1, 'Sí', 1, 4),
(8, 2, 'No', 2, 4),
(9, 1, 'Sí', 1, 5),
(10, 2, 'No', 2, 5),
(12, 1, 'Sí', 1, 6),
(13, 2, 'No', 2, 6),
(44, 1, 'Malestar general', 1, 12),
(45, 2, 'Mayor sensación de cansancio', 2, 12),
(46, 3, 'Dolor de garganta', 3, 12),
(47, 4, 'Problemas gastrointestinales', 4, 12),
(48, 5, 'Dolor en el costado', 5, 12),
(49, 6, 'Mareos', 6, 12),
(50, 7, 'Expectoración de sangre', 7, 12),
(51, 8, 'Pérdida de los sentidos del gusto y del olfato', 8, 12);

SELECT pg_catalog.setval('respuestas_id_seq', 51, true);



insert into usuarios (id, username, password, nombre, activo, imagen, rol) values 
(1, 'demo', '$2b$10$53y.tmRZne2VzjsVwQoyqurGpDqg4lezcYNlW0xLtmcQy2SdQBZTO', 'Usuario de demo', true, null, 'N');

SELECT pg_catalog.setval('usuarios_id_seq', 1, true);


insert into variables (id, nombre, valor) values 
(1, 'RESPUESTA_POSITIVO', '<h2><strong>Usted presenta síntomas de posible contagio por Covid-19</strong></h2><p>En principio no se alarme y mantenga la calma.<p>Rellene el siguiente formulario para realizar el seguimiento de su caso y nos pondremos en contacto con usted a la mayor brevedad posible para indicarle cómo proceder.</p><p><strong>¡Es muy importante que siga las medidas de confinamiento y se quede en casa!</strong><p>Contener el virus es responsabilidad de todos.</p>'),
(2, 'RESPUESTA_NEGATIVO', '<h2><strong>No presentas síntomas, ¡pero no te confíes!</strong></h2><p>Sigue con las medidas de protección y aislamiento y contrólate los síntomas un mínimo de 14 días.</p><p><strong>¡Es muy importante que sigas las medidas de confinamiento y te quedes en casa!</strong></p> <p>Contener el virus es responsabilidad de todos.</p>'),
(3, 'PRIVACIDAD', '<div class="row"><div class="col-sm-8 offset-sm-4 align-self-center"><h2>Política de Privacidad</h2><p>Texto política de privacidad</p></div>');

SELECT pg_catalog.setval('variables_id_seq', 3, true);



-----------------------------------------------------
-- Claves primarias y únicas
-----------------------------------------------------
ALTER TABLE ONLY casos
    ADD CONSTRAINT casos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY casospositivos
    ADD CONSTRAINT casospositivos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY casospositivosxrespuestas
    ADD CONSTRAINT casospositivosxrespuestas_pkey PRIMARY KEY (id);

ALTER TABLE ONLY casosxestados
    ADD CONSTRAINT casosxestados_pkey PRIMARY KEY (id);

ALTER TABLE ONLY casosxrespuestas
    ADD CONSTRAINT casosxrespuestas_pkey PRIMARY KEY (id);

ALTER TABLE ONLY centros
    ADD CONSTRAINT centros_pkey PRIMARY KEY (id);

ALTER TABLE ONLY citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (id);

ALTER TABLE ONLY departamentos
    ADD CONSTRAINT departamentos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY distritos
    ADD CONSTRAINT distritos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY municipios
    ADD CONSTRAINT municipios_pkey PRIMARY KEY (id);

ALTER TABLE ONLY usuarios
    ADD CONSTRAINT pkusuarios PRIMARY KEY (id);

ALTER TABLE ONLY preguntas
    ADD CONSTRAINT preguntas_pkey PRIMARY KEY (id);

ALTER TABLE ONLY provincias
    ADD CONSTRAINT provincias_pkey PRIMARY KEY (id);

ALTER TABLE ONLY respuestas
    ADD CONSTRAINT respuestas_pkey PRIMARY KEY (id);

ALTER TABLE ONLY casospositivosxrespuestas
    ADD CONSTRAINT u_casospositivosxrespuestas UNIQUE (idcasopositivo, idrespuesta);

ALTER TABLE ONLY casosxestados
    ADD CONSTRAINT u_casosxestados UNIQUE (estado, fecha, idcaso);

ALTER TABLE ONLY casosxrespuestas
    ADD CONSTRAINT u_casosxrespuestas UNIQUE (idcaso, idrespuesta);

ALTER TABLE ONLY variables
    ADD CONSTRAINT variables_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX u_usuarios_username ON usuarios USING btree (username);


-----------------------------------------------------
-- Claves foráneas
-----------------------------------------------------
ALTER TABLE ONLY casos
    ADD CONSTRAINT fk_casos_municipios FOREIGN KEY (idmunicipio) REFERENCES municipios(id);

ALTER TABLE ONLY casospositivosxrespuestas
    ADD CONSTRAINT fk_casospositivosxrespuestas_casospositivos FOREIGN KEY (idcasopositivo) REFERENCES casospositivos(id);

ALTER TABLE ONLY casospositivosxrespuestas
    ADD CONSTRAINT fk_casospositivosxrespuestas_respuestas FOREIGN KEY (idrespuesta) REFERENCES respuestas(id);

ALTER TABLE ONLY casosxestados
    ADD CONSTRAINT fk_casosxestados_casos FOREIGN KEY (idcaso) REFERENCES casos(id);

ALTER TABLE ONLY citas
    ADD CONSTRAINT fk_citas_centros FOREIGN KEY (idcentro) REFERENCES centros(id);

ALTER TABLE ONLY distritos
    ADD CONSTRAINT fk_distritos_municipios FOREIGN KEY (idmunicipio) REFERENCES municipios(id);

ALTER TABLE ONLY municipios
    ADD CONSTRAINT fk_municipios_provincias FOREIGN KEY (idprovincia) REFERENCES provincias(id);

ALTER TABLE ONLY provincias
    ADD CONSTRAINT fk_provincias_departamentos FOREIGN KEY (iddepartamento) REFERENCES departamentos(id);

ALTER TABLE ONLY respuestas
    ADD CONSTRAINT fk_respuestas_preguntas FOREIGN KEY (idpregunta) REFERENCES preguntas(id);
