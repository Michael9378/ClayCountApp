INSERT INTO admin
VALUES ('Mike', 'Scott', 'mike@email.com', '555-555-5555', 'pass');

INSERT INTO event
VALUES 
('2', 'Mikes Real Event', '2017-10-02', '2017-10-02', '123 fake street, Tempe, AZ, 85281', '12 Gauge,20/20,OtherGauge', 2, 0, 'mike@email.com'),
('3', 'Mikes Practice Event', '2017-10-01', '2017-10-01', '123 fake street, Tempe, AZ, 85281', '12 Gauge,20/20,OtherGauge', 2, 0, 'mike@email.com');

INSERT INTO station_details
VALUES 
('2', 1, 10),
('2', 2, 10),
('3', 1, 10),
('3', 2, 10);

INSERT INTO team
VALUES 
('2', 'Capstone Team'),
('3', 'Capstone Team');


INSERT INTO person
VALUES 
('2', 'Capstone Team', 'Mike', 'Scott', 'mike@email.com', '555-555-5555', '12 Guage', 0),
('3', 'Capstone Team', 'Mike', 'Scott', 'mike@email.com', '555-555-5555', '12 Guage', 0),
('2', 'Capstone Team', 'Adam', 'Sinck', 'adam@email.com', '444-444-4444', '12 Guage', 0),
('3', 'Capstone Team', 'Adam', 'Sinck', 'adam@email.com', '444-444-4444', '12 Guage', 0);


INSERT INTO station
VALUES 
('2', 'mike@email.com',  1,  7,  10),
('3', 'mike@email.com',  1,  6,  10),
('2', 'adam@email.com',  1,  7,  10),
('3', 'adam@email.com',  1,  8,  10),
('2', 'mike@email.com',  2,  7,  10),
('3', 'mike@email.com',  2,  6,  10),
('2', 'adam@email.com',  2,  7,  10),
('3', 'adam@email.com',  2,  8,  10);

INSERT INTO scorer
VALUES 
('2', 'Ye', 'Wang', 'ye@email.com', '333-333-3333', 'pass', 1),
('3', 'Ye', 'Wang', 'ye@email.com', '333-333-3333', 'pass', 1),
('2', 'Michael', 'Rainsford', 'michael@email.com', '222-222-222', 'pass', 2),
('3', 'Michael', 'Rainsford', 'michael@email.com', '222-222-222', 'pass', 2);