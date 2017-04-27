DROP TABLE IF EXISTS scorer;
DROP TABLE IF EXISTS station;
DROP TABLE IF EXISTS person;
DROP TABLE IF EXISTS team;
DROP TABLE IF EXISTS station_details;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS admin;

CREATE TABLE admin 
  (
    first_name VARCHAR (20),
    last_name VARCHAR (20),
    email VARCHAR (50),
    phone VARCHAR (20),
    password VARCHAR (20),
    PRIMARY KEY (email)
  );

CREATE TABLE event
  (
    id VARCHAR (10),
    name VARCHAR (20),
    start_date DATE,
    end_date DATE,
    location VARCHAR (140),
    gauge_list VARCHAR (50),
    num_stations INT,
    max_mulligans INT,
    admin_email VARCHAR (50),
    PRIMARY KEY (id),
    FOREIGN KEY (admin_email) REFERENCES admin (email)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

CREATE TABLE station_details
  (
    event_id VARCHAR (20),
    station_num INT,
    total_hits INT,
    INDEX `station_details` (`event_id`, `station_num`  ASC),
    PRIMARY KEY (event_id, station_num),
    FOREIGN KEY (event_id) REFERENCES event (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

CREATE TABLE team
  (
    event_id VARCHAR (20),
    name VARCHAR (20),
    UNIQUE INDEX `team` (`name`, `event_id`),
    PRIMARY KEY (event_id, name),
    FOREIGN KEY (event_id) REFERENCES event (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

CREATE TABLE person 
  (
    event_id VARCHAR (20),
    team_name VARCHAR (20),
    first_name VARCHAR (20),
    last_name VARCHAR (20),
    email VARCHAR (50),
    phone VARCHAR (20),
    gauge VARCHAR (20),
    mulligans INT,
    INDEX `person` (`email`, `team_name`, `event_id`),
    PRIMARY KEY (event_id, team_name, email),
    FOREIGN KEY (team_name) REFERENCES team (name)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

CREATE TABLE station
  (
    event_id VARCHAR (20),
    person_email VARCHAR (50),
    station_num INT,
    num_hits INT,
    total_hits INT,
    PRIMARY KEY (event_id, person_email, station_num),
    FOREIGN KEY (person_email) REFERENCES person (email)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    FOREIGN KEY (event_id, station_num) REFERENCES station_details(event_id, station_num)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

CREATE TABLE scorer
  (
    event_id VARCHAR (20),
    first_name VARCHAR (20),
    last_name VARCHAR (20),
    email VARCHAR (50),
    phone VARCHAR (20),
    password VARCHAR (20),
    station_num INT,
    PRIMARY KEY (email, event_id),
    FOREIGN KEY (event_id) REFERENCES event (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );