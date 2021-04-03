DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
   search_query varchar(50),
   formatted_query varchar(250),
   latitude  NUMERIC,
   longitude  NUMERIC
  );



-- DROP TABLE IF EXISTS Park;
-- CREATE TABLE Park (
--    name VARCHAR(500),
--    address VARCHAR(500),
--    fee NUMERIC,
--    description VARCHAR(500),
--    url VARCHAR(500)
--   );

-- DROP TABLE IF EXISTS Movies;

--  CREATE TABLE Movies(
--   title VARCHAR(500),
--   overview VARCHAR(500),
--   average_votes NUMERIC,
--   total_votes NUMERIC,
--   image_url VARCHAR(500),
--   popularity VARCHAR(500),
--   released_on VARCHAR(500)
--  )


