-- insert specified values for reduction, supervision and semester
INSERT INTO SemesterPeriod (name, active) VALUES 
('WS2021', 0),
('SS21', 0),
('WS2122', 0),
('SS22', 0), 
('WS2223', 0), 
('SS23', 0), 
('WS2324', 0), 
('SS24', 1);

INSERT INTO SupervisionType (typeOfSupervision, calculationFactor, validFrom) VALUES 
('Bachelorarbeit', '0.2', 1), 
('Masterarbeit', '0.2', 1), 
('Zweitprüfer', '0.2', 1), 
('Praxissemester', '0.2', 1),
('Bachelorarbeit (ab SS24)', '0.3', 8), 
('Masterarbeit (ab SS24)', '0.3', 8), 
('Zweitprüfer (ab SS24)', '0.1', 8);

INSERT INTO DiscountType (discountType) VALUES 
('Funktion/Aufgabe'), 
('Forschung/Entwicklung'), 
('Gesetzlich');

INSERT INTO EvaluationSettings VALUES
(1, 'saldation_period', '6', 'int'),
(2, 'factor_upper_limit', '2', 'int'),
(3, 'factor_lower_limit', '2', 'int'),
(4, 'max_hours_supervisions', '3.0', 'float');

INSERT INTO TeachingGroup (groupName, groupBalance, groupDescription) VALUES
('Gruppe_1', 0, 'Beschreibung von Gruppe 1'),
('Gruppe_2', 0, 'Beschreibung von Gruppe 2'),
('Gruppe_3', 0, 'Beschreibung von Gruppe 3');

-- INSERT INTO TypeOfLecture (TypeName) VALUES 
-- ('Plattform'), 
-- ('Pflicht'), 
-- ('Wahl');