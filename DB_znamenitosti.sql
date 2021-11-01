--
-- PostgreSQL database dump
--

-- Dumped from database version 13.2
-- Dumped by pg_dump version 13.2

-- Started on 2021-11-01 19:56:13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 200 (class 1259 OID 25039)
-- Name: architect; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.architect (
    architectname character varying(60) NOT NULL,
    architectsurname character varying(80),
    architectid integer NOT NULL
);


ALTER TABLE public.architect OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 25049)
-- Name: city; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.city (
    cityname character varying(60) NOT NULL,
    countryname character varying(100) NOT NULL
);


ALTER TABLE public.city OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 25044)
-- Name: country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country (
    countryname character varying(100) NOT NULL
);


ALTER TABLE public.country OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 25059)
-- Name: landmark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.landmark (
    landmarkname character varying(60) NOT NULL,
    century integer NOT NULL,
    type character varying(100) NOT NULL,
    height integer NOT NULL,
    artstyle character varying(60) NOT NULL,
    landmarkid integer NOT NULL,
    cityname character varying(60) NOT NULL
);


ALTER TABLE public.landmark OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 25069)
-- Name: landmarkarch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.landmarkarch (
    landmarkid integer NOT NULL,
    architectid integer NOT NULL
);


ALTER TABLE public.landmarkarch OWNER TO postgres;

--
-- TOC entry 3008 (class 0 OID 25039)
-- Dependencies: 200
-- Data for Name: architect; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.architect (architectname, architectsurname, architectid) FROM stdin;
Stephen	Sauvestre	1
Frank	Anatole	2
Joanna	Bailey	3
Nic	Bailey	4
Julia	Barfield	5
Steven	Chilton	6
Malcolm	Cook	7
David	Marks	8
Mark	Sparrowhawk	9
Antoni	Gaudi	10
Frédéric Auguste	Bartholdi	11
Ivan	Barma	12
Postnik	Yakovlev	13
Ustad Ahmad	Lahauri	14
Jorn	Utzon	15
Ictinus		16
Callicrates		17
Titus	Vespasian	18
Paul	Landowski	19
Heitor da Silva	Costa	20
Gheorghe	Leonida	21
Albert	Caquot	22
Augustus	Pugin	23
\.


--
-- TOC entry 3010 (class 0 OID 25049)
-- Dependencies: 202
-- Data for Name: city; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.city (cityname, countryname) FROM stdin;
Paris	France
London	United Kingdom
New York	United States of America
Moscow	Russia
Athens	Greece
Barcelona	Spain
Rio de Janero	Brazil
Rome	Italy
Berlin	Germany
Beijing	China
Sydney	Australia
Agra	India
Lisbon	Portugal
Helsinki	Finland
Tokyo	Japan
Zagreb	Croatia
Mexico City	Mexico
Toronto	Canada
\.


--
-- TOC entry 3009 (class 0 OID 25044)
-- Dependencies: 201
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.country (countryname) FROM stdin;
France
United Kingdom
United States of America
Russia
Greece
Spain
Brazil
Italy
Germany
China
Australia
India
Portugal
Finland
Japan
Croatia
Mexico
Canada
\.


--
-- TOC entry 3011 (class 0 OID 25059)
-- Dependencies: 203
-- Data for Name: landmark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.landmark (landmarkname, century, type, height, artstyle, landmarkid, cityname) FROM stdin;
Eiffel Tower	19	Observation tower	324	undefined	1	Paris
London Eye	20	Observation wheel	135	modern	2	London
Sagrada Familia	19	Minor basilica	170	neoclassic	3	Barcelona
Statue of Liberty	19	Statue	93	neoclassic	4	New York
Saint Basils Cathedral	16	Cathedral	48	undefined	5	Moscow
Taj Mahal	17	Mausoleum	73	mughal	6	Agra
Sydney Opera House	20	Performing arts centre	65	expressionism	7	Sydney
Big Ben	19	Clock tower	96	gothic	8	London
Colosseum	1	Amphitheatre	48	Ancient Roman	9	Rome
Christ the Redeemer	21	Statue	30	art deco	10	Rio de Janero
\.


--
-- TOC entry 3012 (class 0 OID 25069)
-- Dependencies: 204
-- Data for Name: landmarkarch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.landmarkarch (landmarkid, architectid) FROM stdin;
1	1
2	2
2	3
2	4
2	5
2	6
2	7
2	8
2	9
3	10
4	11
5	12
5	13
6	14
7	15
8	23
9	18
10	19
10	20
10	21
10	22
\.


--
-- TOC entry 2865 (class 2606 OID 25043)
-- Name: architect architect_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.architect
    ADD CONSTRAINT architect_pkey PRIMARY KEY (architectid);


--
-- TOC entry 2869 (class 2606 OID 25053)
-- Name: city city_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT city_pkey PRIMARY KEY (cityname);


--
-- TOC entry 2867 (class 2606 OID 25048)
-- Name: country country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_pkey PRIMARY KEY (countryname);


--
-- TOC entry 2871 (class 2606 OID 25063)
-- Name: landmark landmark_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landmark
    ADD CONSTRAINT landmark_pkey PRIMARY KEY (landmarkid);


--
-- TOC entry 2873 (class 2606 OID 25073)
-- Name: landmarkarch landmarkarch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landmarkarch
    ADD CONSTRAINT landmarkarch_pkey PRIMARY KEY (landmarkid, architectid);


--
-- TOC entry 2874 (class 2606 OID 25054)
-- Name: city city_countryname_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.city
    ADD CONSTRAINT city_countryname_fkey FOREIGN KEY (countryname) REFERENCES public.country(countryname);


--
-- TOC entry 2875 (class 2606 OID 25064)
-- Name: landmark landmark_cityname_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landmark
    ADD CONSTRAINT landmark_cityname_fkey FOREIGN KEY (cityname) REFERENCES public.city(cityname);


--
-- TOC entry 2877 (class 2606 OID 25079)
-- Name: landmarkarch landmarkarch_architectid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landmarkarch
    ADD CONSTRAINT landmarkarch_architectid_fkey FOREIGN KEY (architectid) REFERENCES public.architect(architectid);


--
-- TOC entry 2876 (class 2606 OID 25074)
-- Name: landmarkarch landmarkarch_landmarkid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landmarkarch
    ADD CONSTRAINT landmarkarch_landmarkid_fkey FOREIGN KEY (landmarkid) REFERENCES public.landmark(landmarkid);


-- Completed on 2021-11-01 19:56:13

--
-- PostgreSQL database dump complete
--

