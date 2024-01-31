--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5
-- Dumped by pg_dump version 15.3

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
-- Name: Megillah; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Megillah" (
    id integer NOT NULL,
    issue integer NOT NULL,
    "releaseDate" timestamp(3) without time zone,
    iframe text,
    "thumbnailPath" text
);


ALTER TABLE public."Megillah" OWNER TO "default";

--
-- Name: Megillah_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."Megillah_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Megillah_id_seq" OWNER TO "default";

--
-- Name: Megillah_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."Megillah_id_seq" OWNED BY public."Megillah".id;


--
-- Name: Post; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Post" OWNER TO "default";

--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Post_id_seq" OWNER TO "default";

--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "default";

--
-- Name: Megillah id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Megillah" ALTER COLUMN id SET DEFAULT nextval('public."Megillah_id_seq"'::regclass);


--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Data for Name: Megillah; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Megillah" (id, issue, "releaseDate", iframe, "thumbnailPath") FROM stdin;
1	91	2008-08-01 04:00:00	https://drive.google.com/file/d/1qOCNTyVlYYAo-8YHstuJrDPk8HuVGqhM/preview	\N
2	92	2009-02-01 05:00:00	https://drive.google.com/file/d/1-52aYjRUUlPmJjkkznZ4PIp0SnCUR3jR/preview	\N
3	93	2009-07-01 04:00:00	https://drive.google.com/file/d/18B2Hxl-M9zzJLpvtwYR2sP9g6PmbrKUP/preview	\N
4	94	2009-11-01 04:00:00	https://drive.google.com/file/d/1GxE9jpVFEUPj_DS9LxnMNPrcFMsao7yS/preview	\N
5	95	2010-03-01 05:00:00	https://drive.google.com/file/d/0B13GzJI5wK8kaWxDbURTV2J3MHM/preview	\N
6	96	2010-08-01 04:00:00	https://drive.google.com/file/d/1SUqYwQHRFRgDhoNSzthzFbU6d-_dWygg/preview	\N
7	97	2011-01-01 05:00:00	https://drive.google.com/file/d/13vJZn837xoOeoCMuOAacfCZpOKpAzf_1/preview	\N
8	98	2011-07-01 04:00:00	https://drive.google.com/file/d/1ig2WsYUYybR6MEqq4FoeM0mwIqqJsUxV/preview	\N
9	99	2012-01-01 05:00:00	https://drive.google.com/file/d/1fMYvoZw7IhpnLXgQ-gT7wR_WFCPrLgf6/preview	\N
10	100	2022-03-01 05:00:00	https://drive.google.com/file/d/1ibzXOSwankYYS9Hej84tYJ311gFv12Zt/preview	/thumbnails/100
11	101	2022-09-01 04:00:00	https://drive.google.com/file/d/10Uqdh0wFvMzF-3Zj2h4jKqqRmmJjSDSa/preview	/thumbnails/101
12	102	2023-04-01 04:00:00	https://drive.google.com/file/d/1WAJou9DNlibDvpGk6KAZkWbmEQPv-luc/preview	/thumbnails/102
13	103	2023-10-01 04:00:00	https://drive.google.com/file/d/1IK2glT30CJEtz5IkWMyXPlDz00DgPT9W/preview	/thumbnails/103
14	1	1983-09-01 04:00:00	preview	\N
15	2	1983-10-01 04:00:00	preview	\N
16	3	1983-11-01 05:00:00	preview	\N
17	4	1983-12-01 05:00:00	preview	\N
18	5	\N	preview	\N
19	6	1984-02-01 05:00:00	preview	\N
20	7	\N	preview	\N
21	8	1984-05-01 04:00:00	preview	\N
22	9	1984-05-01 04:00:00	preview	\N
23	10	1984-06-01 04:00:00	preview	\N
24	11	\N	preview	\N
25	12	1985-01-01 05:00:00	preview	\N
26	13	\N	preview	\N
27	14	\N	preview	\N
28	15	\N	preview	\N
29	16	\N	preview	\N
30	17	1985-12-01 05:00:00	preview	\N
31	18	1986-02-01 05:00:00	preview	\N
32	19	1986-04-01 05:00:00	preview	\N
33	20	\N	preview	\N
34	21	1986-09-01 04:00:00	preview	\N
35	22	\N	preview	\N
36	23	1987-04-01 05:00:00	preview	\N
37	24	1987-09-01 04:00:00	preview	\N
38	25	1988-01-01 05:00:00	preview	\N
39	26	1988-07-01 04:00:00	preview	\N
40	27	1988-12-01 05:00:00	preview	\N
41	28	1989-06-01 04:00:00	preview	\N
42	29	1989-11-01 05:00:00	preview	\N
43	30	1990-03-01 05:00:00	preview	\N
44	31	1990-09-01 04:00:00	preview	\N
45	32	1991-04-01 05:00:00	preview	\N
46	33	1991-07-01 04:00:00	preview	\N
47	34	1991-10-01 04:00:00	preview	\N
48	35	1992-01-01 05:00:00	preview	\N
49	36	1992-04-01 05:00:00	preview	\N
50	37	1992-07-01 04:00:00	preview	\N
51	38	1992-10-01 04:00:00	preview	\N
52	39	1993-01-01 05:00:00	preview	\N
53	40	1993-04-01 05:00:00	preview	\N
54	41	1993-07-01 04:00:00	preview	\N
55	42	1993-10-01 04:00:00	preview	\N
56	43	1994-01-01 05:00:00	preview	\N
57	44	1994-07-01 04:00:00	preview	\N
58	45	1994-07-01 04:00:00	preview	\N
59	46	1994-10-01 04:00:00	preview	\N
60	47	1995-01-01 05:00:00	preview	\N
61	48	1995-04-01 05:00:00	preview	\N
62	49	1995-07-01 04:00:00	preview	\N
63	50	1995-10-01 04:00:00	preview	\N
64	51	1996-01-01 05:00:00	preview	\N
65	52	1996-04-01 05:00:00	preview	\N
66	53	1996-07-01 04:00:00	preview	\N
67	54	1996-10-01 04:00:00	preview	\N
68	55	1997-01-01 05:00:00	preview	\N
69	56	1997-04-01 05:00:00	preview	\N
70	57	1997-07-01 04:00:00	preview	\N
71	58	1997-10-01 04:00:00	preview	\N
72	59	1998-01-01 05:00:00	preview	\N
73	60	1998-04-01 05:00:00	preview	\N
74	61	1998-07-01 04:00:00	preview	\N
75	62	1998-10-01 04:00:00	preview	\N
76	63	1999-01-01 05:00:00	preview	\N
77	64	1998-04-01 05:00:00	preview	\N
78	65	1999-07-01 04:00:00	preview	\N
79	66	1999-10-01 04:00:00	preview	\N
80	67	2000-01-01 05:00:00	preview	\N
81	68	2000-04-01 05:00:00	preview	\N
82	69	2000-07-01 04:00:00	preview	\N
83	70	2000-10-01 04:00:00	preview	\N
84	71	2001-01-01 05:00:00	preview	\N
85	72	2001-04-01 05:00:00	preview	\N
86	73	2001-07-01 04:00:00	preview	\N
87	74	2001-10-01 04:00:00	preview	\N
88	75	2002-01-01 05:00:00	preview	\N
89	76	2002-04-01 05:00:00	preview	\N
90	77	2002-07-01 04:00:00	preview	\N
91	78	2002-10-01 04:00:00	preview	\N
92	79	2003-01-01 05:00:00	preview	\N
93	80	2003-07-01 04:00:00	preview	\N
94	81	2004-01-01 05:00:00	preview	\N
95	82	2004-07-01 04:00:00	preview	\N
96	83	2005-01-01 05:00:00	preview	\N
97	84	2005-07-01 04:00:00	preview	\N
98	85	2006-01-01 05:00:00	preview	\N
99	86	\N	preview	\N
100	87	\N	preview	\N
101	88	\N	preview	\N
102	89	\N	preview	\N
103	90	\N	preview	\N
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."Post" (id, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ca7759cb-e0bd-4a5e-ac6c-68a85b22359f	5a2d27c934bbe53f56c1ca662453202041da146cf877a7f50099e6daed7ecd7e	2024-01-24 00:28:39.463292+00	20240123150946_init	\N	\N	2024-01-24 00:28:39.36442+00	1
45690071-80a7-4a69-afff-f6e7958e8853	7363ceebd87055be322525c376620392c3579de96ddd8d080abb66b5dda34e7c	2024-01-24 00:28:39.591677+00	20240123165445_megillah	\N	\N	2024-01-24 00:28:39.499168+00	1
974e79fd-bfa2-4e60-9fa8-2bad43ffd623	bd65d1daba6c2800a0a777aafe0345e1b11253352dd5defe29312d583d322335	2024-01-24 00:28:39.721841+00	20240123171343_megillah_release_date	\N	\N	2024-01-24 00:28:39.628894+00	1
f4e3c40f-502e-43e8-b969-5cd8602e1984	0a5a59bf3cedca6c6cb947c5cf33942b809157d4ecff58f5c0a0aa97aa4c77cc	2024-01-24 00:28:39.863714+00	20240123174618_megillah_thumbnail_path	\N	\N	2024-01-24 00:28:39.766476+00	1
b17e2435-6e57-47e6-a247-a62ac96780dc	769770347e2992b8333dd05d61a3079b530bc834cbc36ce845dd60df89a1c1bb	2024-01-24 00:28:40.007631+00	20240123211846_rename_pdfpath_to_iframe	\N	\N	2024-01-24 00:28:39.90123+00	1
\.


--
-- Name: Megillah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."Megillah_id_seq"', 103, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public."Post_id_seq"', 1, false);


--
-- Name: Megillah Megillah_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Megillah"
    ADD CONSTRAINT "Megillah_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Post_name_idx; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX "Post_name_idx" ON public."Post" USING btree (name);


--
-- PostgreSQL database dump complete
--

