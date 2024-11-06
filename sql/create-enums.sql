-- insert specified values for reduction, supervision and semester
INSERT INTO Semester (Name, IsActive) VALUES 
('SS22', 0), 
('WS2223', 0), 
('SS23', 0), 
('WS2324', 0), 
('SS24', 0), 
('WS2435', 1);

INSERT INTO TypeOfSupervision (TypeOfSupervision, CalculationFactor) VALUES 
('Bachelorarbeit', '0.3'), 
('Masterarbeit', '0.3'), 
('Zweitprüfer', '0.1'), 
('Praxissemester', '0.2');

INSERT INTO TypeOfReduction (TypeOfReduction) VALUES 
('Funktion/Aufgabe'), 
('Forschung/Entwicklung'), 
('Behinderung');

INSERT INTO LectureType (TypeName) VALUES 
('Plattform'), 
('Pflicht'), 
('Wahl');