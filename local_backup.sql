--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
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
-- Name: Megillah; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Megillah" (
    id integer NOT NULL,
    issue integer NOT NULL,
    "releaseDate" timestamp(3) without time zone,
    "thumbnailPath" text,
    url text
);


ALTER TABLE public."Megillah" OWNER TO postgres;

--
-- Name: Megillah_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Megillah_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Megillah_id_seq" OWNER TO postgres;

--
-- Name: Megillah_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Megillah_id_seq" OWNED BY public."Megillah".id;


--
-- Name: Post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Post" OWNER TO postgres;

--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Post_id_seq" OWNER TO postgres;

--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Megillah id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Megillah" ALTER COLUMN id SET DEFAULT nextval('public."Megillah_id_seq"'::regclass);


--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Data for Name: Megillah; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Megillah" (id, issue, "releaseDate", "thumbnailPath", url) FROM stdin;
25	12	1985-01-01 05:00:00	\N	\N
26	13	\N	\N	\N
27	14	\N	\N	\N
28	15	\N	\N	\N
29	16	\N	\N	\N
30	17	1985-12-01 05:00:00	\N	\N
31	18	1986-02-01 05:00:00	\N	\N
33	20	\N	\N	\N
34	21	1986-09-01 04:00:00	\N	\N
35	22	\N	\N	\N
36	23	1987-04-01 05:00:00	\N	\N
37	24	1987-09-01 04:00:00	\N	\N
38	25	1988-01-01 05:00:00	\N	\N
39	26	1988-07-01 04:00:00	\N	\N
40	27	1988-12-01 05:00:00	\N	\N
44	31	1990-09-01 04:00:00	\N	\N
51	38	1992-10-01 04:00:00	\N	\N
60	47	1995-01-01 05:00:00	\N	\N
76	63	1999-01-01 05:00:00	\N	\N
99	86	\N	\N	\N
100	87	\N	\N	\N
101	88	\N	\N	\N
102	89	\N	\N	\N
103	90	\N	\N	\N
23	10	1984-06-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah%20%2810%29.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=xZnYFr0XqpRR0qb9Pbj%2B5arj5VrubgqeayLBkUHKk1AbXamfrLPx48BWuUMlIh4nQGl2mb1fNHG6%2FZNhGGLs%2Fxn1OT7sRw7g%2F16RzpFjJ%2F5BbUsLlu%2FLowf3%2FqXv3lf67BqUuFqfoLVtDz6HOzBavgoBYviqz9OvwLSc5xPSKVn5nN9igKu%2FX0pS6YUT%2BGP4ToiGHpCsxHRyPU04ueaZNXrX4qxNUkFEamfLVkJriD7Dp4%2FZC5CWMl6dCnhjuajs6HVKLtnd8ndqTGkzNB9u3lIh%2F8H1rC2ouK8sXsmbTNabuETqAsilq1HQrVzILdUQ0%2B5ViUUzctKJKDdV9DFu8w%3D%3D
24	11	\N	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah%20%2811%29.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=GnfNTo8QVDf40Ry8iifdUD1mwOC8PFL73Juu4eg03%2FoNH1GSYlmfx9EEaKzYOjlCn2Sj19stlOag7sZuWw8qn1lGi8V8wFAtnJ6lLNsQTBmljTPCOnCnXUsvdPWuaTq7gpb9o1PE7hvIHq6QB1aY%2FWt77iIblKcIac7c15akrRbpgqXFg62B1nn3LTxeOkVmR0te1TILInI7%2FrNN%2FjR%2BtQh%2FuIJ1xVLuRDfAQ3Zsu9PlTrNBhJaJX0JJlA1LBaC37JYlV%2BYrlOXZcjgD%2B1PxDfOMliLeW2vu3JKLoAChB%2B84JHar2oIQnc7DMpMkj7s80M7XxpVXmXAi6BP9BpLZyw%3D%3D
15	2	1983-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah%20%282%29.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=PQT052C0M0ZBrhep9MVV%2FR8y0%2BU20huy%2BPTXwCkUYuDgN5ic20iKsNfpAAZWQJwMEhKNVPbk3aUsfQm7aqAxo5jTxf82R4OFdJCuF97IpWrhYui9DvpaOyeni8ZXtfJj%2BDdcyuAKcL%2Byke3oQ%2Fh6Mfed5Ml15WvI%2FGkzeN2vZKQWml6NPr8PWKMEGu7OmXv3%2FUC4WKerov6v7ky6LbEk%2FrKmwMtBPLqPA8hcR7aqVcJIRqYqUMd67nnpYnO0HFGjLd%2FF1kfXtNWgkrbqHmKsh1USv8Matq5wIcq2sH8wvZo6TFNS5nXarmJNE2LNPG9rkwHfbrVRK0iYb1WhnAecig%3D%3D
53	40	1993-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Eighth%20Year%2C%20Number%2040%2C%20Nisan%205753%2C%20April%201993.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=fFMx23Q6SFkky6os8oGyNMk8GmH9%2FpyrENoT8YvZFTBRSyzuzR1FEgPpCLdoa1sem2JMu285px%2BVvHYAYpq4FO2Vz9KpeGUVYrVIFzy1wCFtyKTRZacVjImeJgmMsDiYT8q4KPQJLPfu4kk097Gx7zCxqZRHT%2B1ax23DQCIXAqNJJ4XUBv4DK%2FMbtcgls05kFxkQ8exEkd6a%2FKujLCyVaC%2BA1S%2Fc2klsjPil3OBVLjhEOyC%2B98NvV%2BeMcprkAgHwrC88eWiH%2BP2e5wjAZ3bZmn%2B1PfE3hdsaTsDl2dqu8EAEzUEUKpBYuHTVzHeymwX8AMYxyUyIuMK8BBasV2hE6A%3D%3D
57	44	1994-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Tenth%20Year%2C%20Number%2044%2CIyar%205754%2C%20April%201994.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=qPDZ%2FtL0WjBMc3WhnQNBxpsHr8XSXs99Yy1QMOM0TLH73BPtFOKSjqMuNmKQsCynkslnDUUQZU8qFfEcg9jRKbUti%2BaOvi43BL5Uct%2FudBxWNM2f1R9fnJdGkmhiaRocFpwA9SYHeiW1v7MLM0i0PCPoSEdcYkLDaqfR4njN%2F8glN51THbnsiNcGMa1vEFztJldAB65gc9xOcXbKUYpPC1092IAPS67%2F0PBgDUKBBrPKIZqWlQSjd9OKbRpQCvGV2pGR8eU%2B5tYBhgcBD4yxTaVhwoC1yhHYyzdNCZlRrIl5OO072DF9VgroFF4xAitfboTnHat8e85tIQGd5fW%2FqA%3D%3D
75	62	1998-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2014%2C%20Number%2062%2C%20Tishri-Cheshvan%205759%2C%20October%201999.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=ofZea1Hh%2BK3cdtc5F5fuM0fk4LRpjWzVFTo5NmWU%2BePtFwFiPixeW4J5p6xpngk6JcmlFRYX49H8vHTuQQBWI01Al5qbdf7RGz5HfQxB7auhkh7zRzgyWcsgcjxUYIzmDwiMxADN7F0BbRGSIUgcKHdNpp0wCiMsTn27mxeWqFfkRWd%2BdyJTNaVYz3dzg3ZVzkt4blrXH3HZbYekviY4iTNaot12ez147iGa9hncxi3zsc5ONC0uFFMQOHjf56%2BiMj3Lfs2sGi%2BZO%2BarpTD9uZEx4DR1%2BOphLvCeBm7yCQdSPWdUzBge%2B8AMYl3p2RvkvuQgZnULGXVcTsx5Kxbj9w%3D%3D
90	77	2002-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2018%2C%20Number%2077%2C%20Av%205762%2C%20July%202002.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=gKQpMRe0z3GSJs9qlS%2BCxXwb5GLp1Zyln%2BgEwwWAkDOA5LpSA8Kyj6t5G1%2B7nckiC7Ow8ph9GSkhnE6311JFB7BrDEWzwS6S59ODTTZszSUdiYP9qq4PGvlBwglWNVJkPgdjB%2BVX3p3pzZYjVJSVRA3Z8Cpi6alzK5c7HwmtHnfPzfluJHiODXLyyKMCaikAGF%2BjIb5BdR06FGje%2BirBJ8EcDubb7SA6i9xaE%2BIt2efOC7FsIE8lK06x3bV3EHH5%2F%2FCPK7xELWP0fzNmgSFaVKEBAv8qoDxd%2FI388NKBBwQ74B2SceJ9Yiumf7ilu4V7BtaQ9lJFq%2BbM64tjnxv22A%3D%3D
12	102	2023-04-01 04:00:00	/thumbnails/102	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/102E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=nP4nWYWwGgUleTPlXjN2GgpL%2BTHpN5yjSkxzAoiFC%2FM1lw6y%2BqypBkEuy3W6ImzGHEwVYkNJ2gHAD%2BhHb6xJLq8V4rDWNeJBmbsZxQS2ldO3Gwawvxn9VaCSREoiNgP1xDFbFxM%2Fjq5ukJi5Ms9GbU6gh0LA1UFUI%2BpEL6W0Gt4xQB8MCA0HxdMgn6yFkndybDvyCtPniQ3Xejrrjc2NOU1QY1MT4CTnH%2FF3uzLDUVrDnn%2FYzHCZ06wEbsJa1h0Tbg4McZ94I1yf94Z4bWp3%2BaJahacO11frKbuy%2B5hmMx2SZx0%2Fw44iyIhQUx2etchqR5skny%2FRTYIlLVdCiBSEDA%3D%3D
4	94	2009-11-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/94E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=BFa%2Fvq%2BJQlQBHtwBpAUK6J4Cw2Owk64%2F8LZs3yfpCKVL6v29Pu14%2FkhqjIdAbjuCPhmkWOiKnj0Ug%2Fszou1KRp9wS6PFGgzoXMSEfBaI2EPSh19AuPqLhDgOMgaiKcJHURzAiMC5Dyh%2FMPWOLxlwu6AzDdhkWc0LAQfsUwvjnzp7dSHGcK3ynnRLydSZggK3aFdOLFdiIf%2Bvwp66DvuTXnikgzw0aLXQr9RZi7%2BdkBEGO95H3V3TXTbB7RqgmZhUT53m%2BqJtq%2BwqaxJ9QYEQq8dwKdaM6AjSbyO2hZFn%2Byv8lNW1jLtMQRDQHeHkzWngskNe718ZgzJiPyXESFHhwA%3D%3D
9	99	2012-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/99E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=vGJjyzBUR599kmsDksQfngYcqUnVYfNHBWKm%2BUXFfV0lzj0fpGADWmTmNd2F2CmyAJ8%2B7n4miN9eq4X0OO5l%2BU1J%2FrdVwNyvDrCcMyCFcbTuJIqPnRshbQAX6kslINX6qawCCUP6l%2FRkmaeBiQLUVIHwlrzVAi5Y2urLe9aiW9VT43diJvs6t02rwBvApX76mn677oCKUbySBlnAXTd8nUmyk6lXY04LDCGk0rFuF31aBhE5gASh7GMBaSPKGjAz25fg7z8b5fN%2BAAXyNd1a8iEEsGR8F%2F86MiOICoZmdATm5NHc4QGWZtBV7uu1E6gs8KhiOeILZDvgAwL3JL26oQ%3D%3D
16	3	1983-11-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah%20%283%29.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=VZ2xnGJ63KzywYJVRpzxJ%2BHpDRkOfG1nrU%2BAhUeG4e%2FTgHe6juBLqW3D7KR2iswTToyEJWNsnXV1WVywZ0FzU%2Fr5AEu6Zys8fEGH7CKywPKMrFh2v8X4EQrsTpabNgpuaSQP%2BH8pgO4yoSTd7cYBb%2Ff01uzYhVbYWlip05QxI2g4Vca054SlVcvLJOCV1tNueviS94nId4sOjX24D72zMZIhf%2BoTjCo0BC1327qm4aS4mNpYjrlFaprHhiMgUNooMm3MREbJRK%2BslC8FotfPY9upIFKFFPZ7iltI3uDPr1wtbJy08oxDYNqU3KC6Q6CjZYszV1hrOUDc8%2BsYPiDCzA%3D%3D
17	4	1983-12-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah%20%284%29.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=wveWNIb%2BAhJNbuJkiwZtEyqlWn%2FaptEmTUGU1rbhuhAsvDosYVL7O3zXTRpzkeQeluQzc7jRbQH84pVNe4macdktf5yIppXEUiUJT00Eo3cwSd%2F0avNMtJxNDQ3i%2BQdQazR2TComnYr%2Bf9oMkv%2F7GyCVqS9r0SHjhNIFrjtANPR28ZASN98vJDMgp46%2BaRbHWdMV8jt1xML8gX3syEHAyEb3Tvf%2BgdIcZfMOONhNX5cK5bL9ylVPmQagp1LiXUFcJdoL61F8woAtHilmdMvB6I1LVc8s85DrR7ascAeb2l3snxyRqucn6%2BMEVgTcHRzwFg0rO%2BySKHeALypXWREy8w%3D%3D
18	5	\N	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah%20%285%29.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=xGnrImxPPl8YbkOZd5OH35MC8Hz9lc%2BDsJ7pJHyIFQOx6WrW8qxZ%2B93n4U7xskePlY8P2XvunQJNHWOizLpJkTJRr5YIym6VAESkJ4qGklNIMr6qYM4hN5yXufYUUO6C8K3bsWkdYPd3PZ1yTgwh%2FoRbKMgosy52Jj1NVRcw8E2s2qhj07Ojr7Kdz47Ko3p%2BtWe247jQ7tEvV%2BKXK5B3xxZA3u2F1nkY3z7dAHtE0sNe6pwFw4hvsB79ktqx11AtueKILfGBmHKFcakjCqIXfmrZw8PHLjuy4vzzcv78kubP%2FzaLVzi4mfAo0cuyNFFOLsZneTLiqpoxymieJIm7RQ%3D%3D
20	7	\N	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah%20%287%29.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=OGazZ5TGzL26Bd584JxmcqD%2B%2B3jWwD7Kn7Fo0yDOjrsApAys0u%2FpUeG0aLbLl%2FdHipVlYwaNcm56nj0fIH2SsRLU98FjzCziL2tiqGQkiZmg7F78x33ZcdZ9PKX%2BxT6q6vwsr0jfFtF%2Bjj8NiHPdAhZaLaEfluhtNybNjEqX9Ndlfh1R8v5NW1n7ciIb4rAYPMfI%2B%2FzLSWJd3rh5VMQnvm2vMgqFGOyykLM3kAX75T%2FXrgz4A3eeSm5cce9M16fVBGhU%2FK3SkrcEuVm%2BOCQCF9ybMiLrL11iC2XBMdqDDOcQmO0PStTTT4tjhVf90SuqzmQxUdbT9BI%2B0SxTwJ8IIg%3D%3D
21	8	1984-05-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah%20%288%29.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=RmMajSs74gPV9Cq3quMDU2TaCPN22gHGEgaSC%2Fk6Xa7eJc5BC%2FT9KQqz64vrUObsGXskCS%2FWs%2FiFspBWxf2wY5hTqWkdzr%2Fd7DEgiCxpjkHtc1CSe45%2BFKjveI6pYFhEjSNK9QKdibNdiA8eFlEyFWcVMBNm19fMiorhwlpYRICv0F7hYuoP8TBuYICtKfkioxVuzm28tNK3JcjyH%2FoexInW3GmWIQ5Owwv6nOCunjdXq%2Bn4u2XgpXYPfRVlgO5cK1my7ujv1SUtjP%2Bv5VH6BbhRsRIH3II5xhw2BpbX3Big6noKvH1fDPKlvGC0NYmKRHI9k1waLywlL20tJ5f5RA%3D%3D
22	9	1984-05-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah%20%289%29.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=qtlVSkVLSNf5t93S5qAsw8QKKjAo4MX7qPIU9rBbNVnO9oxh4M28N9vkwpuszpyHZMTxdaWxVBvz%2BO81srySozu97JyXwyB7SpyFRWJY0dGOoH4iiBYMAd2ZI3jKUeuJ77E5KuabO6ivChftARcwVNJG%2BmtDDYj6hs2uKRbezYdBsM%2BzaRQbvFdp1rSXIhfJrkQqg6cvftdkKT0jKpRtRgufGwRLV6Xuul9YgKuuqn4FA%2F4oulUBTukSlPbuji6d6pxOdendKIzZy5xkMaWmxmjFSJUU1Rbj75I%2F4%2FqzPmhroJ0lGVo2o5wlVpJMoIFHqxaR9%2FAJBSl1mei9kz9vHA%3D%3D
14	1	1983-09-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=bLIL8zlxJDICt%2F6n%2B%2BRS%2BTxjrG0Opp7%2BP0Ovsdz0f8TJVfakdHioB33BpSXvtIrkjh2TxA7QU1hutceq0oZJUC5y2mFa2LUcHC0rlm8%2FGqb9jKLZ5J5%2BPZOJKTZbtA4GqKMqVTwi8uTlTNw8qRXEzIsawLmM2h0Rzl1fM9WK11S%2FKDqkNZHxe3aVuLQjdtcq2Q9qAca7rb83kmX%2BRlyxTPjGAuJ11O4huAKRr1TjGR3voiU6994KwyQwEIgxpxoc8j2Gutm9W9e9aKb8e28osS6YTF%2Bc1ju3hCva%2F0XTj%2Be8GDbHz0pPiGZeLgppxoYZoxgF%2BEK3oxpWtZpz%2FssQpA%3D%3D
43	30	1990-03-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_6th%20Year%2C%20Number%2030%2C%20March%201990%2C%20Adar%205750.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=v05ZaA8YYfbUT0I0z11FnX%2Fjzh4TcTM%2BWTx5gj%2BjHgyA4srXB4FTdvUkQYE7ZI76rpYPdscZa0u1nul9dYOqbnk%2BxFITbW2CTTATziW3xRZ4QSOqPtYgGfvWjp9k00h%2BzeF7X0khBymsDohYYaZ%2BykiPkYiP6r5wYFKktY%2F0O2dhi4qdzgEApm9o8G3%2B9u1qqep8eyXdjcXmRQaF94vjVdpx9O%2FFO7uT3m%2Bs3ZniXRzp%2FmuMrFaGad88qgAIR57jZav22xJKpNo4tudTPlTttlOw%2BYIcgfAKqrQ9Qeh6sKVfnV761Z61LLMJgIdvwajQ4AevScOzM4fQFlwoF5ONfA%3D%3D
45	32	1991-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Eighth%20Year%2C%20Number%2032%2C%20Tishri%205753%2C%20October%201992.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=W0KYObA6opVC1U%2Ft9gAqKGrILsvk7SNlTbGYPMorHOQiPRT%2BaIHQYiOPGrZUxhSVRnVtludvpPienExbvuC60N19UlDHLnIB6CUMxc6c0VHtPy1bhK8jzeOhXxihaVETW1zKJ0anUhiYtjNw2rmw6LOSeX144M%2BPbaH5TjUB1FrAJlkJBt4sy0zu222tjdJ7%2FXJeECIaPF8eakRrZmKjUKv4TjeqCeEzyWkv2na7xRsn9natW1ChfFFixG1lTe3a2bhj5fFmGM5uPgWxIrETxPlrrhp%2F18Jc2Gs72QwR%2B%2BqoliVr3oeOycA3EAPKZt7LFD7vd%2FPq35rGV8hcECrqCg%3D%3D
52	39	1993-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Eighth%20Year%2C%20Number%2039%2C%20Tevet%205753%2C%20January%201993.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=X65mq54lrHYsFonYQ3Ms8T9GQw8ESzg3uUQSSyK0P1D4WomIaB69DxpRkPOmV0nSi8f%2B0FYV3lCuX2DIzlAtQqR94YxvRbyRyNibJ6zClvahy03zyoPliKbHnbFZGlxcay3IGqAxlHBhf8X91rDFkrLtJIQJUXtD6p4Oh89haXZFw2Gia837O3gROyWRcvVEp8J8Uj96w%2Bu6YUnDLOYymQs50AjsXf2o6ZuOZcTVJkLBTjy0ZrxfwqQH%2B%2BjpFqSYoUQEUzlaeXXLnvS0ug%2BfLV7fAyrMwN0WJT1j3n%2BQFPrkoPoO1stJnQy83sxIPk1mUxYeImj4YL9i0f1Mks605A%3D%3D
54	41	1993-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Eighth%20Year%2C%20Number%2041%2C%20Tammuz%205753%2C%20July%201993.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=ipvREdvinhRNk1KRfbwG%2BcGOAGKsuJY5OytUiNj4cznys5o6Z%2FA0xyyGe5Yzjuvd0vsjlZgqusClKNuTglFT3cpyJzYTc8jlVKwUK7tPVSKm%2FUh3slwX2gMuQYZjf4cYRFdPbaXvY6SrnFafTAY35%2BrmJRbYHsRodKiV%2FL8DUorkBK3gYWhHaErVweLIb6tuptM4hiSz0QlPMnlLJqOnFLku57HpP3tw0lGpj0TAeHEBzMsRR31ToLX7pfibgTJT4cdrkMIhQvcDqsQ%2FZD8vPWWzP9Ytv%2F66bo5847DPH2Vh%2BrhRAu%2B%2F4GVFDaibJ%2BbxbXRLw7rWEILgAfY8w%2B87ug%3D%3D
61	48	1995-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Eleventh%20Year%2C%20Number%2048%2C%20Nisan%205755%2C%20April%201995.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=VMcjhVZB%2BkGjWfMP%2FtqsFUbEV558L9F5IRcRek7GxN0zGamOBtLI6aNfnthoJIPD%2BAIYXq8OYt60QMEE2JC%2F2pIJXjmvFhicbvQa7vBB0BOzdnePXZ%2FiWifRRWrkINyS0dwjEotVQnhJTJS7ugy3u8kc5F5O38lWwqm9KoENyjRTebrfyKHHijcX2Pho9pCP6NVC1j9rMb5phPWCV4A31qx2L4rJYVtnkt7QOltUt5H%2Fuvx7UCmlRsqk%2BAAjDJzg8QdICW0f2JAhVLq%2FseoWplx6nXMxLColSZo0rWZGCSY1Ikoi5gTqxGPguE%2FXmMXWG1IbpELec4rx7KKw06JOBw%3D%3D
62	49	1995-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Eleventh%20Year%2C%20Number%2049.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=Xl0Jw1reGSp27zoUcYu%2FQDuKfBUGSZqZFxvdl%2FFWzZ2NvNTJDN36d5YN6zkBLkV2PfpXNgvx3qP6V0in33H%2F1zRKmxhxiAgc0ilQT9eY6ZuvJLRWZkPC%2Fu0ZAkxN1D%2Fege%2BRppVyEotRDjDFLYKGY0bL2cImkdmUKhjopMHbWBwrKuLJ0LYuKw2Lciz%2Fn%2BRPhCj83F0E9PSB45VUEgHGRKuoQA9rcBCAWRX%2FecBJ3kbWAB5aHcrV2WE6kKRMGwbMsPbwVFe2m%2FpwRR1TZI8nsO6LCfQVjZRB57%2Fd31nflFjo4JkBQ8jopHrf1I5T%2BFg4sexXOeap3azNPigSKPu2Pw%3D%3D
63	50	1995-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Eleventh%20Year%2C%20Number%2050%2C%20Cheshvan%205756%2C%20October%201995.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=gCJ%2BPrOWIb4Y9VDm2f8hoL0ELFh8%2FdrZizVVX1BiOQ4EHZWt7ngKC286yrni2%2BGdY4sEcigiVTexllPwDbiOHgrXVQeI7rYhj9hTzA%2FNx4OWPHuTeJp8vr%2FAe8eWT1YRIgREkcHPEx6Gc88eQ%2BOmTwlQRo7M%2BZhEWyuf5eThETcIf%2F%2Fj%2F0%2F6B78%2BkTA5vmIlLjjORz7HN211k3yjBs3IlYTQFPIo8lKv7IuMwZc1JlC0HDOhWqNkK2CNdmsyiqxWdG8umo4tcW0aqy8KoVnkfCq%2BhfdarcrY6pBJDa3y%2BvSejsObKirU28VcBE0m9YzGSbQYjZZcL3erzF7gBHgO%2Bg%3D%3D
64	51	1996-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Eleventh%20Year%2C%20Number%2051%2C%20Shevat%205756%2C%20January%201996.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=L4XystORbScz%2FrA8Rrlfbai0%2FUFz4OoJLerMiccIH7GeAfuJYJOJ2c7E6%2FkOC3Z1tLxqIw6HbovxDrM%2FpXO5hUS0NhvuKyDnAE8eXwcOGfxOLSDdA86PE%2FpoO%2BTk0s8rpodee8pe7%2FvjDOCSv0s8H%2BRW9N1hyJ%2F2FTAlxgoRTvIl6hCEqnBjpYcv5w2aofKeEft9g6mKCGwXMND1JXYLDHEfypWYykuTS2RiHSfUzGRjhhnvc4Vxc7PCPPSIzaZuw9220FuevUwfWeULUsyAAUZmuJ%2FNdYUVriWYOna9kh8FBAuiVx3zB2kuIPENvbik2Om%2F7c9l%2BCrajX3RVZNQzw%3D%3D
41	28	1989-06-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Fifth%20Year%2C%20No.28%2C%20June%201989%2CSivan%205749.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=g6e863PmcAcQcg6n%2FUftuhNFXOCS6zj7jlkD%2B5vko6Y6Rn4t9GrkXCd%2BPc%2FV%2Br6oxQLPZS4J0a2bQUIkLW7ydlhTlOZI1RYZIZJpU6owkrPFusnq19vCUDcW2B%2FPN7IrWdGq9tBmD1ZOxPf12kzhB4y5TzpxKLeMivS%2FgtPc5WtmB3KWIUKPk3NJh6eUzHTUvxr1DGKfS2%2BAVWMTvmHC2hQoyrcMG96%2B46HGT9buA3ZszXcU%2FSoDopfKp8Vk71x9GODsIrdhkAA5O1A0g90DuBZdYv3uJaIjEmvDgKbIFR1o0pCg4%2F972EMJ0rvUvsD6mclpVB2Tl1wkeoQUsbqYHA%3D%3D
42	29	1989-11-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Fifth%20Year%2C%20Number%2029%2C%20November%201989%2C%20Cheshvan%205750.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=ISeGqSURUn4BZYFxkpDHVR6%2FwWgh%2FGWuwM0ePdlizvqUclwGwgCWa%2F4HQ1BH2IBTgjCUZERCwSGse%2Fj51np0T1UbIk4RXv53MBO8Wj9Xoj7pnUUDgaDEkiCG8dM4ychm8StyC4GASKCVlM0398cWaKNqIM2o2nh53TYFcFKGDzqLsA86ReboKxO0YqfRtcYx1MUBgim0f89GG5Pa%2Fthvr4oQo9ALemVochlZEhhuLwklWkfFx2ura9I%2B83XdFnoAvBXu4HTIoe5ZGsGchHFgb9amDRXkgc1Evre%2BsGreC6EJecSjCNx7%2F6fj%2FTWQ41Web6%2FQ8E1TwHhsJeehyNkmng%3D%3D
55	42	1993-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Ninth%20Year%2C%20Number%2042%2C%20Cheshvan%205754%2C%20October%201993.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=ZBZAOnklPgaesx1EKF3x0jrOI87N7E%2BfVJqKcbFVhNJvex3q8gWBvm0xc7in6e7MBepRXcVvx8OVYysnDCWHQp1F4VsMs%2Fs9iBmVEfxCJw%2FaBK9wqkJGzdT28BMpVxgdTJBQ0uuDMzdHltKj4QZXOFcvKhikGPRKXfWP69EPfTaV9H9mRIpWS4zVC7epHYITD1%2FXFTf54LakAW9rBJ2Q2PCfjPc3JA6tlgQJwseXOGMwXnXYvTF5jAfa0rfmsqtANVUHzaYEp%2B%2F9RKcC7C41Gs%2FL80V7mLvOhz7ogVSuqvljwvbF3MW0CwJ9nCNBvGRNBl5OXcSOBGYba%2BQ5vshWaw%3D%3D
56	43	1994-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Ninth%20Year%2C%20Number%2043%2C%20Shevat%205754%2C%20January%201994.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=LdqczS46I%2BcRCgTJekhvqHqwRsW3NKkgWZ%2Fof5nyXIsQmncLMJqfX%2Fjjll53%2BrZwux%2FP2g9d2B3Gl6AX%2FikqojXOJYj7hHPQh1d4XectDZ11FTBbMAS6Mx0CLWY8baLOnWh0EM2ba3RLQ%2FZE4EaH%2FDF3Z8AM09haPG0JVcHkF8mmWLyRHExudI00aq%2FY%2BGr5%2BEt7VF4ME5q7I7gqYOgwZ4gQdNqg0b89MDgY4o5U8p1GWZZoG0alT9JTCU5v2DQ0VdfkcmRu4zbH9dno2vsUclFc7uupX2yLl%2FKGrDsuXvMhJepBH5SXdCNUUwNzjn%2B12vM%2Brkt9x5qn0mxc%2FPNjrQ%3D%3D
47	34	1991-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Seventh%20Year%2C%20Number%2034%2C%20October%201991%2C%20Cheshvan%205752.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=dM1IhB9ULgBp83MRTP86SK%2BBjZywjLQvG2EozyrN3fUU2xamF1NZ67dMc7nVLXEyRASUj%2FLNK9eZ%2FynTAvu1m9tyG2bK0hg7fr8OFCKXX01aFD0A0N3l4MiYaqOQnyIczcYu7p9YELjpqZ318RfwoSaWxfk7a3ZEYxffm9If4mKR%2F%2BocwojAyAGLUXztErh%2F46dahgvorj1RWmv6LVH2yPclS0YR6naNuRGi8M8fxRe4jAW2BfGNYXXI%2FImWvPf3G8cqg8GGTRTpmwm4L8OxSKm1K1PU2aOnKPDfCpLs1nQgCl3Eb9h7IC5fztWDt32UdU2BGcZAcZ2E1FcxdvVt%2BQ%3D%3D
48	35	1992-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Seventh%20Year%2C%20Number%2035%2C%20Shevat%205752%2C%20January%201992.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=mA3KzEKrnYfbfmdXLBg1S87fWrQBVHh%2F2KlvkcFPBelNKbzaOsat%2Bmktz9ltcYfHIWuf2iEOiuqC%2BsiStLMH3ZnJWEn%2Bl66l8LByxMlARyLhrWVWWq%2FmmWSqyiiG72LdAlAxze0DaXYH9xMFKIZ9hVTm6IECOMxsAbq2GeRygyaThKHBipX9biNcSWvXEOF%2BciXZRIUwdYuqCFDztyAtsCmXJtVajVmKZupRJbjhi%2BK%2Flf5gTpP1gc2YKPV%2BUrr1M1vgvBJDv5axrohRV1bIgKS1Kh0bK718PbQSwpSmqc8WmmIEkAbrNUaVJ28eW1k5anE%2FpidCwhC86xa%2B1%2FWDPQ%3D%3D
49	36	1992-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Seventh%20Year%2C%20Number%2036%2C%20Nisan%205752%2C%20April%201992.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=D8vhIKZHTgzAjfDK1e1feGb69RUZdMGjrJTfZoD5hmDqmgVs31N7DVqS2iYvkXFZKVHmWJtdClj99Rj1B3y2UNXjQ4M3%2FqhoStCckerR87Oh4sfqKeZBTk56DCX7%2Beur2wAdf005yuLwVwxdaLrPgsgMcPa6HpCNgM5Mmw07oIV0D5tVLZEetLd54fD6YldBLkpWCr4ZindVOZ%2FW%2B0Jgh5lhZ7BEPruBLn9xKRnEAcQzmhCpcvtmrbUnZpHafZ5Y821CMN1kPRxmEUJkkTntZXtNazEHVE4n2RUXqwezqSTRJF5pv0PQ6XqyP3OcYKS%2Bprzc1cNVdnBy2wmzvkhoxQ%3D%3D
50	37	1992-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Seventh%20Year%2CNumber%2037%2C%20Tammuz%205752%2C%20July%201992.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=bRucHM4G0o0wlUTQsK8DAk2OqGJn7n5HpsEOlszY4vIh399t9juBEdZyulPK07pbyp5xaOATtDINpmh1zqRKfRU9wAfmdJLZ%2F4afZma6FoDH7RnWw9yj4D4w668o1PF9dGATqbCBqtOAwua98o2%2BQvAPMw6GqLlxZaJQZEdx8c5SUv9b5h2J6AcrZJHDBDqAqOl%2FAf9tFSJdtLPB7CGpNtU1AUMaMZXln%2BM66IvoaGksgxxjPaTR2yECy6aZ%2Fjf%2B7Pr9VN4AdRevmUh%2BXAZzifC%2FxZCUSscsbOccdADvktqdx%2BItjm5acnc3MeS4RmaEhGZhbbNdmTJxJ0iD2HJGDA%3D%3D
46	33	1991-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Sixth%20Year%2C%20Number%2033%2C%20July%201991%2C%20Tammuz%205751.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=NeZXM4NSsXJ0PKP72XXg7t8Hmwc3m5%2FsxbgI8yQT61cBi%2FQEm6Y%2BpkVzStHWP%2BNHlJPRKjFKVO8ZqiYhSMw%2BswANRradECip9kiLwe8JbdgblCoMWM5mKCeaJWV%2BEUiMxG6xT0Apxd5ubex67uKvtfJD0pNAe6XyitXCtQIaeUNrFn1FbfAtNiWAmA3EEV95jiBT7fXxW4A3fMJbToDPFY5zgB5JuCaRFA9Sx5rcim9yGI2H8DsPD8MIWHuOLGOr277%2BRB8Nc3DADlbSvoePbK%2FxM5f7IbqwE0P6DvK5i8E9P9wB6X4OaJyeSZ35cVZAT5M5oAFm5Qyib6icFHiICA%3D%3D
58	45	1994-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Tenth%20Year%2C%20Number%2045%2C%20Av%205754%2C%20July%201994.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=t%2FLY%2Fcn3%2F7XsV%2B0Yxyx8RKQBvQhYcaix8JkDTuCcvGFLmks4lLUsRNEJJhtmoQe8tLCaz2yPxUM8aGYtlSZt%2Bit9KBo51EQkQr1IJD6cwoBy3Aywuhrb8i3i%2BrE0IgdGSjrqwRT90jihGq7wmjLBTZPdO0XRtsqlMkD4O3I8S6VyZ4nNP%2FuXx%2BlwFt%2Fi5zw9u6HMMR3zFLhaO3%2BK4sf2hOXe%2FE7hF0hI%2BN6lMLRMmZG6jYq6anCHubvc02PCzlTYHFzEpPwhnACIbMEPbEl0zCcEz%2Bw%2BmlNi07ljwmSYeRHcfJBEZYUUIbe5Iis4iPzGUPsjF704KTw33OkOjEX8Xg%3D%3D
59	46	1994-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Tenth%20Year%2C%20Number%2046%2C%20Cheshvan%205755%2C%20October%201994.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=lipA1ji9Z67IzwdY3gQsMVgUuMxLp4vs%2B2F7gRvF%2FywpwSP2%2BUWDpuTjO%2BH8y%2FuajV%2FffEH9jVbhNGMZa31XWlzEAHvF8putIk4jNXIUFzoF2Zpy6ftSTsOrw0PiGBFpowGT%2Fv4cqVMHQWLivzTZJGnUlJj51WSDan2MFVMHfCS79s0NdpIpEfVZ3AKRCU2iNjJrh10GwWkNTR9Dca49y2pP4eT7KJ2fY0sQN%2FhhqdELZbSPGMh0qdU93kxFFVHgZnXzqdLFiZBfe9XEnOcBOEH%2BMP0nTFUazummkvpP5AjESe7OoGsNH1fr2xY%2FqTgJggY7eWViGf3tXG9vGsZySQ%3D%3D
19	6	1984-02-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Volume%201%20No.6%2C%20Feb.%2084%2C%20Bahman%201362%2C%20%20Adar%20%281%29%205744.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=lqKXUUjCtwIFWp54CA%2FJI%2BOg3m7SNOMCAmrVPtJMEsDCRc3KsUskaZ2yb2lD2ek27L%2BIirQdR0SAEufxgJmkt4cuyK9KE%2Foy2NTeGRke4c0FuZOwa%2FJLd8jhS4HexfB78%2BByVi%2F56XKvXtKLFyse5vKc8S9xPMJJd7aXDJ54f8X7CB4zoxtrVm%2F5cLsqghNMvBAa04tEh3N%2BLtjGPHeqe3bXe7S76pCgjo45SB5CM33Rs9X9c%2BGGORjxf7ZscuOUbXARAW7ob7RWy2FhQqOdlPbbeMpI5P%2Fgc5uOzE2DQwuFRlF30RA00xZHZkAb6M0ObXPHLo35vvjZnPbHI8xgqg%3D%3D
32	19	1986-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Volume%203%20No.19%2C%20April%201986%2C%20Nissan%205746%2C%20Farvardin%201365.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=xMhY8AVcCD7JTT7Qc0VTJ2FrCspPuMehlDQ1v%2BQ52cexkogGT%2FTIOBLbKBt8grnb30nckiEWkshSOW17Q6NST97UbsBV1cxV%2BN2i6YlNjh1pHbBoWKQIl2CC81lX1PiSKZdOh%2FHDa%2F7GhIwaWn6OQIV6wcOQQCVrAK5g5%2BdVA2IkFmIe%2BzOs5m9hpiRETVI3F1HS4MC5StijQscRB%2Fza8HxuUuLYDZWaTsqy%2BYkwyENUw07ABFFYNeP77H2B4IhjwCS5ERlyVdDAkQgbhAc8B%2BL1eVg2fqdVK7zNohh%2FbbbRphnlj%2Bv4u7USPq%2BCsI37zCsQ6h%2FEpIFfeiMQ5bQ%2BXg%3D%3D
65	52	1996-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2012%2C%20Number%2052%2C%20Nisan%205756%2C%20April%201996.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=NH17uFUFp4kFgHP2Ot0Wp5x9Mnu7dQ3EqavkFX91FOmQtoiMuwkXv8CUsRAfte96qNHs5PFpv7JvQS30iW5aNPS6IIxlG2348%2FvavB9dsY2PSIky7qjj3rR%2F6Bp6q74awfTpmQcTWchcehpfCOG51mvWs2WtU8DN7trRa7lYFSobKN4teC04gNyCM1zTSHHSZ2nQaRqjggRHsWth2Dld6XDRGonSslBz5%2Fk%2B2%2BUU0nqYYf%2F%2BSdDjlZE7mq5eFUGuP2eZIc1X8KkhAWMrJbRTd3UkRaKJtr0kvgF4ozlAYetFoUGbjw4W5639MHqG9fb51U83zP1P%2BBlhMLmDg%2Bm%2F%2Bg%3D%3D
66	53	1996-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2012%2C%20Number%2053%2C%20Av%205756%2C%20July%201996.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=r9iEWHlRqb2yBuwewtTX2q8Nmkvl4q%2Fze%2BykMNk0aXpd1a9pGzjDKACEYn2%2B%2FBDALH3WA3zd5amtZkzwXmmylIQCVm1ss2G1Rc3V6lQmvmBdR1Ho4O0HsbHeUfC%2F940T%2FSX5ft2fYIIiR8CM9VCeX6kycc5nKttjSC8h%2FTs3wuMon1hJ%2BN8VbTptxo7E2r0lXBN0OJFgqK5FAmBM8iNf8PESAPsm4miykSDQV9uHZ5G3Ai2xrqYgYt9E3h92jiayAEn3ywieOTaq2wfTjcPQugah%2BYC8sN5ipyyPVC%2FCZdRQ0a9PcFc6p5aIPqQ4EUi6fc7JkR%2BSUQ3VFpkIj1HfcQ%3D%3D
67	54	1996-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2012%2C%20Number%2054%2C%20Cheshvan%205757%2C%20October%201996.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=Yv9dZuo%2F0umYQRRHwE8TsSzr0b49u4k5xSR5ndAoHjJ3N8CPkKG7wM9%2BCSt%2BlxspJlnfn%2Bj9JETOAnViqF0z5aJEf6XslVi5U%2FRn4xnJs3X5SQfc7K1bnSSLOeUcaBveRT8ELBK7QKSdAfL2JEWPxe965w5fCaUtqH641V%2BE%2FWWtrLujoCErsrK7fPxfRx1N3tTRIyF8q2b6IP2oA9%2FpAinINZ%2BF3dFI6r0Qs6gt6afdeXmOiYawZcckQThGvz9z02TNvMjh1Kv3W9R6CO%2F7Aad0JokKAY1lpuFehNBcsrCyeR0pvGhib%2F5eT9biPDwKUp7XkXpxNbx25TUqAH1aOg%3D%3D
68	55	1997-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2012%2C%20Number%2055%2C%20Shevat%205757%2C%20January%201997.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=Kv4ZS1UZiujczYxqzfcQt0lAHfDqeZYWa64jwiICVPoJQY0l6L%2BcG3NhZK9Kstt2iKe3HaRJieCAoFQm9qn0TK%2BH%2FvVUnHoIp13JHlsO5Cn4bzZDWXw%2F0tuaJ4%2FSCdp8EGRjdPpyifXWN3I6rXmi0mMYONn4hoOpe7QvS4rKKcsbJFCcjR65ft8wbbmDBLwkKTo0aoWYQBMx1rr8zFEZn8tvMWC53LiCszsz4rsAa5HLdRK%2BUDpjlw8%2Fi9Zyxc6luR9I%2F2Q3hCKR5qhVzhfHdTvmOfah5AlPo27WNB1tXqUtjC4yU9UFg4aLp4pGU0vX1JyyYRN6Eg4VXpXTNMWjNA%3D%3D
69	56	1997-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2013%2C%20Number%2056%2C%20Nisan%205757%2C%20April%201997.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=nxV1ZE5KXE6Vu28gO0FWw7ISYwyruYuoWX2YuG6cwl1UByZpZHdy1iM793EUGOzwOBCxC9%2BVMBIE08f6F7XhuOKJ7JxFGBvUADL%2FkJAssuXmosb2zDNXND012QQc53naSEVAMCPL3NL67yp7gFBrEp2pry6aB8eBqAlt%2B5QejxZ7KvhSjCt4s0P3ABCGiDWmSQQ5HaEN0ajn6h3LaFDqoRCCyvUO%2BqnYoz72Wtx4zn2FsMJDi94NphMWrUAs%2BS2lHnGMlK4jBtXIPJU3v8JUZ6d0sakHQAjpkUSqduUp0MYS0zhlbEaW1KNga%2B1I8mUEqSNrH8LvEA2f4TYFI%2F2MeA%3D%3D
70	57	1997-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2013%2C%20Number%2057%2C%20Tammuz%205757%2C%20July%201997.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=vFX4o2TpWnO00A8XsuNimGBcpkV3Kw%2BbbU840aj0jsT3cqS80rW4xLet8WqBC1MDBQM%2FJN6b5U87JI6dnQGAN5wgf4lRVD3kQHMCiGpH%2BtrdJCmFSsKmNAPTFq9PoHiq6zfs642gGidAwoT5oBJkLeOhStWSfq%2Br97sQXW%2FYNeF8SBs%2FmRKjhklbb4wEIdKPZq16z5Kohls4Kx1XljJoYGxbOLvi2xQB%2FWNLaYF0CrRqMMpP1gdbC3RzPILWR4bbapfQ9ZXXkVI7WFSX1TWsM%2Blg8xpk3NR9y6r8vkIZirf1AJPhS5HAwjE7PLxKBYvpGF95wTIl7nnUXHENG9fJFg%3D%3D
71	58	1997-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2013%2C%20Number%2058%2C%20Tishrei%205758%2C%20October%201997.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=wWBsMGIuU2AWp8UebDA9tir%2FLDZqul3qxHOmOQwT5k0Z%2BxBMJmbIaNJBtSzoiMMgsAj6RzpmxHl%2BnHEMkJ9yNh%2BDhk7SDSNhAfoTfZ9dM%2FahFS5V13JADtoe%2Bb0wHB51t94wdsbPzmfQUAB5InaNDjPV8FA5jndvLcJIUgq%2Bayhj9iH9pEHtWSFd8KKXvSqULLFlPodWbRlf4U%2BRBYCBUntSvVXyKdAmE9I8rZz%2FRh8xFCaCW%2FTlS4LbgDUuOHTJ0eRlmx0pB8CzPXp0DCNv84qlPfbtd1Go6r3D3hEUcuGRrJ2ttb8AHI4ZCtn%2Bse4Se7UYZVZ3MgyeOKoH8GAE1g%3D%3D
72	59	1998-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2013%2C%20Number%2059%2C%20Tevet-Shevat%205758%2C%20January%201998.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=k%2Fertyg3damIUDkJ0dKEtXebRbyOuqv5pfXQwwOhfH7TYYrcpI%2FNxMonPxd2atyN6S8IiCYIP535BnvwdA6HP3V6FFIACCxjVWo6Li9wD22KeTxC8xsG%2BBBAqT90LB3LDeAYFBtD6aWXEtXkIesebT5xyyy3GJsXqGub5mVYv%2BvjPtzjwtNQIyHKcxRRNlDIIUX0PWTZAa1AyZp7dQuCMdSccccpxMW0%2F1R%2F6qUC6s5Jql7G42b4ogGifc9A8YTvOq1qkHe0VBT62iioJbkD5b%2Bh5zAuK4bnwuap6v23zn%2BaSdx6anQLmAJMlVYbVmRaVL3g4FyY58zSuhX8EnuRRg%3D%3D
73	60	1998-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2014%2C%20Number%2060%2C%20Tevet-Shevat%205759%2C%20January%201999.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=tGQMK4pwtUAFWsXHTgiOfqgUdOC58n3tQTjaKXSNYzu8ArfpbVjZEDT7jWRIivjH5uk8fpMCijx9IJRfUCFB2kLpXW0ojud7LlUszXf7weE6WGvth0F5%2FlRgVW%2BffiSwrrAnjBQacPlpGblKKpixMRuX8LPNw%2BBWQrN2D1clwxgOl7cEHydPxjuLYaQDws48ZsA3jaYXCmqdp54MmJQobRdW00OYoHGHsN8ZNSMuMg45Vy2ofb7SznOaKo1ENSbED0lNR8bRHZNtfsSFa55CkqL7jpnjSiBgqxmXJOmVbH5mhPAB85zAz7PrZlm1Cs1yt6ayD5Ag1bx8DEHLHEESkA%3D%3D
74	61	1998-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2014%2C%20Number%2061%2C%20Tammuz-Av%205758%2C%20July%201998.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=sq3VSryCudL5g4udPWCC1Z8nEHj%2BJjSjqM0v0e2ehu02160KfxTCTlPbZIFWtyK3vmKiXhphvAUuhbkOCz022p7TLiEQoHSM41S1d%2BVOU9JgCcNOVgRpSdmWwnHQ7Am3dWE%2BIy%2FIrl7J7e39U7A9fgDzeNjqyY0ECkUqHJsSsVoBv8kCD5xQ2x720sRpdotlYq%2FxUAL3BUUQbDwHAGCoAReFsk8ONBtza9GMcsrpR%2BxHliUu8NScdKRAde1Cty31rPd3dGquigFGyct7Kgbthh7ABAkrm1cDXiX6GkN%2BJOioZaPLfTdpFvk0DUehm3LZLDiZMf9eJavOLKagjB4jGw%3D%3D
77	64	1998-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2015%2C%20Number%2064%2C%20Nisan-Iyar%205759%2C%20April%201999.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=PIC6l8Qj2IgZRf30hBWvhZvlnNF5%2By3SQxBDOMX6PsB1XywFO4nrYrZdAHLVlC%2Bbw2XDQYggCMfvAsBTY8%2Fkgan7imWlMr9Hb%2FWTnAKgEK1MIcs7Z%2FhIetEdfI2FN8qqrTWD%2FZw553%2BlIqBumEnPmK7Bz0s%2BS7LHD0Uq6Vxc3fzVBlQowlSv6%2F%2BlYVFzgPayj%2FdBWdZ6ydUujdPUJaW2n%2FU6WB5E9Z5kYqpe%2FHs9CQ7jePsx%2Bs38bDhYRkw713VOtKDVYBxvmfQ2KYFTqGUaK8DBzwe6CnID7OwJjdZkVgGqKKgPAxduBCnR%2F1TXnRXlEX2NRyHgm%2B5xiDnnKS2v6w%3D%3D
78	65	1999-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2015%2C%20Number%2065%2C%20Tammuz-Av%205759%2C%20July%201999.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=Xt2%2Fzwb9CoJa%2FHX4CMmxCNyn9hU16pvEsinEzQvJRaiDikbLSTgGrPSv%2FqH3zcb6fzlXIRf4XubNDP%2BR5ekQib8CtnYTublRzeHcwV9EqDr4Wa5q8SlCke72ubwLBfwh8NNu3x8OKbFnkIkRa%2BZHtMMEymc42U0t6%2B%2F5Dfi%2BRfusKWPhbPKMtEINUwqbW2tlBPkrz35QdAwdGd3te8uvojAHm8EFnjcQhWaNXvB0vkYXGul8G5MKKWS%2Bs0WyjDtVVG8Ui%2FjRnmu6bhKxOIswq85Lsgq%2BRRiyTp3R0LT1aFlizmWbVTZDQZgweVc72Lhp%2B8loFQB0%2Bcuv%2B94FJGY21w%3D%3D
79	66	1999-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2015%2C%20Number%2066%2C%20Tishri-Cheshvan%205760%2C%20October%201999.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=paMNqdoTT7VSeSm%2FWGvk20WlueDEWTquNvO7YfXfolnnNdEpWjsbpd37yT6%2F32FPMiajpouots%2FKUdK9odaIyp4lYMyCS5CELSsn6BTCpwsRdgSZlxRb36p4%2FrGN09RGkHtl%2FGMIQWcdDyqL2mmSIBd%2BtARcshzwe6NChc405KQSISQxvjIzVz%2FfIOlIQbSq0WbSoKEeiGtvjkg7GIb3ACsh3PkkJlR7z6qHxsaPBtYSYtw0hEXzUIy%2BcyrbkZTFYQ1K31TD%2FIH72SynTq8ABUBUVK2CA8m%2FT%2FU7cTKSfmFsH4NcKEeBlZDJwHn7Pb8IBOLGHmERqhwy44KlWe5crw%3D%3D
80	67	2000-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2016%2C%20Number%2067%2C%20Shevat%205760%2C%20January%202000.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=McgCKV6Z74uQwOxCOmHMOTgFqt1eecBDHEHWRL%2FgNsJh%2B4FDZWqHCOWWlh63SmPx5N6e2dp0HSKVL89USO%2Br4aFQUCKOMdDB2JqsoQTaKl0ohCbzRF7LnbDtsPlDyS0%2BlGB54JVh1bF8v33MMJhM0K68WJWZ9VJgzMPXYK2JFQ8Ddv%2BdkCvuJjQkYWBV1JYNN7s3PbgTETZfuNzjW23ge8Ei7jeXSiUHM2Fkl8wPHexTA1U9hJIcmliXhqX%2FZdLWctXxwT5kWNJulWpwLtK7slzA1xd3%2BZVn7QV7ilUO7LWgW5%2FZxykeSYzAOx6Hl3MHbr9QTHOnjbOreXaxB38gYA%3D%3D
81	68	2000-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2016%2C%20Number%2068%2C%20Nisan%205760%2C%20April%202000.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=pPvXb2D9uJvKRsy3C2DmX7kBrdPDTNiizdq83IYCvR5Avc1jUfv74v%2BrzxkLLLn9G7sWpR3kbH%2Fcnx6TPEZ4v1aFfwIiUCux%2BmfmUeLwhuw8vEesHGWRZzj9ktkJ%2BJ1Vhe%2Bw%2Bh9ZY8BDQ%2B%2BmERPsRp50W1m4ySDAqh3GFxPNZFwndVECHzm4wW2w8bgY%2BqZy0c5S2rK4tEcdokZ7HmzUVKWa1bhD6mn769vJTcRoEv1yUdIDj26RsDBbKjvtR4yOSciTUKS5iadCFJdZlalIhF%2FAxYBcwsDw3LHjtIH9pUjF7%2BXCOoT%2F%2BwnUjdmxecg0jv193LRhzQo%2BtVJ06RnaFQ%3D%3D
82	69	2000-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2016%2C%20Number%2069%2C%20Tammuz%205760%2C%20July%202000.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=KsxpJlqMPHDyNVuHgRPf36JWu9L4094YtxuLAR3yKTDRTB%2FomBEBfkZY%2FToReqNbV0qYNIcR2HEC8x3Zfj1ZdLHm3bvWXmqlEM7xoio%2FCUcpnB8kw4WKtixzEqZMvlb7WPKJn2NCjCiRLuOtA78sAzIbAT3qggjSYcLJzRkKGl5MWvx3oexenlWMfw%2ByaJslJvlZoORpxRYmZq2u2ucgnjD1oyk%2BhaJQSvRWc7szZSJtti0oE7xRZKUE3hXKm7mxI2eFi0UOuqN7o%2FKnH5DizTXOh50a3stz2ogN0Zw8JPTNgf8XFTcaD3jVcVuFR6SAst61qg0qIIz%2BzRWQ9FS23Q%3D%3D
83	70	2000-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2016%2C%20Number%2070%2C%20Cheshvan%205761%2C%20October%202000.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=FDXShWWSKf4BPjySKHljYtyM2%2FgZuMgQsque2HZOrUdnIgXxPTdHaf0SWSj5JIIOyKnoB6fVVWt9sxN0Egsn179RRU0oyul%2FD2b0Xl2eURcAI9r5ifsOUA2xpw9CNbs9H34LoAbFh%2FSM1WkhV7YKNaw7qEIfny6z4zE1O5t37jLN4sDuWtKnx%2BBNuYJFIR9C%2BeLT2XLDktA2KlEuT7axtzo6fqvd9qdz3jW%2FgZGSsTE8O4TPP0HRzwqFEddn%2BTE7FO6VSErvQmCU0CifG7Q%2BuYl%2BSJWSLCjJsatA%2BEM9YuIdS0qrUw3n91brVhSqdgVC7BRqTg9HLB7C51HumXIhbQ%3D%3D
84	71	2001-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2016%2C%20Number%2071%2C%20Shevat%205781%2C%20January%202001.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=ZoMFCbQ8zGQ2UT5uKwxqTn9PISYm7jzSZlLgV649MIQGkf%2FTxf2%2B7pvweVCK84psVpCc%2FAv2dIfCWax1jwMhVAgOLHkuRqdpGRtU9WLMbSn3FahoHViuxnSjo4ZT7MeiKCGVl%2FWS5WLFtUvKUoy7lxLbkTZdEZjy5SYD0D9aehZnyU4hm1%2Fthv5ct2qvgDe2EFh7Tzu3jstgo3oM8c%2BGkjSVmWJ3maeNbtQYdHFIRw%2Fo6K1HF13pNyOQNqBjNgoqP%2B9EFMjf15rC21W6XSfrAboR3jtojQTaX3omK2iWD9ZK%2F02Vsi6QMXSqjIEhi0l%2F2QH9OLjmFTj96r15HxeUzQ%3D%3D
85	72	2001-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2017%2C%20Number%2072%2C%20Nisan%205761%2C%20April%202001.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=k5f%2F1E47xPzS8jNjNcWPNEPEG22dtMTTOSilabjxCvd%2FawQEn5PjXW3Fe1v993kXu2xTFz053mjdXTJJJBH1bCBWb5fOtfj%2F0bezbVQpNhnqW1qieG%2FTbdi2uGO3jXMqFRfwAnFlOfd4nheBrr%2BzcjFazoyV%2F8NpyWgX1SKQD%2F3Lc21TufEmcVQoeRc2MHPNbeDxaJdDUrDrqq4eXQd%2FZuGjyGEa0BEvne4A4yX2GM5ToveydZswbVH5T%2FI26Aa4hIdV5Oq0gHqKiwLpRScPf0kCNtTau5%2F9vMBHP72zQCLXG%2BP%2FZKTxZzXEjeweDJWN%2FkOSDxdPO1PcyhhjgN%2FUpA%3D%3D
86	73	2001-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2017%2C%20Number%2073%2C%20Av%205761%2C%20July%202001.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=MN5L5u1tWrP53o%2BOiibI6Jr0f%2BBA1lwH9mxSVATthrYtX8WGR%2BZKwA3f831mGDahqrQAFWtywsXZv%2B1b%2BmUgAsvquTh%2BmMMDdvgMJOLNfRQ4rhaxZifdV1cv2W0mj6Fh9g7V4cwRCMjTIjvV%2F61qSIkFpJqUS6mNNbdWbnLdHVrMxVK7xUyBDCnXvTZiqAfUWCtcKf%2FuDRsqPd2jViM4ZUx9bNyj7u3jqLV0CfPsn60DENg0VIf4Y55hqFvSTq%2BvctSj0X7lLPcHDggZQHojTtsTnNWU5UhtoEueB0SKIgS2kuh6rvN9ZSYLdnDZk65iDuq0lYLA3Ya6idCly1Zjhw%3D%3D
87	74	2001-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2017%2C%20Number%2074%2C%20Cheshvan%205762%2C%20October%202001.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=LPu%2FolN6dNKdU2IoA3takGgDPgsvv0FrwV4gy1kiCPcDcwYgs2fPTJNBkk7a9mjHKXIxSWdbhMAL5ADS3QJZaVb8GXc%2BXCFOZ%2Fr2%2F%2BAWlOFXZ8FpMFuQA5ltVgu3z%2B%2FOlyLpxtz05yg8czNazY9r35BAEZxBKso9hv7cU82snR101ieTkQkwdmhzvnXOhSZqlJCkpVYWHPvQrl0qIn0vu6c3KXRgW9CTbVJpgOwlt0vS9doM90zo5GC3KyvUYq12yOjlLYlL4afm8AkZCdLMaoFHzL8IdzXLwyzxULXaAZ2NcPruvA1mrjT6ss3YluuriHozMJWEoS6Q2J2hUn6tZg%3D%3D
88	75	2002-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2017%2C%20Number%2075%2C%20Shevat%205762%2C%20January%202002.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=kEG3OUleSFOgxvqu0B7OgoQqG3omsSb6PQEpYeO1uFJrJUDNtFMtuMUX6QhJxdRIOg1kPVK31nVnwMrtqlM%2FMvMryPihkWPeM55KKK%2Fc2yDN9EfHdEvWzc%2BDlDtxjlPUwzHW0J726xLGqhPL3H8slJASdc4u3GWJQYspzg1fbcUOualtCvBnnzbzJbc0BZ3XYquwI2QzB7%2FqbfiTXlutiYv4b5lq4F3QhYiY%2FR1IzCHIMZsy19R4YgElqeUpkBOPBoSvjGeYo%2Fiu%2B05RX3iMYeCyu5MgX27C%2BxmLJS5xoVDKXZ7hHQEw9c1iX0J4Bi50Q6xdAI8IZYXH1nO87LhOuQ%3D%3D
89	76	2002-04-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2018%2C%20Number%2076%2C%20Shevat%205762%2C%20April%202002.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=tvK6hAQaWC50WLKUnB0mTV8eeinWhpOt4xjmLrOjXEU1C2ntS7f9imGWiRJLZiBnVuk6q3bYJ1jpNbITpIAdQP1TaQMBwOPZQ3CoPveyR3%2FJnBLO4DQaBRu5eh8tsPx%2FZHM9W3VE9nfoxwTogt8O9QiwXeVbMkalQE6BfzMrdgSQ2T8cM8NDGC1j9ohIWJ4DH5QWyNy1cmy%2FFGsnEHDSACJT2yu67Lf30%2FI%2BcnBp6MYPKAnVO697AiY6pxkJSy%2FUw9A7Dr1RB5EVDKUvR8SZqCgl88ZCE5cY2StReFszKUxPBCU3TSL4%2FSJXe7KXUOP5ci%2BuCmVRjRKEuLwmuvgDoA%3D%3D
91	78	2002-10-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2018%2C%20Number%2078%2C%20Cheshvan%205763%2C%20October%202002.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=FAs4BrerhYK86z7ELmE0Mz7Kx4TI53X8ipHS1sOqCKPB0nHuJ4klRvUEPnHSqqtU5Mntf6JS5Hy%2BVpsYk%2BU9BHd5Zc1SDGXOlGGsCPVegQWUBRgaLk5cMWSMGABIQg30u2zoHmPv0CW2EAU5MhGqtiOY01OugyUar%2Fn9zbh8gczB0UE7YKXN2VktNCPpJVSgGvhJG6cmdueEp7LsjW2Jo4u3yOy%2BXHwUxqhTuFoCfw6vhyoHvLedcXKQt%2B1cZd5jSYqa7iVz2sg3LEJsZKtAhv%2BTdoyqeqkAGt8UoA3qK9wzND817Mb5X1HKZmQq56jB9BFDLc%2F9qrEQ5735UgmI1w%3D%3D
92	79	2003-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2018%2C%20Number%2079%2C%20Shevat%205763%2C%20January%202003.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=NBhehlkOANSB%2FEdrmzQKQnHnarRRhNLIIjw0Ur4rJoanLwXxn4WQdkOOOhS1%2FBa2pri4Dcxqgmql0ee9ltcF11q5qA1tFxaHC3Pfu2OR9mMlUIG7d6iu7xT3es0F56Rd5X3oACdoPByOaMCWJlSAqbAgmoMOpIKvS7Kf5psFHUcB8Ho6RyL91t0on3B29J4Wn0e53DqQNgP7PnKVVZor3Ov7EGvBfeGhl%2BNUBViuwxrY9LWRkXUVvcF2wVoM00slbUVxsQaaONeFIhlbTGpFEp%2Firn09qN7dLBhg%2BLpxYNGcxM7SBjwhe635gHI%2FXwuCq4fxq5RenbOjBgvKLMK7Yw%3D%3D
93	80	2003-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2019%2C%20Number%2080%2C%20Av%205763%2C%20July%202003.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=mK7P1uX6MoHxwYweFD5%2BBszUvISRr9EyaFJw30H8pr7zx12ZNr0AJE3rbDl6LwRkkM51vm58oX3jWBLpaoc9%2BjV81hAje%2BFZPP2yIl1mQNUnXR1gnZYOXDYkwxP31lAnUqy%2Fjd7ixob9p9XjgxTecfQ4VhzvEbBgM8zLc7cJZsrSUOlrFrTOku330qr9%2BpjtbBoUY5YMTELoWzAZFVn4b7lUaeLxtgO54mAUnrfVZ0izjMICI7jWTEPB7%2FaTkFG4PYVWi67SUTucE%2Fn4nNiCCFKFqRZuFCm6pAtqeeDNmjVefT3iW5jGZQSr0%2B6cNQUPKOVcAaKd1Z402%2B%2B6hKbxsw%3D%3D
94	81	2004-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2019%2C%20Number%2081%2C%20Tevet%205764%2C%20January%202004.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=K9iOqceOaKkwlX6K6uz0NEDJWf5rWzv5dpjC9g5jMl7Wz4sBKp5giRXHVDeqYQneM3y7R3zQ1RwNMXkWAkGYPlBlCGqBcssv%2FS4hH3BXo2gpW5avHl%2BHQBJ%2BBR%2B2TX4Fw%2F2vW05DS3Im8KwDd7hCK8GvLj%2BZDRvNyaY1g0SLmKufPmc3k2W1wk1QZM0VD5gTaFjZPueJdNGmYz6HDVQmkTq4xN%2Bn4IeLz6y9gKPisF1tY4CnuXCI5nlgIuvz1DBu3HNaXprOX0rc5Gj2bRJsadjIUfpqETI0dwCvzrziOkYJcWXJiGlzTPf5hEhsp7KwIFvPUvGKOJ98kZ9HdLv95g%3D%3D
6	96	2010-08-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/96E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=kCMFkK9AmC5zL%2BiV%2B%2ByseU9ykuVp2yuJvc4LiJZPeHsYLgsnqjETa4eZP5wYiRx6JUZu9OuVfwg3C8CHi888NJ6%2BmWbNmAr%2FJtd3GDqFeFnASwj7MiWXA4yC34Dbb9B33k6UtwVxRy%2BL1cyt4utSpcckKXL0CnypjjEnkv0RLktNvT3Iz1hlmamwSqLN3xGRgISiXfyWGVYoJ2BYJ9KqM9x0PxN3M8rubyZwzVyphzko1wNW5rN8q57Lole4uwu3b8K6z6q%2FEbuKY2XA9K5RPhfWDBjKMlK77qt0D6MpT%2FMLzdFiVF6fwTz3q7TZraUqKxZBknVClCg3e8X74Gf99A%3D%3D
95	82	2004-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2020%2C%20Number%2082%2C%20Tammuz%205764%2C%20July%202004.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=kkIfeX5eVWHDzmua%2BkDT3Bq9bwe7DBKUbOmb7nxIBfqdiS20xJ8PsIVzbFgS2jGXj9HTf77PrLycHWHYXFwQqL1HZxYbzZu56CpKulKQKgY5Oyg19mWKhc66%2FTFIwot8jVy3bHJUsNvJF2r3CT44rTWzJj0sVcqb8oUdZ0PqyMQttsg9ZuRFQLf0uwNho2FFkjapjN34nuq5NL1tXzhsmIxKdBUlC7B%2FUrZZvz%2BsN7OdGlW5ypbQKUyonDDLBFvxBff2JDZYWG8MElMio6jsoNIJ8KvScltIgEJM%2FTEWMf%2FZDDrsQIKX1UKVu1dcs%2FyBmvZXQ87Iqfx9THsWSQ%2FYZQ%3D%3D
96	83	2005-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2020%2C%20Number%2083%2C%20Tevet%205765.%20January%202005.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=D9a2DUZAZF7Ch35h2CDXwTUpX9eIJ6TzbV%2BL1uzJkDd0D1XZufqwZEE%2BJGZXGyGPyTcr19AG%2BgOfEFnyzbsSlwv3N9zqHuYNcRhm9VxwoeOR%2BNpBhL9Gn8WneLV%2FK2%2B28FPafO2SO91jY%2FQe4icJoOX%2Bt3MtHAsU5ZG1MGRMMVGEd8PWzL0tLY9eu6A4gF4iLMGxXA6Il%2BenuL%2FAXW3rwrhalBzlOq573Uh640x6EcSxhY0un5oF5FVF75lah27WL06Q9BSX28GX%2BixJhe9NbolTkHDCDGGgwPVUp0feQAQfpyWWhhnxSRi55UJkvIboBisO0qdukO3ffg1URlBO8A%3D%3D
97	84	2005-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2020%2C%20Number%2084%2CTammuz%205765%2C%20July%202005.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=Cb5%2BlzNqf9wFC0azEJNmyKgOtUmycT4T0FDFyqO6A4dXBQBeyKKyO%2BUnSsros6nLxnIyL5K20in1W43yjZY%2FFLKPJltrU%2B%2B80GSxDUxwNBWGH6NcTTJfkZMcJlA1c3xfTK9fkUOSYBhE%2FPR%2BVk0y8mfmoiOzRftvHP%2FMPsrisI6YGxhs7CP8lnEbTSAno5a%2FqdCMrEF47u0OzId5B%2BGo43aQNEpYaCDxVxqAd8DYMJw8VcO2zG6oTWpCiNkUMUQ6QGWOGKFj7f4gvxT3NCnixo4zwuqjcnU4fXcdP61lCUGguPFRLTwxxT3VSd6xcftjqrL%2B2UFRO9uGgECND%2F0kaw%3D%3D
98	85	2006-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/Megillah_Year%2021%2C%20Number%2085.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=guGy4wTZmvek0Tk9107X3NhTDBJn8yGIOtb1X9lHEZreD%2BZah%2BPbr3BaRXkt%2BhU1EAHgYZE8tpdeFpv7Jb42AgxwnHPTAA9Z5HtKTfsI%2FgYoNEyrMFDb%2FlyQYMdjm4p7EwAL%2FfEnmSVAUDzn0BTGX9Quycn8YlNK4GWMt58nFlyEPGMNByz%2Fwl8D7TNfm%2FqWpJgSTZx2zydHg5bRiATBc0LwXYBfw%2FTTwbisfGmy0fAS9WFuHdsJhRHg4Tgj1x0ZZs6qW0NEmViILZs1HdIzHFOCP3t2byDDjuNAB7YexV0C4aQ8Lv0ck5uQfQYvglhUoQez3wvk9F1r4X1pHfWzZg%3D%3D
10	100	2022-03-01 05:00:00	/thumbnails/100	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/100E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=b4TtnBFvEX0Z0%2F2ow98UtVChHk9GCdA78AwThay5TjyQZ9TD9Bwp2xsk87rKMzrIfh5NCTcF7U6sYr5LHPnc68AF%2FRcDgzLmQxPx79w5NZlnGjA%2F7qSRC%2BHhsGlC2JX9asXD3Bi7cAi5SsljkOn2vF4UIxxnQdVi1DP%2BWquErxT72LrujgpEJyQU4ibXb%2F%2FVzFbibm%2BP4vb%2FPWQVDQCs7Cymd%2BoDvqOHcTgAYgBo2zz7ltU%2FE2gztsaFCQCvCQl5gPal7%2Fzc04PK7EIiRWW3Judk5c8hf32yzi3T3dk1i2AZ37C94mkssyf6z55EYKfSELjFQ6cOrO28fUeCKxTBMQ%3D%3D
11	101	2022-09-01 04:00:00	/thumbnails/101	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/101E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=JuvBTrdfazsSabJtjjlM2zsUjdGaQaVbhUEU0GjIEPIwn6%2F%2Bi%2BZLGjYU9eAwCrsx5pgUIIOIfbcGBDFmDJhw2eYgvvDNhLw1Xns3aKP1UEL3OvQVDdiMf2wOgiQp6kVeVisTxMMT9gLOEYzj9uH6u%2F66%2Bezf6ZcAP9rzWYz1%2BEFJJCORB2kKi%2FvxlbpXIYIC%2BfQWCidmTKUZC0S0sYTo5fxYH3LG0l3GuAjyX63BfCdS%2BvDsVuEhLESpFISt595fOMaCOHnav%2FOgsG70vmYJYZwJ6QBxhnsWvksU18gsTNVigZFsfYD8vdmKBp28tljcC9R%2BNQYpUiI3Nb7UgvC4Ww%3D%3D
13	103	2023-10-01 04:00:00	/thumbnails/103	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/103E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=D7RxT6OjFAIs6h8%2FfNOM0MvkEabu83OWE4NxgXabuWkwpTvhSqXltgPh6bVFGSAuXfsn75aJl%2BLtTP7FS4TbOB4%2BOXGBkwWEoh3uiyCD%2Fmnk8vcQbnu47Az%2F7patPkOaS4oxpe34tmANlhgKGjBhaRHgITGk25iZlnMyEbt5J69G8vNHcqmVCW%2Fysx25cc4yLxXLaEfCsGaqlAGKQQlnYxg29XHXZzlL0j8nC3eFvsG9vpWYIFdHiRUy9a8z5hVnTjWun61ZS76zCqLSrmSHaZ%2FrcClUu6x6YPTc5aMmN9mH5GG9HWDwaK3TCFO%2BKVH%2BEx5n0l%2FBelBfn9dQXy8BaQ%3D%3D
1	91	2008-08-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/91E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=tis6G0bb1Vo8fXcB4MqhEIGHayP%2FpJNDhUOEgPi3iu%2F%2Bo6xoqRqkOHBGe5rLx9Is7hkiQ%2F2IvibOpwTYxBXbLcFsKlIoRd5f03MSRddq2d73%2BxkWJ%2F6uXvrWgrNzudtZVTxgT0L3QF02Xord2XzjLXFBnKPGPti5%2BuDucgd%2ByQA1jUwKWwmuOdWSWQF6xZnjiAGWfwMd%2Fx7vxboMcao4EPEXPqYixxzH1qremMhRM%2F1u9B7wrrcFZSZJw4zGeungD0CzgLnvoB0dv4nmlSiE1BQhoxtQPa1XQaABPZ4JkgWfrSDiGalVgb82IPBe0zFEw4go3x6Suqsa9tZ1A1bvag%3D%3D
2	92	2009-02-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/92E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=e4uvDQUYv%2FwKjpzychhRTl4bP0XwIvskJLRjFpeMh2d6BKpNxiV9zjbzRipj0d0jNeTDWtAx16JRz44nMszBeB%2BUyiqYOEEyJqGUYgUe0qIq3wi0gFuCW5HkNVlNStQ8eP4xSahjemILUwWp6FT3wnZ7jMw6oW1D5IoAqHNExcGLPfxtY8dGF836KfBGCL12fnS1PoQgDwF46d%2BN3XRFHZGXTGXJ%2Bq%2F2rudmJkRwACOs8iliRhuJzK4XvPyPu00FrhGe9japHCSAaHDc%2FB6HTUNtuceRkvNlr40Eh%2F%2FzStIrcXgy3BfIONLBuz5QzlJ3AzeiBfIrW2Cx952N5ZagNw%3D%3D
3	93	2009-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/93E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=pIMQg0Jewcrsj5zo4iQCJLDCw4RFD9Y6GAqWMy9eZZTgNbU7XkMKUmXuf2wZj5WalceO1C5O7yzGXL2Ab0gZdbXHdg0x5sKePjN9cBxvFdVo3Q753%2FepHsqItxzZ%2BggKt%2BBWGh08Ypb3RrkyP2vMoizHswln4V%2BbAIqpUHYPT0zm%2FGUaHO%2F8ndVsOpXDINvQ%2FYaETmv9Y%2BUgSBM3iR8DAjO7msbpIqHTC%2FY%2Fbye33H0A%2F1jDxGyQmLUhVoFILCYUS8lw4psGunBOuaBEM7F%2FixXi64s%2BY5Pp0am2BuAtV1wwaWyFdKpf70teMD7BrwRJYdkxyTXp1T9Z9ckQTRJ7ew%3D%3D
5	95	2010-03-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/95F.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=Paz0v2RvUZwqj5jr5qq%2BhLfZqWOOc%2FqI1XFjSSSMN4E%2FDH8yaii3EXyCUEHFycEPJhewxkOKNAn9C4EGYvQRQrR4dawQrbGqg8Hr1oVmsUYvui0GiP9VQxN%2Besy1RPTGyEx0AB31m3lWPTUYc5sxasdHnlP5RTzCYsEbCUvGfV8dkte%2FOBrLr5bhjfhvKLolCppFdY%2Fwwc3fidCxF3Yjmsh0ZACYJqWGovVxMY3g4j7la0EYcqFJDFrU9Cncl4mz1D6BpCezRc3QcEP01CtTH5Z%2FBVuQ8FxJ20RoeAGdY6%2F6oU5zeBjBwnfanj9SnDessbANAuSXfjLUs%2BLw%2BY%2Fv5A%3D%3D
7	97	2011-01-01 05:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/97E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=GPmc1cej6T1ej6OMPyNJubdhpoKf0CMmU10FM5B11uToaKO9FnfkQlxuNcehYRYkqvgsapI1XJnwtJpXCR29bm0Qo718IzvBZjiA0%2Bd8sB0XQkQeyRItPnVp%2FTwdMSqYf%2BqgefE%2Fzun3tSczK8x2EYNinMkxwalYFGbjwLCN8wo6S6RgZcbzhx5dUulSImSf2Aa%2BTvQfQL9obazV2DYykPLr3SRt9FLYLe%2BvSqxcfrmYnE%2F0lgEkNwhOHPzUQKcYx3yIown%2F2XTbLoIAhDu3I%2F42fbusu1OvyFEeddZeISJEN0SyIyVzz2GCCr1kc4FBGCf%2BQqn%2BrvUabCZr%2B8KQsA%3D%3D
8	98	2011-07-01 04:00:00	\N	https://storage.googleapis.com/megillah-magazine.appspot.com/megillah-pdfs/98E.pdf?GoogleAccessId=firebase-adminsdk-99rhi%40megillah-magazine.iam.gserviceaccount.com&Expires=32508795600&Signature=K6%2B4C1QjCo52%2BAX8Fe7%2F%2BlYkHIvFW8RLDFo4KO1brZ9r5P8VUuvynoUiji6XI6BoqaWRUc%2FhI5V2zOEGI9akmknXD%2BQGyu23ARYKO1N%2FYU9DUMV49c5ESRPesfLm1Vjc1olaIcSoIvJ%2FcE1SQPf4xTRnp4lAUTj5RihnZBTe3Qbe3eTXXaucMrWSNOtbZsbF2a2FC9c1cN61NQp1u%2FHhgbRRUnpIjKs0bDX7IPg55uY7wW%2BP1y8zBF%2Bxc%2Br4HCUZq0Gl13b5sSSlU7abDClfh4sQB4ednapn668K9Y5PIRbt9MowY1gx6r%2FnHMfPxcZdB1I31oXKmhZORIEvZBY8Lw%3D%3D
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Post" (id, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
db04a41f-d52c-4d06-82eb-55d474dafe11	5a2d27c934bbe53f56c1ca662453202041da146cf877a7f50099e6daed7ecd7e	2024-01-30 23:14:50.078639-05	20240123150946_init	\N	\N	2024-01-30 23:14:50.074288-05	1
50c62051-8dd8-4f5b-83c2-aab0d6f90c8d	7363ceebd87055be322525c376620392c3579de96ddd8d080abb66b5dda34e7c	2024-01-30 23:14:50.082424-05	20240123165445_megillah	\N	\N	2024-01-30 23:14:50.078927-05	1
a4b981e6-132f-4527-ae92-d1b0235d87d3	bd65d1daba6c2800a0a777aafe0345e1b11253352dd5defe29312d583d322335	2024-01-30 23:14:50.083531-05	20240123171343_megillah_release_date	\N	\N	2024-01-30 23:14:50.082703-05	1
0ac8ae8c-cb4a-4984-a282-7cafc5708c0b	0a5a59bf3cedca6c6cb947c5cf33942b809157d4ecff58f5c0a0aa97aa4c77cc	2024-01-30 23:14:50.084666-05	20240123174618_megillah_thumbnail_path	\N	\N	2024-01-30 23:14:50.083833-05	1
fd9a0e87-6e1a-4377-a582-6247ed7db9ab	769770347e2992b8333dd05d61a3079b530bc834cbc36ce845dd60df89a1c1bb	2024-01-30 23:14:50.085637-05	20240123211846_rename_pdfpath_to_iframe	\N	\N	2024-01-30 23:14:50.084928-05	1
ca7759cb-e0bd-4a5e-ac6c-68a85b22359f	5a2d27c934bbe53f56c1ca662453202041da146cf877a7f50099e6daed7ecd7e	2024-01-23 19:28:39.463292-05	20240123150946_init	\N	\N	2024-01-23 19:28:39.36442-05	1
45690071-80a7-4a69-afff-f6e7958e8853	7363ceebd87055be322525c376620392c3579de96ddd8d080abb66b5dda34e7c	2024-01-23 19:28:39.591677-05	20240123165445_megillah	\N	\N	2024-01-23 19:28:39.499168-05	1
974e79fd-bfa2-4e60-9fa8-2bad43ffd623	bd65d1daba6c2800a0a777aafe0345e1b11253352dd5defe29312d583d322335	2024-01-23 19:28:39.721841-05	20240123171343_megillah_release_date	\N	\N	2024-01-23 19:28:39.628894-05	1
f4e3c40f-502e-43e8-b969-5cd8602e1984	0a5a59bf3cedca6c6cb947c5cf33942b809157d4ecff58f5c0a0aa97aa4c77cc	2024-01-23 19:28:39.863714-05	20240123174618_megillah_thumbnail_path	\N	\N	2024-01-23 19:28:39.766476-05	1
b17e2435-6e57-47e6-a247-a62ac96780dc	769770347e2992b8333dd05d61a3079b530bc834cbc36ce845dd60df89a1c1bb	2024-01-23 19:28:40.007631-05	20240123211846_rename_pdfpath_to_iframe	\N	\N	2024-01-23 19:28:39.90123-05	1
f42e4d1a-7235-4d16-a556-27ad56540480	9dd41ca9a2161935583dee86d931e16946072bd1008d324f2f107060ddae3231	2024-01-30 23:34:10.998601-05	20240131043410_rename_iframe_field	\N	\N	2024-01-30 23:34:10.9952-05	1
\.


--
-- Name: Megillah_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Megillah_id_seq"', 103, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Post_id_seq"', 1, false);


--
-- Name: Megillah Megillah_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Megillah"
    ADD CONSTRAINT "Megillah_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Post_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Post_name_idx" ON public."Post" USING btree (name);


--
-- PostgreSQL database dump complete
--

