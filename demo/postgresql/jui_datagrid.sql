--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

--
-- Name: jui_datagrid; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA jui_datagrid;


ALTER SCHEMA jui_datagrid OWNER TO postgres;

SET search_path = jui_datagrid, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: customers; Type: TABLE; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

CREATE TABLE customers (
    id integer NOT NULL,
    lastname character varying(200) NOT NULL,
    firstname character varying(200) NOT NULL,
    lk_genders_id integer NOT NULL,
    email character varying(250),
    remarks text
);


ALTER TABLE jui_datagrid.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: jui_datagrid; Owner: postgres
--

CREATE SEQUENCE customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE jui_datagrid.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: jui_datagrid; Owner: postgres
--

ALTER SEQUENCE customers_id_seq OWNED BY customers.id;


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: jui_datagrid; Owner: postgres
--

SELECT pg_catalog.setval('customers_id_seq', 200, true);


--
-- Name: lk_countries; Type: TABLE; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

CREATE TABLE lk_countries (
    iso_code character varying(20) NOT NULL,
    country character varying(200) NOT NULL
);


ALTER TABLE jui_datagrid.lk_countries OWNER TO postgres;

--
-- Name: lk_genders; Type: TABLE; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

CREATE TABLE lk_genders (
    id integer NOT NULL,
    gender character varying(50) NOT NULL,
    display_order integer
);


ALTER TABLE jui_datagrid.lk_genders OWNER TO postgres;

--
-- Name: lk_genders_id_seq; Type: SEQUENCE; Schema: jui_datagrid; Owner: postgres
--

CREATE SEQUENCE lk_genders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MAXVALUE
    NO MINVALUE
    CACHE 1;


ALTER TABLE jui_datagrid.lk_genders_id_seq OWNER TO postgres;

--
-- Name: lk_genders_id_seq; Type: SEQUENCE OWNED BY; Schema: jui_datagrid; Owner: postgres
--

ALTER SEQUENCE lk_genders_id_seq OWNED BY lk_genders.id;


--
-- Name: lk_genders_id_seq; Type: SEQUENCE SET; Schema: jui_datagrid; Owner: postgres
--

SELECT pg_catalog.setval('lk_genders_id_seq', 2, true);


--
-- Name: id; Type: DEFAULT; Schema: jui_datagrid; Owner: postgres
--

ALTER TABLE ONLY customers ALTER COLUMN id SET DEFAULT nextval('customers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: jui_datagrid; Owner: postgres
--

ALTER TABLE ONLY lk_genders ALTER COLUMN id SET DEFAULT nextval('lk_genders_id_seq'::regclass);


--
-- Data for Name: customers; Type: TABLE DATA; Schema: jui_datagrid; Owner: postgres
--

INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (1, 'Mullins', 'Elton', 1, 'nec@quamPellentesque.org', 'dictum sapien. Aenean massa. Integer vitae nibh. Donec est mauris,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (2, 'Trujillo', 'Isaiah', 1, 'eget.nisi.dictum@SuspendissesagittisNullam.com', 'erat, in consectetuer ipsum nunc id enim. Curabitur massa. Vestibulum');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (3, 'Bailey', 'Benjamin', 1, 'et@risusDonecegestas.org', 'gravida. Aliquam tincidunt, nunc ac mattis ornare, lectus ante dictum');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (4, 'Holland', 'Daniel', 1, 'auctor.quis.tristique@Crasdolor.org', 'malesuada fames ac turpis egestas. Fusce aliquet magna a neque.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (5, 'Whitehead', 'Oliver', 1, 'enim.Etiam.imperdiet@posuereat.org', 'ornare sagittis felis. Donec tempor, est ac mattis semper, dui');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (6, 'Pope', 'Jacob', 1, 'lobortis@volutpat.org', 'non sapien molestie orci tincidunt adipiscing. Mauris molestie pharetra nibh.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (7, 'Johnson', 'Murphy', 1, 'lorem.ac.risus@magnaPhasellusdolor.com', 'in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (8, 'Obrien', 'Zane', 1, 'orci.Donec@nonlorem.edu', 'ligula eu enim. Etiam imperdiet dictum magna. Ut tincidunt orci');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (9, 'Stafford', 'Thor', 1, 'ut@Vestibulum.ca', 'erat volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus nulla.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (10, 'Hendrix', 'Zachary', 1, 'Donec.tempus@ataugue.ca', 'iaculis, lacus pede sagittis augue, eu tempor erat neque non');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (11, 'Stephens', 'Oliver', 1, 'lacus@purus.ca', 'a feugiat tellus lorem eu metus. In lorem. Donec elementum,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (12, 'Jacobs', 'Ivor', 1, 'amet.risus.Donec@Naminterdum.org', 'egestas hendrerit neque. In ornare sagittis felis. Donec tempor, est');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (13, 'Wong', 'Stuart', 1, 'lorem.vitae.odio@Suspendissecommodotincidunt.edu', 'Phasellus vitae mauris sit amet lorem semper auctor. Mauris vel');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (14, 'Spears', 'Kennan', 1, 'primis.in.faucibus@nonummyultriciesornare.edu', 'pede, malesuada vel, venenatis vel, faucibus id, libero. Donec consectetuer');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (15, 'Lott', 'David', 1, 'ullamcorper@acipsumPhasellus.org', 'ligula. Aenean euismod mauris eu elit. Nulla facilisi. Sed neque.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (16, 'Olson', 'Hiram', 1, 'Nunc@liberodui.ca', NULL);
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (17, 'Stevens', 'Octavius', 1, 'nec.ante@placeratorci.ca', 'Fusce aliquam, enim nec tempus scelerisque, lorem ipsum sodales purus,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (18, 'Donovan', 'Neville', 1, 'adipiscing.elit.Curabitur@aliquetPhasellus.org', 'senectus et netus et malesuada fames ac turpis egestas. Fusce');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (19, 'Barker', 'Uriel', 1, 'dictum.eu.placerat@enim.ca', 'ornare, elit elit fermentum risus, at fringilla purus mauris a');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (20, 'Raymond', 'Donovan', 1, 'justo@neque.ca', NULL);
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (21, 'Morin', 'Isaiah', 1, 'pellentesque.eget.dictum@commodo.org', 'malesuada augue ut lacus. Nulla tincidunt, neque vitae semper egestas,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (22, 'Hays', 'Hakeem', 1, 'tincidunt.nunc@rutrum.ca', 'primis in faucibus orci luctus et ultrices posuere cubilia Curae;');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (23, 'Wilder', 'Owen', 1, 'ipsum@enim.ca', 'risus. Duis a mi fringilla mi lacinia mattis. Integer eu');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (24, 'Fitzpatrick', 'Akeem', 1, 'et@antedictummi.ca', 'Nam ligula elit, pretium et, rutrum non, hendrerit id, ante.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (25, 'Herrera', 'Kevin', 1, 'arcu.Vestibulum.ut@nec.ca', 'lectus. Cum sociis natoque penatibus et magnis dis parturient montes,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (26, 'Wilkinson', 'Fulton', 1, 'molestie.sodales@interdumligula.com', 'Nulla dignissim. Maecenas ornare egestas ligula. Nullam feugiat placerat velit.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (27, 'Gill', 'Giacomo', 1, 'velit.Quisque@egestasligula.edu', 'nascetur ridiculus mus. Donec dignissim magna a tortor. Nunc commodo');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (28, 'Hebert', 'Devin', 1, 'consectetuer@ac.ca', 'tellus. Phasellus elit pede, malesuada vel, venenatis vel, faucibus id,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (29, 'Merrill', 'Otto', 1, 'laoreet@molestie.org', 'Morbi vehicula. Pellentesque tincidunt tempus risus. Donec egestas. Duis ac');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (30, 'Livingston', 'Carson', 1, 'lobortis.quis@eumetusIn.com', 'non, egestas a, dui. Cras pellentesque. Sed dictum. Proin eget');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (31, 'Delacruz', 'Raymond', 1, 'elit.pede@magnis.com', 'eu enim. Etiam imperdiet dictum magna. Ut tincidunt orci quis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (32, 'Whitfield', 'Kenneth', 1, 'augue.id.ante@egestasAliquam.ca', NULL);
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (33, 'Mcknight', 'Aaron', 1, 'semper@semper.edu', 'aliquet lobortis, nisi nibh lacinia orci, consectetuer euismod est arcu');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (34, 'Swanson', 'Leonard', 1, 'lacus.Etiam@dolorFusce.ca', 'ridiculus mus. Donec dignissim magna a tortor. Nunc commodo auctor');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (35, 'Roman', 'Dane', 1, 'tellus@duiaugueeu.org', 'at, libero. Morbi accumsan laoreet ipsum. Curabitur consequat, lectus sit');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (36, 'Craft', 'Jameson', 1, 'egestas@adipiscingenim.edu', 'mauris. Integer sem elit, pharetra ut, pharetra sed, hendrerit a,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (37, 'Sullivan', 'Chancellor', 1, 'augue.scelerisque.mollis@Nuncsedorci.ca', 'ipsum dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (38, 'Nielsen', 'Grant', 1, 'dolor.Donec@mipede.ca', 'nec, malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus in');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (39, 'Hurley', 'Branden', 1, 'velit@vitaeeratvel.com', 'ac, feugiat non, lobortis quis, pede. Suspendisse dui. Fusce diam');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (40, 'Dixon', 'Gabriel', 1, 'faucibus.leo.in@metus.org', 'mollis nec, cursus a, enim. Suspendisse aliquet, sem ut cursus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (41, 'Austin', 'Harper', 1, 'Aliquam@feugiatnon.org', 'aliquam eros turpis non enim. Mauris quis turpis vitae purus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (42, 'Grant', 'Byron', 1, NULL, 'nunc. In at pede. Cras vulputate velit eu sem. Pellentesque');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (43, 'Cotton', 'Benedict', 1, 'pede@gravidasitamet.ca', 'cursus. Integer mollis. Integer tincidunt aliquam arcu. Aliquam ultrices iaculis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (44, 'Sutton', 'Matthew', 1, 'cursus.a.enim@velitCras.com', 'Sed eu nibh vulputate mauris sagittis placerat. Cras dictum ultricies');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (45, 'Odonnell', 'Ignatius', 1, 'Mauris.blandit@semmolestie.com', 'magna. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (46, 'Frost', 'Kirk', 1, 'amet.ultricies@nectempusscelerisque.com', 'Integer vulputate, risus a ultricies adipiscing, enim mi tempor lorem,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (47, 'Mathis', 'Nasim', 1, 'egestas.urna.justo@pede.com', 'ut erat. Sed nunc est, mollis non, cursus non, egestas');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (48, 'Herrera', 'Caldwell', 1, 'ornare@nibhvulputate.com', 'Quisque nonummy ipsum non arcu. Vivamus sit amet risus. Donec');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (49, 'Allison', 'Trevor', 1, 'arcu@non.edu', 'fringilla est. Mauris eu turpis. Nulla aliquet. Proin velit. Sed');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (50, 'Church', 'Perry', 1, 'egestas@mauris.org', 'Duis a mi fringilla mi lacinia mattis. Integer eu lacus.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (51, 'Duncan', 'Keefe', 1, 'scelerisque@auctor.org', 'In tincidunt congue turpis. In condimentum. Donec at arcu. Vestibulum');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (52, 'Skinner', 'Rogan', 1, 'Class.aptent@noncursus.com', 'diam. Sed diam lorem, auctor quis, tristique ac, eleifend vitae,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (53, 'Atkins', 'Lawrence', 1, 'egestas.Aliquam.nec@convallis.com', 'diam lorem, auctor quis, tristique ac, eleifend vitae, erat. Vivamus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (54, 'Rogers', 'Kareem', 1, 'gravida@fermentum.ca', 'lorem, auctor quis, tristique ac, eleifend vitae, erat. Vivamus nisi.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (55, 'Lee', 'Alan', 1, NULL, 'ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu. Vestibulum');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (110, 'Mayo', 'Willow', 2, 'nunc.sit@Integer.ca', 'orci, consectetuer euismod est arcu ac orci. Ut semper pretium');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (56, 'Delgado', 'Ciaran', 1, 'Praesent.interdum.ligula@dictum.ca', 'odio tristique pharetra. Quisque ac libero nec ligula consectetuer rhoncus.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (57, 'Rosa', 'Paul', 1, 'Fusce.feugiat@velitjustonec.com', 'enim commodo hendrerit. Donec porttitor tellus non magna. Nam ligula');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (58, 'Kaufman', 'Keefe', 1, 'ac.facilisis@Suspendisseeleifend.ca', 'sed, facilisis vitae, orci. Phasellus dapibus quam quis diam. Pellentesque');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (59, 'Holt', 'Raymond', 1, 'sem.vitae.aliquam@augue.org', 'porttitor interdum. Sed auctor odio a purus. Duis elementum, dui');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (60, 'Neal', 'Joshua', 1, 'nec@liberoduinec.com', 'enim, gravida sit amet, dapibus id, blandit at, nisi. Cum');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (61, 'Reid', 'Owen', 1, 'dapibus.rutrum@etnetuset.edu', 'libero est, congue a, aliquet vel, vulputate eu, odio. Phasellus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (62, 'Hicks', 'Nehru', 1, 'feugiat.non.lobortis@vel.edu', 'nisi dictum augue malesuada malesuada. Integer id magna et ipsum');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (63, 'Lopez', 'Thomas', 1, 'tellus.id.nunc@lectusquis.edu', 'ullamcorper. Duis at lacus. Quisque purus sapien, gravida non, sollicitudin');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (64, 'Wilcox', 'Darius', 1, 'velit.Aliquam.nisl@massa.edu', 'rutrum magna. Cras convallis convallis dolor. Quisque tincidunt pede ac');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (65, 'Bean', 'Nash', 1, 'tincidunt.Donec@magnaa.ca', 'Sed et libero. Proin mi. Aliquam gravida mauris ut mi.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (66, 'Hartman', 'Marvin', 1, NULL, 'feugiat non, lobortis quis, pede. Suspendisse dui. Fusce diam nunc,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (67, 'Schmidt', 'Quinn', 1, 'vel.vulputate.eu@vulputate.edu', 'eu, eleifend nec, malesuada ut, sem. Nulla interdum. Curabitur dictum.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (68, 'Cooper', 'Carlos', 1, 'sodales.nisi.magna@utnisi.com', 'gravida molestie arcu. Sed eu nibh vulputate mauris sagittis placerat.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (69, 'Rivers', 'Arden', 1, 'Cum@estconguea.com', 'nibh. Donec est mauris, rhoncus id, mollis nec, cursus a,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (70, 'Silva', 'Clinton', 1, 'Sed.molestie@posuere.edu', 'fermentum vel, mauris. Integer sem elit, pharetra ut, pharetra sed,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (71, 'Lang', 'Ulric', 1, 'Curae;@ligulaAeneangravida.ca', 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (72, 'Key', 'Rafael', 1, 'nec.imperdiet@sapiengravidanon.org', 'dolor dolor, tempus non, lacinia at, iaculis quis, pede. Praesent');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (73, 'Blair', 'Prescott', 1, 'sem.Pellentesque.ut@lobortisClassaptent.ca', 'consectetuer adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (74, 'Jensen', 'Lawrence', 1, 'Duis@egetdictum.org', 'neque sed sem egestas blandit. Nam nulla magna, malesuada vel,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (75, 'Clay', 'Nero', 1, 'erat.semper@enim.edu', 'Etiam gravida molestie arcu. Sed eu nibh vulputate mauris sagittis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (76, 'Foley', 'Lev', 1, 'Praesent.eu@ullamcorperDuis.ca', 'pharetra. Nam ac nulla. In tincidunt congue turpis. In condimentum.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (77, 'Rogers', 'Phelan', 1, 'posuere.cubilia@luctus.org', 'purus ac tellus. Suspendisse sed dolor. Fusce mi lorem, vehicula');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (78, 'Bryant', 'Kato', 1, 'interdum@Nullaeuneque.com', 'amet, consectetuer adipiscing elit. Aliquam auctor, velit eget laoreet posuere,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (79, 'Heath', 'Travis', 1, 'vel@nonlorem.ca', 'Nam ac nulla. In tincidunt congue turpis. In condimentum. Donec');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (80, 'Reese', 'Ian', 1, 'lacus.Nulla.tincidunt@dignissimmagna.edu', 'tempus risus. Donec egestas. Duis ac arcu. Nunc mauris. Morbi');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (81, 'Howe', 'Malik', 1, 'in@Sed.ca', 'hymenaeos. Mauris ut quam vel sapien imperdiet ornare. In faucibus.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (82, 'Branch', 'Basil', 1, 'et.nunc.Quisque@quamelementumat.ca', 'Nulla interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (83, 'Weaver', 'Vernon', 1, 'urna.Vivamus@Ut.edu', 'ut ipsum ac mi eleifend egestas. Sed pharetra, felis eget');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (84, 'Bird', 'Yardley', 1, 'magna@sodalesat.ca', 'Proin eget odio. Aliquam vulputate ullamcorper magna. Sed eu eros.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (85, 'Albert', 'Sean', 1, 'Mauris.blandit@vestibulumMauris.com', 'purus, in molestie tortor nibh sit amet orci. Ut sagittis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (86, 'Mullins', 'Cain', 1, 'enim.diam@justo.org', 'leo elementum sem, vitae aliquam eros turpis non enim. Mauris');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (87, 'Diaz', 'Cyrus', 1, 'eros.nec@urnaconvalliserat.edu', 'id enim. Curabitur massa. Vestibulum accumsan neque et nunc. Quisque');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (88, 'Mckay', 'Ferdinand', 1, 'sociosqu.ad@Duismienim.com', 'consectetuer euismod est arcu ac orci. Ut semper pretium neque.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (89, 'Chandler', 'William', 1, 'nec.eleifend.non@aauctor.edu', 'dictum eu, eleifend nec, malesuada ut, sem. Nulla interdum. Curabitur');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (90, 'Jackson', 'Gray', 1, 'fringilla.ornare@nislsemconsequat.ca', 'sollicitudin commodo ipsum. Suspendisse non leo. Vivamus nibh dolor, nonummy');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (91, 'Kelley', 'Erich', 1, 'vel@NulladignissimMaecenas.edu', 'dictum augue malesuada malesuada. Integer id magna et ipsum cursus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (92, 'Porter', 'Noah', 1, 'risus.varius.orci@semper.edu', 'amet lorem semper auctor. Mauris vel turpis. Aliquam adipiscing lobortis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (93, 'Chandler', 'Adrian', 1, 'Aliquam.nisl.Nulla@Proin.ca', 'et tristique pellentesque, tellus sem mollis dui, in sodales elit');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (94, 'Chen', 'Ivor', 1, 'nibh.Phasellus@MorbivehiculaPellentesque.ca', 'arcu. Vestibulum ante ipsum primis in faucibus orci luctus et');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (95, 'Melton', 'August', 1, 'Nam.ligula@ultriciesornare.edu', 'interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (96, 'Lee', 'Warren', 1, 'vestibulum.Mauris@interdum.ca', 'facilisis eget, ipsum. Donec sollicitudin adipiscing ligula. Aenean gravida nunc');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (97, 'Robertson', 'Jamal', 1, 'est@a.ca', 'Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (98, 'Guzman', 'Finn', 1, 'non@Namtempor.com', 'posuere at, velit. Cras lorem lorem, luctus ut, pellentesque eget,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (99, 'Craft', 'Thaddeus', 1, 'ante.blandit.viverra@fermentumvelmauris.ca', 'primis in faucibus orci luctus et ultrices posuere cubilia Curae;');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (100, 'Valenzuela', 'Hunter', 1, 'magna.a.neque@mauris.com', 'purus sapien, gravida non, sollicitudin a, malesuada id, erat. Etiam');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (101, 'Neal', 'Quemby', 2, 'Fusce@Integer.edu', 'ridiculus mus. Aenean eget magna. Suspendisse tristique neque venenatis lacus.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (102, 'Holland', 'Kessie', 2, 'semper.tellus.id@egestasDuisac.edu', 'blandit enim consequat purus. Maecenas libero est, congue a, aliquet');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (103, 'Prince', 'Kylan', 2, 'molestie.arcu@eu.edu', 'dictum eleifend, nunc risus varius orci, in consequat enim diam');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (104, 'Mayer', 'Zephr', 2, 'sit@malesuadafamesac.org', 'Cras eu tellus eu augue porttitor interdum. Sed auctor odio');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (105, 'Mclean', 'Tanya', 2, 'justo.Proin.non@acfeugiatnon.com', 'ligula consectetuer rhoncus. Nullam velit dui, semper et, lacinia vitae,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (106, 'Huff', 'Aimee', 2, 'velit@Proin.org', 'erat semper rutrum. Fusce dolor quam, elementum at, egestas a,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (107, 'Moreno', 'Bethany', 2, 'Suspendisse.ac@Duiscursusdiam.edu', 'nulla. Cras eu tellus eu augue porttitor interdum. Sed auctor');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (108, 'Mcmillan', 'Deanna', 2, NULL, 'Donec dignissim magna a tortor. Nunc commodo auctor velit. Aliquam');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (109, 'Mckee', 'Raya', 2, 'amet@magnaetipsum.ca', 'Phasellus at augue id ante dictum cursus. Nunc mauris elit,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (111, 'Diaz', 'Kai', 2, 'odio.Aliquam@Phasellus.org', 'massa lobortis ultrices. Vivamus rhoncus. Donec est. Nunc ullamcorper, velit');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (112, 'Snider', 'Nelle', 2, 'vulputate@nonlobortis.org', 'dolor. Fusce feugiat. Lorem ipsum dolor sit amet, consectetuer adipiscing');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (113, 'Peterson', 'Uta', 2, 'felis.orci@laciniavitae.org', 'quam quis diam. Pellentesque habitant morbi tristique senectus et netus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (114, 'Foley', 'Claire', 2, 'diam.Sed.diam@lorem.edu', 'tempor arcu. Vestibulum ut eros non enim commodo hendrerit. Donec');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (115, 'Franks', 'Kirsten', 2, 'Proin.velit.Sed@ut.edu', NULL);
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (116, 'Walter', 'Christine', 2, 'penatibus.et.magnis@magna.com', 'sed sem egestas blandit. Nam nulla magna, malesuada vel, convallis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (117, 'Justice', 'Rylee', 2, 'mi@ac.edu', 'Sed auctor odio a purus. Duis elementum, dui quis accumsan');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (118, 'Burris', 'Wyoming', 2, 'augue.porttitor.interdum@euismodetcommodo.edu', 'non, cursus non, egestas a, dui. Cras pellentesque. Sed dictum.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (119, 'Herring', 'Nora', 2, 'ipsum.cursus@suscipitestac.org', 'euismod et, commodo at, libero. Morbi accumsan laoreet ipsum. Curabitur');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (120, 'Rollins', 'Kerry', 2, 'justo@nec.ca', 'blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (121, 'Graham', 'Bethany', 2, NULL, 'elementum sem, vitae aliquam eros turpis non enim. Mauris quis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (122, 'Lang', 'Riley', 2, 'volutpat.ornare@malesuadavelvenenatis.com', 'Sed nunc est, mollis non, cursus non, egestas a, dui.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (123, 'Gibson', 'Velma', 2, 'arcu.iaculis.enim@posuerecubilia.edu', 'condimentum eget, volutpat ornare, facilisis eget, ipsum. Donec sollicitudin adipiscing');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (124, 'Powers', 'Jada', 2, 'elit@Fuscedolorquam.com', 'volutpat ornare, facilisis eget, ipsum. Donec sollicitudin adipiscing ligula. Aenean');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (125, 'Campos', 'TaShya', 2, 'blandit.enim.consequat@eratnonummy.com', NULL);
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (126, 'Mckee', 'Ursula', 2, 'pharetra@arcuac.com', 'a ultricies adipiscing, enim mi tempor lorem, eget mollis lectus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (127, 'Montoya', 'Ann', 2, 'sagittis@urna.com', NULL);
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (128, 'Rosa', 'Oprah', 2, 'nec.tempus.mauris@auctorMaurisvel.edu', 'commodo at, libero. Morbi accumsan laoreet ipsum. Curabitur consequat, lectus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (129, 'Boyer', 'Tasha', 2, 'Nullam@Nullamfeugiatplacerat.org', 'lectus pede, ultrices a, auctor non, feugiat nec, diam. Duis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (130, 'Francis', 'Rhoda', 2, 'purus.Nullam@consectetueradipiscing.org', NULL);
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (131, 'Bates', 'Uta', 2, 'consectetuer@nec.com', 'In nec orci. Donec nibh. Quisque nonummy ipsum non arcu.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (132, 'Kane', 'Constance', 2, 'velit.Cras.lorem@etnunc.edu', 'semper, dui lectus rutrum urna, nec luctus felis purus ac');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (133, 'Santiago', 'Dahlia', 2, 'vel@Sednulla.ca', 'laoreet ipsum. Curabitur consequat, lectus sit amet luctus vulputate, nisi');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (134, 'Garrison', 'Janna', 2, 'pharetra.felis.eget@Suspendissesed.ca', NULL);
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (135, 'Hines', 'Diana', 2, NULL, 'nec luctus felis purus ac tellus. Suspendisse sed dolor. Fusce');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (136, 'Hanson', 'Melyssa', 2, 'et.tristique.pellentesque@etcommodo.com', 'ornare egestas ligula. Nullam feugiat placerat velit. Quisque varius. Nam');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (137, 'Browning', 'Gisela', 2, 'orci.consectetuer.euismod@Inscelerisquescelerisque.org', 'interdum. Curabitur dictum. Phasellus in felis. Nulla tempor augue ac');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (138, 'Chen', 'Hollee', 2, 'Praesent@ProinmiAliquam.edu', 'nibh. Aliquam ornare, libero at auctor ullamcorper, nisl arcu iaculis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (139, 'Cruz', 'Skyler', 2, 'Vestibulum@ac.org', 'Nunc laoreet lectus quis massa. Mauris vestibulum, neque sed dictum');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (140, 'Jennings', 'Justine', 2, 'elementum@seddolor.com', 'enim nec tempus scelerisque, lorem ipsum sodales purus, in molestie');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (141, 'Savage', 'Hadassah', 2, 'magnis@amet.ca', 'egestas rhoncus. Proin nisl sem, consequat nec, mollis vitae, posuere');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (142, 'Carroll', 'Summer', 2, 'lacus.Quisque.purus@loremegetmollis.com', 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (143, 'Rasmussen', 'Gillian', 2, 'elit@et.edu', 'Donec non justo. Proin non massa non ante bibendum ullamcorper.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (144, 'Joseph', 'Jemima', 2, 'senectus.et@nisiaodio.com', 'Suspendisse sagittis. Nullam vitae diam. Proin dolor. Nulla semper tellus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (145, 'Henderson', 'Keiko', 2, 'nibh.sit@tellus.org', 'Mauris vestibulum, neque sed dictum eleifend, nunc risus varius orci,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (146, 'Cole', 'Larissa', 2, 'Nulla.eget@duinec.edu', 'malesuada ut, sem. Nulla interdum. Curabitur dictum. Phasellus in felis.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (147, 'Berry', 'Ima', 2, 'pede.nonummy.ut@turpisAliquam.ca', 'volutpat. Nulla facilisis. Suspendisse commodo tincidunt nibh. Phasellus nulla. Integer');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (148, 'Morales', 'Justina', 2, 'et.rutrum.non@arcuet.com', 'dolor, nonummy ac, feugiat non, lobortis quis, pede. Suspendisse dui.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (149, 'Love', 'Rebekah', 2, 'eget.varius@sem.com', 'vel sapien imperdiet ornare. In faucibus. Morbi vehicula. Pellentesque tincidunt');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (150, 'Owen', 'Noelle', 2, 'non@Nullatincidunt.com', 'nascetur ridiculus mus. Proin vel nisl. Quisque fringilla euismod enim.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (151, 'Rodriguez', 'Fleur', 2, 'Nunc.mauris.elit@luctusCurabitur.edu', 'tempor diam dictum sapien. Aenean massa. Integer vitae nibh. Donec');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (152, 'Andrews', 'Rhea', 2, 'id.magna.et@scelerisquemollisPhasellus.org', 'molestie dapibus ligula. Aliquam erat volutpat. Nulla dignissim. Maecenas ornare');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (153, 'Serrano', 'Vivien', 2, NULL, 'eget, venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (154, 'Chandler', 'Kaye', 2, 'pretium.aliquet.metus@Vestibulumanteipsum.edu', 'lectus. Cum sociis natoque penatibus et magnis dis parturient montes,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (155, 'Lang', 'Stacey', 2, 'arcu.imperdiet.ullamcorper@semut.edu', 'orci, in consequat enim diam vel arcu. Curabitur ut odio');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (156, 'Parrish', 'Shoshana', 2, 'ultricies.ligula.Nullam@Donecnibhenim.ca', 'vel pede blandit congue. In scelerisque scelerisque dui. Suspendisse ac');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (157, 'Hubbard', 'Brielle', 2, 'enim.Sed@temporerat.com', 'erat vel pede blandit congue. In scelerisque scelerisque dui. Suspendisse');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (158, 'Gentry', 'Debra', 2, 'ipsum.primis@tellusSuspendisse.ca', 'odio, auctor vitae, aliquet nec, imperdiet nec, leo. Morbi neque');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (159, 'Guy', 'Rachel', 2, 'mollis.dui.in@massaIntegervitae.edu', 'porttitor scelerisque neque. Nullam nisl. Maecenas malesuada fringilla est. Mauris');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (160, 'Yates', 'Daryl', 2, 'sem.semper.erat@augueeutempor.org', 'Curabitur dictum. Phasellus in felis. Nulla tempor augue ac ipsum.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (161, 'West', 'Freya', 2, 'Cras.dictum.ultricies@lobortis.com', 'in molestie tortor nibh sit amet orci. Ut sagittis lobortis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (162, 'Fields', 'Maryam', 2, 'vitae.velit.egestas@non.org', 'vehicula et, rutrum eu, ultrices sit amet, risus. Donec nibh');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (163, 'Haley', 'Odessa', 2, 'quam@Etiamgravidamolestie.com', 'eu tempor erat neque non quam. Pellentesque habitant morbi tristique');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (164, 'Reese', 'Ignacia', 2, 'mattis.semper.dui@Proin.org', 'ante dictum cursus. Nunc mauris elit, dictum eu, eleifend nec,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (165, 'Pacheco', 'Isabelle', 2, 'augue.eu.tempor@elitAliquam.com', 'scelerisque dui. Suspendisse ac metus vitae velit egestas lacinia. Sed');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (166, 'Michael', 'Alexis', 2, 'Nullam.vitae@mauriseu.com', 'et arcu imperdiet ullamcorper. Duis at lacus. Quisque purus sapien,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (167, 'Velazquez', 'Lenore', 2, 'dictum@montes.org', 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (168, 'Thompson', 'Ifeoma', 2, 'Sed.eu@rutrummagnaCras.com', 'magna sed dui. Fusce aliquam, enim nec tempus scelerisque, lorem');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (169, 'Holloway', 'Aiko', 2, 'commodo@faucibus.org', 'augue eu tellus. Phasellus elit pede, malesuada vel, venenatis vel,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (170, 'Mullen', 'Brynn', 2, 'molestie.pharetra@ridiculusmus.com', 'conubia nostra, per inceptos hymenaeos. Mauris ut quam vel sapien');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (171, 'Cummings', 'Hyacinth', 2, 'pede@fringillaornareplacerat.edu', 'laoreet, libero et tristique pellentesque, tellus sem mollis dui, in');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (172, 'Barr', 'Kelly', 2, 'fringilla.purus.mauris@pedenonummy.com', 'ullamcorper eu, euismod ac, fermentum vel, mauris. Integer sem elit,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (173, 'Curtis', 'MacKenzie', 2, 'non.dui.nec@mattis.ca', 'sit amet metus. Aliquam erat volutpat. Nulla facilisis. Suspendisse commodo');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (174, 'Merrill', 'Deanna', 2, 'pharetra@antelectusconvallis.edu', 'non arcu. Vivamus sit amet risus. Donec egestas. Aliquam nec');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (175, 'Shannon', 'Emily', 2, 'ipsum.primis@Integeridmagna.org', 'ut mi. Duis risus odio, auctor vitae, aliquet nec, imperdiet');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (176, 'Benjamin', 'Jana', 2, 'hendrerit.consectetuer.cursus@famesac.org', 'habitant morbi tristique senectus et netus et malesuada fames ac');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (177, 'Navarro', 'Ingrid', 2, 'ultricies@ornaretortorat.ca', 'nibh enim, gravida sit amet, dapibus id, blandit at, nisi.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (178, 'Carpenter', 'Ursula', 2, 'convallis.dolor@ullamcorpervelit.edu', 'eget lacus. Mauris non dui nec urna suscipit nonummy. Fusce');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (179, 'Wiggins', 'Kyla', 2, 'luctus.vulputate.nisi@ante.ca', 'sem ut cursus luctus, ipsum leo elementum sem, vitae aliquam');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (180, 'Sykes', 'Miranda', 2, 'ridiculus.mus.Proin@DonecegestasDuis.com', 'eu turpis. Nulla aliquet. Proin velit. Sed malesuada augue ut');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (181, 'Obrien', 'Jennifer', 2, 'enim@egetmetus.edu', 'et, rutrum eu, ultrices sit amet, risus. Donec nibh enim,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (182, 'Weiss', 'Leah', 2, 'nec.ligula@fermentum.org', 'suscipit nonummy. Fusce fermentum fermentum arcu. Vestibulum ante ipsum primis');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (183, 'Cobb', 'Kelsey', 2, 'hymenaeos@consectetueradipiscingelit.com', 'netus et malesuada fames ac turpis egestas. Aliquam fringilla cursus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (184, 'Nixon', 'Cara', 2, 'urna.justo@vulputatedui.ca', 'Sed nunc est, mollis non, cursus non, egestas a, dui.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (185, 'Contreras', 'Audrey', 2, 'nisi.dictum.augue@sagittis.edu', 'Fusce aliquet magna a neque. Nullam ut nisi a odio');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (186, 'Frederick', 'Madeson', 2, 'Duis.dignissim@mi.ca', 'enim diam vel arcu. Curabitur ut odio vel est tempor');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (187, 'Jacobson', 'Teegan', 2, 'nunc.risus.varius@dolorvitaedolor.com', 'mauris sapien, cursus in, hendrerit consectetuer, cursus et, magna. Praesent');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (188, 'England', 'Miranda', 2, 'lobortis.ultrices.Vivamus@mollisdui.ca', 'Proin non massa non ante bibendum ullamcorper. Duis cursus, diam');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (189, 'Stein', 'Kai', 2, 'feugiat@ornare.edu', 'enim. Sed nulla ante, iaculis nec, eleifend non, dapibus rutrum,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (190, 'Shannon', 'Judith', 2, 'eget@atlibero.org', 'accumsan laoreet ipsum. Curabitur consequat, lectus sit amet luctus vulputate,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (191, 'Salas', 'Deirdre', 2, 'Donec.at@tinciduntdui.com', 'tincidunt dui augue eu tellus. Phasellus elit pede, malesuada vel,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (192, 'Finley', 'Freya', 2, 'euismod@eu.com', 'mauris. Integer sem elit, pharetra ut, pharetra sed, hendrerit a,');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (193, 'Mcfadden', 'Kathleen', 2, 'ac.mi.eleifend@consectetueradipiscingelit.com', 'blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (194, 'Jacobs', 'Justine', 2, 'sit.amet@velvulputate.ca', 'vulputate eu, odio. Phasellus at augue id ante dictum cursus.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (195, 'Hendrix', 'Cameran', 2, 'nunc.interdum.feugiat@nonummyutmolestie.com', 'sed orci lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (196, 'Kline', 'Nyssa', 2, 'est.ac.facilisis@aliquetmagnaa.org', 'Phasellus dolor elit, pellentesque a, facilisis non, bibendum sed, est.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (197, 'Manning', 'Kiayada', 2, 'sapien@justosit.ca', 'Morbi neque tellus, imperdiet non, vestibulum nec, euismod in, dolor.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (198, 'Blanchard', 'Karyn', 2, 'Donec.felis.orci@Nunccommodo.org', 'malesuada fames ac turpis egestas. Fusce aliquet magna a neque.');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (199, 'Schultz', 'Kimberly', 2, 'in.hendrerit.consectetuer@urnasuscipitnonummy.org', 'in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus');
INSERT INTO customers (id, lastname, firstname, lk_genders_id, email, remarks) VALUES (200, 'Wade', 'Imelda', 2, 'Proin.dolor.Nulla@nislMaecenas.edu', 'malesuada id, erat. Etiam vestibulum massa rutrum magna. Cras convallis');


--
-- Data for Name: lk_countries; Type: TABLE DATA; Schema: jui_datagrid; Owner: postgres
--

INSERT INTO lk_countries (iso_code, country) VALUES ('AF', 'Afghanistan');
INSERT INTO lk_countries (iso_code, country) VALUES ('AX', 'Aland Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('AL', 'Albania');
INSERT INTO lk_countries (iso_code, country) VALUES ('DZ', 'Algeria');
INSERT INTO lk_countries (iso_code, country) VALUES ('AS', 'American Samoa');
INSERT INTO lk_countries (iso_code, country) VALUES ('AD', 'Andorra');
INSERT INTO lk_countries (iso_code, country) VALUES ('AO', 'Angola');
INSERT INTO lk_countries (iso_code, country) VALUES ('AI', 'Anguilla');
INSERT INTO lk_countries (iso_code, country) VALUES ('AQ', 'Antarctica');
INSERT INTO lk_countries (iso_code, country) VALUES ('AG', 'Antigua and Barbuda');
INSERT INTO lk_countries (iso_code, country) VALUES ('AR', 'Argentina');
INSERT INTO lk_countries (iso_code, country) VALUES ('AM', 'Armenia');
INSERT INTO lk_countries (iso_code, country) VALUES ('AW', 'Aruba');
INSERT INTO lk_countries (iso_code, country) VALUES ('AC', 'Ascension Island');
INSERT INTO lk_countries (iso_code, country) VALUES ('AU', 'Australia');
INSERT INTO lk_countries (iso_code, country) VALUES ('AT', 'Austria');
INSERT INTO lk_countries (iso_code, country) VALUES ('AZ', 'Azerbaijan');
INSERT INTO lk_countries (iso_code, country) VALUES ('BS', 'Bahamas');
INSERT INTO lk_countries (iso_code, country) VALUES ('BH', 'Bahrain');
INSERT INTO lk_countries (iso_code, country) VALUES ('BB', 'Barbados');
INSERT INTO lk_countries (iso_code, country) VALUES ('BD', 'Bangladesh');
INSERT INTO lk_countries (iso_code, country) VALUES ('BY', 'Belarus');
INSERT INTO lk_countries (iso_code, country) VALUES ('BE', 'Belgium');
INSERT INTO lk_countries (iso_code, country) VALUES ('BZ', 'Belize');
INSERT INTO lk_countries (iso_code, country) VALUES ('BJ', 'Benin');
INSERT INTO lk_countries (iso_code, country) VALUES ('BM', 'Bermuda');
INSERT INTO lk_countries (iso_code, country) VALUES ('BT', 'Bhutan');
INSERT INTO lk_countries (iso_code, country) VALUES ('BW', 'Botswana');
INSERT INTO lk_countries (iso_code, country) VALUES ('BO', 'Bolivia');
INSERT INTO lk_countries (iso_code, country) VALUES ('BA', 'Bosnia and Herzegovina');
INSERT INTO lk_countries (iso_code, country) VALUES ('BV', 'Bouvet Island');
INSERT INTO lk_countries (iso_code, country) VALUES ('BR', 'Brazil');
INSERT INTO lk_countries (iso_code, country) VALUES ('IO', 'British Indian Ocean Territory');
INSERT INTO lk_countries (iso_code, country) VALUES ('BN', 'Brunei Darussalam');
INSERT INTO lk_countries (iso_code, country) VALUES ('BG', 'Bulgaria');
INSERT INTO lk_countries (iso_code, country) VALUES ('BF', 'Burkina Faso');
INSERT INTO lk_countries (iso_code, country) VALUES ('BI', 'Burundi');
INSERT INTO lk_countries (iso_code, country) VALUES ('KH', 'Cambodia');
INSERT INTO lk_countries (iso_code, country) VALUES ('CM', 'Cameroon');
INSERT INTO lk_countries (iso_code, country) VALUES ('CA', 'Canada');
INSERT INTO lk_countries (iso_code, country) VALUES ('CV', 'Cape Verde');
INSERT INTO lk_countries (iso_code, country) VALUES ('KY', 'Cayman Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('CF', 'Central African Republic');
INSERT INTO lk_countries (iso_code, country) VALUES ('TD', 'Chad');
INSERT INTO lk_countries (iso_code, country) VALUES ('CL', 'Chile');
INSERT INTO lk_countries (iso_code, country) VALUES ('CN', 'China');
INSERT INTO lk_countries (iso_code, country) VALUES ('CX', 'Christmas Island');
INSERT INTO lk_countries (iso_code, country) VALUES ('CC', 'Cocos (Keeling) Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('CO', 'Colombia');
INSERT INTO lk_countries (iso_code, country) VALUES ('KM', 'Comoros');
INSERT INTO lk_countries (iso_code, country) VALUES ('CG', 'Congo');
INSERT INTO lk_countries (iso_code, country) VALUES ('CD', 'Congo, Democratic Republic');
INSERT INTO lk_countries (iso_code, country) VALUES ('CK', 'Cook Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('CR', 'Costa Rica');
INSERT INTO lk_countries (iso_code, country) VALUES ('CI', 'Cote D''Ivoire (Ivory Coast)');
INSERT INTO lk_countries (iso_code, country) VALUES ('HR', 'Croatia (Hrvatska)');
INSERT INTO lk_countries (iso_code, country) VALUES ('CU', 'Cuba');
INSERT INTO lk_countries (iso_code, country) VALUES ('CY', 'Cyprus');
INSERT INTO lk_countries (iso_code, country) VALUES ('CZ', 'Czech Republic');
INSERT INTO lk_countries (iso_code, country) VALUES ('CS', 'Czechoslovakia (former)');
INSERT INTO lk_countries (iso_code, country) VALUES ('DK', 'Denmark');
INSERT INTO lk_countries (iso_code, country) VALUES ('DJ', 'Djibouti');
INSERT INTO lk_countries (iso_code, country) VALUES ('DM', 'Dominica');
INSERT INTO lk_countries (iso_code, country) VALUES ('DO', 'Dominican Republic');
INSERT INTO lk_countries (iso_code, country) VALUES ('TP', 'East Timor');
INSERT INTO lk_countries (iso_code, country) VALUES ('EC', 'Ecuador');
INSERT INTO lk_countries (iso_code, country) VALUES ('EG', 'Egypt');
INSERT INTO lk_countries (iso_code, country) VALUES ('SV', 'El Salvador');
INSERT INTO lk_countries (iso_code, country) VALUES ('GQ', 'Equatorial Guinea');
INSERT INTO lk_countries (iso_code, country) VALUES ('ER', 'Eritrea');
INSERT INTO lk_countries (iso_code, country) VALUES ('EE', 'Estonia');
INSERT INTO lk_countries (iso_code, country) VALUES ('ET', 'Ethiopia');
INSERT INTO lk_countries (iso_code, country) VALUES ('EU', 'European Union');
INSERT INTO lk_countries (iso_code, country) VALUES ('FK', 'Falkland Islands (Malvinas)');
INSERT INTO lk_countries (iso_code, country) VALUES ('FO', 'Faroe Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('FJ', 'Fiji');
INSERT INTO lk_countries (iso_code, country) VALUES ('FI', 'Finland');
INSERT INTO lk_countries (iso_code, country) VALUES ('FR', 'France');
INSERT INTO lk_countries (iso_code, country) VALUES ('FX', 'France, Metropolitan');
INSERT INTO lk_countries (iso_code, country) VALUES ('GF', 'French Guiana');
INSERT INTO lk_countries (iso_code, country) VALUES ('PF', 'French Polynesia');
INSERT INTO lk_countries (iso_code, country) VALUES ('TF', 'French Southern Territories');
INSERT INTO lk_countries (iso_code, country) VALUES ('MK', 'F.Y.R.O.M. (Macedonia)');
INSERT INTO lk_countries (iso_code, country) VALUES ('GA', 'Gabon');
INSERT INTO lk_countries (iso_code, country) VALUES ('GM', 'Gambia');
INSERT INTO lk_countries (iso_code, country) VALUES ('GE', 'Georgia');
INSERT INTO lk_countries (iso_code, country) VALUES ('DE', 'Germany');
INSERT INTO lk_countries (iso_code, country) VALUES ('GH', 'Ghana');
INSERT INTO lk_countries (iso_code, country) VALUES ('GI', 'Gibraltar');
INSERT INTO lk_countries (iso_code, country) VALUES ('GB', 'Great Britain (UK)');
INSERT INTO lk_countries (iso_code, country) VALUES ('GR', 'Greece');
INSERT INTO lk_countries (iso_code, country) VALUES ('GL', 'Greenland');
INSERT INTO lk_countries (iso_code, country) VALUES ('GD', 'Grenada');
INSERT INTO lk_countries (iso_code, country) VALUES ('GP', 'Guadeloupe');
INSERT INTO lk_countries (iso_code, country) VALUES ('GU', 'Guam');
INSERT INTO lk_countries (iso_code, country) VALUES ('GT', 'Guatemala');
INSERT INTO lk_countries (iso_code, country) VALUES ('GG', 'Guernsey');
INSERT INTO lk_countries (iso_code, country) VALUES ('GN', 'Guinea');
INSERT INTO lk_countries (iso_code, country) VALUES ('GW', 'Guinea-Bissau');
INSERT INTO lk_countries (iso_code, country) VALUES ('GY', 'Guyana');
INSERT INTO lk_countries (iso_code, country) VALUES ('HT', 'Haiti');
INSERT INTO lk_countries (iso_code, country) VALUES ('HM', 'Heard and McDonald Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('HN', 'Honduras');
INSERT INTO lk_countries (iso_code, country) VALUES ('HK', 'Hong Kong');
INSERT INTO lk_countries (iso_code, country) VALUES ('HU', 'Hungary');
INSERT INTO lk_countries (iso_code, country) VALUES ('IS', 'Iceland');
INSERT INTO lk_countries (iso_code, country) VALUES ('IN', 'India');
INSERT INTO lk_countries (iso_code, country) VALUES ('ID', 'Indonesia');
INSERT INTO lk_countries (iso_code, country) VALUES ('IR', 'Iran');
INSERT INTO lk_countries (iso_code, country) VALUES ('IQ', 'Iraq');
INSERT INTO lk_countries (iso_code, country) VALUES ('IE', 'Ireland');
INSERT INTO lk_countries (iso_code, country) VALUES ('IL', 'Israel');
INSERT INTO lk_countries (iso_code, country) VALUES ('IM', 'Isle of Man');
INSERT INTO lk_countries (iso_code, country) VALUES ('IT', 'Italy');
INSERT INTO lk_countries (iso_code, country) VALUES ('JE', 'Jersey');
INSERT INTO lk_countries (iso_code, country) VALUES ('JM', 'Jamaica');
INSERT INTO lk_countries (iso_code, country) VALUES ('JP', 'Japan');
INSERT INTO lk_countries (iso_code, country) VALUES ('JO', 'Jordan');
INSERT INTO lk_countries (iso_code, country) VALUES ('KZ', 'Kazakhstan');
INSERT INTO lk_countries (iso_code, country) VALUES ('KE', 'Kenya');
INSERT INTO lk_countries (iso_code, country) VALUES ('KI', 'Kiribati');
INSERT INTO lk_countries (iso_code, country) VALUES ('KP', 'Korea (North)');
INSERT INTO lk_countries (iso_code, country) VALUES ('KR', 'Korea (South)');
INSERT INTO lk_countries (iso_code, country) VALUES ('XK', 'Kosovo*');
INSERT INTO lk_countries (iso_code, country) VALUES ('KW', 'Kuwait');
INSERT INTO lk_countries (iso_code, country) VALUES ('KG', 'Kyrgyzstan');
INSERT INTO lk_countries (iso_code, country) VALUES ('LA', 'Laos');
INSERT INTO lk_countries (iso_code, country) VALUES ('LV', 'Latvia');
INSERT INTO lk_countries (iso_code, country) VALUES ('LB', 'Lebanon');
INSERT INTO lk_countries (iso_code, country) VALUES ('LI', 'Liechtenstein');
INSERT INTO lk_countries (iso_code, country) VALUES ('LR', 'Liberia');
INSERT INTO lk_countries (iso_code, country) VALUES ('LY', 'Libya');
INSERT INTO lk_countries (iso_code, country) VALUES ('LS', 'Lesotho');
INSERT INTO lk_countries (iso_code, country) VALUES ('LT', 'Lithuania');
INSERT INTO lk_countries (iso_code, country) VALUES ('LU', 'Luxembourg');
INSERT INTO lk_countries (iso_code, country) VALUES ('MO', 'Macau');
INSERT INTO lk_countries (iso_code, country) VALUES ('MG', 'Madagascar');
INSERT INTO lk_countries (iso_code, country) VALUES ('MW', 'Malawi');
INSERT INTO lk_countries (iso_code, country) VALUES ('MY', 'Malaysia');
INSERT INTO lk_countries (iso_code, country) VALUES ('MV', 'Maldives');
INSERT INTO lk_countries (iso_code, country) VALUES ('ML', 'Mali');
INSERT INTO lk_countries (iso_code, country) VALUES ('MT', 'Malta');
INSERT INTO lk_countries (iso_code, country) VALUES ('MH', 'Marshall Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('MQ', 'Martinique');
INSERT INTO lk_countries (iso_code, country) VALUES ('MR', 'Mauritania');
INSERT INTO lk_countries (iso_code, country) VALUES ('MU', 'Mauritius');
INSERT INTO lk_countries (iso_code, country) VALUES ('YT', 'Mayotte');
INSERT INTO lk_countries (iso_code, country) VALUES ('MX', 'Mexico');
INSERT INTO lk_countries (iso_code, country) VALUES ('FM', 'Micronesia');
INSERT INTO lk_countries (iso_code, country) VALUES ('MC', 'Monaco');
INSERT INTO lk_countries (iso_code, country) VALUES ('MD', 'Moldova');
INSERT INTO lk_countries (iso_code, country) VALUES ('MN', 'Mongolia');
INSERT INTO lk_countries (iso_code, country) VALUES ('ME', 'Montenegro');
INSERT INTO lk_countries (iso_code, country) VALUES ('MS', 'Montserrat');
INSERT INTO lk_countries (iso_code, country) VALUES ('MA', 'Morocco');
INSERT INTO lk_countries (iso_code, country) VALUES ('MZ', 'Mozambique');
INSERT INTO lk_countries (iso_code, country) VALUES ('MM', 'Myanmar');
INSERT INTO lk_countries (iso_code, country) VALUES ('NA', 'Namibia');
INSERT INTO lk_countries (iso_code, country) VALUES ('NR', 'Nauru');
INSERT INTO lk_countries (iso_code, country) VALUES ('NP', 'Nepal');
INSERT INTO lk_countries (iso_code, country) VALUES ('NL', 'Netherlands');
INSERT INTO lk_countries (iso_code, country) VALUES ('AN', 'Netherlands Antilles');
INSERT INTO lk_countries (iso_code, country) VALUES ('NT', 'Neutral Zone');
INSERT INTO lk_countries (iso_code, country) VALUES ('NC', 'New Caledonia');
INSERT INTO lk_countries (iso_code, country) VALUES ('NZ', 'New Zealand (Aotearoa)');
INSERT INTO lk_countries (iso_code, country) VALUES ('NI', 'Nicaragua');
INSERT INTO lk_countries (iso_code, country) VALUES ('NE', 'Niger');
INSERT INTO lk_countries (iso_code, country) VALUES ('NG', 'Nigeria');
INSERT INTO lk_countries (iso_code, country) VALUES ('NU', 'Niue');
INSERT INTO lk_countries (iso_code, country) VALUES ('NF', 'Norfolk Island');
INSERT INTO lk_countries (iso_code, country) VALUES ('MP', 'Northern Mariana Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('NO', 'Norway');
INSERT INTO lk_countries (iso_code, country) VALUES ('OM', 'Oman');
INSERT INTO lk_countries (iso_code, country) VALUES ('PK', 'Pakistan');
INSERT INTO lk_countries (iso_code, country) VALUES ('PW', 'Palau');
INSERT INTO lk_countries (iso_code, country) VALUES ('PS', 'Palestinian Territory, Occupied');
INSERT INTO lk_countries (iso_code, country) VALUES ('PA', 'Panama');
INSERT INTO lk_countries (iso_code, country) VALUES ('PG', 'Papua New Guinea');
INSERT INTO lk_countries (iso_code, country) VALUES ('PY', 'Paraguay');
INSERT INTO lk_countries (iso_code, country) VALUES ('PE', 'Peru');
INSERT INTO lk_countries (iso_code, country) VALUES ('PH', 'Philippines');
INSERT INTO lk_countries (iso_code, country) VALUES ('PN', 'Pitcairn');
INSERT INTO lk_countries (iso_code, country) VALUES ('PL', 'Poland');
INSERT INTO lk_countries (iso_code, country) VALUES ('PT', 'Portugal');
INSERT INTO lk_countries (iso_code, country) VALUES ('PR', 'Puerto Rico');
INSERT INTO lk_countries (iso_code, country) VALUES ('QA', 'Qatar');
INSERT INTO lk_countries (iso_code, country) VALUES ('RE', 'Reunion');
INSERT INTO lk_countries (iso_code, country) VALUES ('RO', 'Romania');
INSERT INTO lk_countries (iso_code, country) VALUES ('RU', 'Russian Federation');
INSERT INTO lk_countries (iso_code, country) VALUES ('RW', 'Rwanda');
INSERT INTO lk_countries (iso_code, country) VALUES ('GS', 'S. Georgia and S. Sandwich Isls.');
INSERT INTO lk_countries (iso_code, country) VALUES ('SH', 'Saint Helena');
INSERT INTO lk_countries (iso_code, country) VALUES ('KN', 'Saint Kitts and Nevis');
INSERT INTO lk_countries (iso_code, country) VALUES ('LC', 'Saint Lucia');
INSERT INTO lk_countries (iso_code, country) VALUES ('MF', 'Saint Martin');
INSERT INTO lk_countries (iso_code, country) VALUES ('VC', 'Saint Vincent & the Grenadines');
INSERT INTO lk_countries (iso_code, country) VALUES ('WS', 'Samoa');
INSERT INTO lk_countries (iso_code, country) VALUES ('SM', 'San Marino');
INSERT INTO lk_countries (iso_code, country) VALUES ('ST', 'Sao Tome and Principe');
INSERT INTO lk_countries (iso_code, country) VALUES ('SA', 'Saudi Arabia');
INSERT INTO lk_countries (iso_code, country) VALUES ('SN', 'Senegal');
INSERT INTO lk_countries (iso_code, country) VALUES ('RS', 'Serbia');
INSERT INTO lk_countries (iso_code, country) VALUES ('YU', 'Serbia and Montenegro (former)');
INSERT INTO lk_countries (iso_code, country) VALUES ('SC', 'Seychelles');
INSERT INTO lk_countries (iso_code, country) VALUES ('SL', 'Sierra Leone');
INSERT INTO lk_countries (iso_code, country) VALUES ('SG', 'Singapore');
INSERT INTO lk_countries (iso_code, country) VALUES ('SI', 'Slovenia');
INSERT INTO lk_countries (iso_code, country) VALUES ('SK', 'Slovak Republic');
INSERT INTO lk_countries (iso_code, country) VALUES ('SB', 'Solomon Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('SO', 'Somalia');
INSERT INTO lk_countries (iso_code, country) VALUES ('ZA', 'South Africa');
INSERT INTO lk_countries (iso_code, country) VALUES ('SS', 'South Sudan');
INSERT INTO lk_countries (iso_code, country) VALUES ('ES', 'Spain');
INSERT INTO lk_countries (iso_code, country) VALUES ('LK', 'Sri Lanka');
INSERT INTO lk_countries (iso_code, country) VALUES ('SD', 'Sudan');
INSERT INTO lk_countries (iso_code, country) VALUES ('SR', 'Suriname');
INSERT INTO lk_countries (iso_code, country) VALUES ('SJ', 'Svalbard & Jan Mayen Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('SZ', 'Swaziland');
INSERT INTO lk_countries (iso_code, country) VALUES ('SE', 'Sweden');
INSERT INTO lk_countries (iso_code, country) VALUES ('CH', 'Switzerland');
INSERT INTO lk_countries (iso_code, country) VALUES ('SY', 'Syria');
INSERT INTO lk_countries (iso_code, country) VALUES ('TW', 'Taiwan');
INSERT INTO lk_countries (iso_code, country) VALUES ('TJ', 'Tajikistan');
INSERT INTO lk_countries (iso_code, country) VALUES ('TZ', 'Tanzania');
INSERT INTO lk_countries (iso_code, country) VALUES ('TH', 'Thailand');
INSERT INTO lk_countries (iso_code, country) VALUES ('TG', 'Togo');
INSERT INTO lk_countries (iso_code, country) VALUES ('TK', 'Tokelau');
INSERT INTO lk_countries (iso_code, country) VALUES ('TO', 'Tonga');
INSERT INTO lk_countries (iso_code, country) VALUES ('TT', 'Trinidad and Tobago');
INSERT INTO lk_countries (iso_code, country) VALUES ('TN', 'Tunisia');
INSERT INTO lk_countries (iso_code, country) VALUES ('TR', 'Turkey');
INSERT INTO lk_countries (iso_code, country) VALUES ('TM', 'Turkmenistan');
INSERT INTO lk_countries (iso_code, country) VALUES ('TC', 'Turks and Caicos Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('TV', 'Tuvalu');
INSERT INTO lk_countries (iso_code, country) VALUES ('UG', 'Uganda');
INSERT INTO lk_countries (iso_code, country) VALUES ('UA', 'Ukraine');
INSERT INTO lk_countries (iso_code, country) VALUES ('AE', 'United Arab Emirates');
INSERT INTO lk_countries (iso_code, country) VALUES ('UK', 'United Kingdom');
INSERT INTO lk_countries (iso_code, country) VALUES ('US', 'United States');
INSERT INTO lk_countries (iso_code, country) VALUES ('UM', 'US Minor Outlying Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('UY', 'Uruguay');
INSERT INTO lk_countries (iso_code, country) VALUES ('SU', 'USSR (former)');
INSERT INTO lk_countries (iso_code, country) VALUES ('UZ', 'Uzbekistan');
INSERT INTO lk_countries (iso_code, country) VALUES ('VU', 'Vanuatu');
INSERT INTO lk_countries (iso_code, country) VALUES ('VA', 'Vatican City State (Holy See)');
INSERT INTO lk_countries (iso_code, country) VALUES ('VE', 'Venezuela');
INSERT INTO lk_countries (iso_code, country) VALUES ('VN', 'Viet Nam');
INSERT INTO lk_countries (iso_code, country) VALUES ('VG', 'British Virgin Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('VI', 'Virgin Islands (U.S.)');
INSERT INTO lk_countries (iso_code, country) VALUES ('WF', 'Wallis and Futuna Islands');
INSERT INTO lk_countries (iso_code, country) VALUES ('EH', 'Western Sahara');
INSERT INTO lk_countries (iso_code, country) VALUES ('YE', 'Yemen');
INSERT INTO lk_countries (iso_code, country) VALUES ('ZM', 'Zambia');
INSERT INTO lk_countries (iso_code, country) VALUES ('ZR', 'Zaire');
INSERT INTO lk_countries (iso_code, country) VALUES ('ZW', 'Zimbabwe');


--
-- Data for Name: lk_genders; Type: TABLE DATA; Schema: jui_datagrid; Owner: postgres
--

INSERT INTO lk_genders (id, gender, display_order) VALUES (1, 'male', 1);
INSERT INTO lk_genders (id, gender, display_order) VALUES (2, 'female', 2);


--
-- Name: customers_pkey; Type: CONSTRAINT; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: lk_genders_gender_key; Type: CONSTRAINT; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY lk_genders
    ADD CONSTRAINT lk_genders_gender_key UNIQUE (gender);


--
-- Name: lk_genders_pkey; Type: CONSTRAINT; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY lk_genders
    ADD CONSTRAINT lk_genders_pkey PRIMARY KEY (id);


--
-- Name: customers_customers_ix1; Type: INDEX; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

CREATE INDEX customers_customers_ix1 ON customers USING btree (lastname);


--
-- Name: customers_customers_ix2; Type: INDEX; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

CREATE INDEX customers_customers_ix2 ON customers USING btree (firstname);


--
-- Name: customers_customers_ix3; Type: INDEX; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

CREATE INDEX customers_customers_ix3 ON customers USING btree (lk_genders_id);


--
-- Name: lk_genders_lk_genders_ix2; Type: INDEX; Schema: jui_datagrid; Owner: postgres; Tablespace: 
--

CREATE INDEX lk_genders_lk_genders_ix2 ON lk_genders USING btree (display_order);


--
-- Name: customers_lk_genders_id_fkey; Type: FK CONSTRAINT; Schema: jui_datagrid; Owner: postgres
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_lk_genders_id_fkey FOREIGN KEY (lk_genders_id) REFERENCES lk_genders(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

