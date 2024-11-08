-- data for testing
INSERT INTO Teacher (Username, Password, FirstName, LastName, RetirementDate, TeachingBalanceTotal) VALUES
('mafre001', '12345', 'Matthias', 'Freund', '2030-06-30', 0);

INSERT INTO DeputationPerSemester (DeputationIndividual, SemesterID, Teacher) VALUES
(18.0, 1, 'mafre001'),
(18.0, 2, 'mafre001'),
(18.0, 3, 'mafre001'),
(18.0, 4, 'mafre001'),
(18.0, 5, 'mafre001'),
(18.0, 6, 'mafre001'),
(18.0, 7, 'mafre001'),
(18.0, 8, 'mafre001');
/* 
INSERT INTO TeachingGroup (TeachingGroupName, GroupBalance) VALUES
('Mathe', 0),
('Informatik', 0);

INSERT INTO Program (ProgramName) VALUES
('BBW'),
('BWI');


INSERT INTO Teacher_TeachingGroup (Username, TeachingGroupID) VALUES
('mafre001', 1);
*/

INSERT INTO Supervision (TypeOfSupervisionID, MatriculationNumber, SemesterID, Teacher) VALUES
(1, 1234567, 1, 'mafre001'),
(3, 2345678, 1, 'mafre001'),
(3, 2345678, 1, 'mafre001'),
(3, 3456789, 1, 'mafre001'),
(3, 4567890, 1, 'mafre001'),
(3, 5678901, 1, 'mafre001'),
(3, 5678901, 1, 'mafre001'),
(3, 6789012, 1, 'mafre001'),
(4, 4567890, 1, 'mafre001'),
(4, 5678901, 1, 'mafre001'),
(4, 5678901, 1, 'mafre001'),

(1, 1234567, 2, 'mafre001'),
(1, 1234457, 2, 'mafre001'),
(3, 4567890, 2, 'mafre001'),
(3, 5678901, 2, 'mafre001'),
(3, 5678901, 2, 'mafre001'),
(3, 6789012, 2, 'mafre001'),
(4, 4567890, 2, 'mafre001'),
(4, 5678901, 2, 'mafre001'),

(2, 1234567, 3, 'mafre001'),
(2, 1234457, 3, 'mafre001'),
(3, 4567890, 3, 'mafre001'),
(3, 5678901, 3, 'mafre001'),
(3, 5678901, 3, 'mafre001'),
(3, 6789012, 3, 'mafre001'),
(3, 5621901, 3, 'mafre001'),
(4, 4567890, 3, 'mafre001'),
(4, 5678901, 3, 'mafre001'),
(4, 4567890, 3, 'mafre001'),
(4, 5678901, 3, 'mafre001'),
(4, 4567890, 3, 'mafre001'),
(4, 5678901, 3, 'mafre001'),

(1, 1234577, 4, 'mafre001'),
(1, 1232157, 4, 'mafre001'),
(1, 1234456, 4, 'mafre001'),
(2, 1239857, 4, 'mafre001'),
(3, 2345678, 4, 'mafre001'),
(3, 2345678, 4, 'mafre001'),
(3, 3456789, 4, 'mafre001'),
(3, 4567890, 4, 'mafre001'),
(3, 5678901, 4, 'mafre001'),
(3, 5678901, 4, 'mafre001'),
(4, 4567890, 4, 'mafre001'),
(4, 5678901, 4, 'mafre001'),

(1, 1234577, 5, 'mafre001'),
(1, 1232157, 5, 'mafre001'),
(1, 1234456, 5, 'mafre001'),
(3, 5678901, 5, 'mafre001'),
(3, 6789012, 5, 'mafre001'),
(3, 5621901, 5, 'mafre001'),
(4, 4567890, 5, 'mafre001'),
(4, 5678901, 5, 'mafre001'),

(1, 1234577, 6, 'mafre001'),
(3, 4567190, 6, 'mafre001'),
(3, 5673201, 6, 'mafre001'),
(3, 5675701, 6, 'mafre001'),
(4, 5671941, 6, 'mafre001'),

(1, 1234577, 7, 'mafre001'),
(3, 4567190, 7, 'mafre001'),
(3, 5673201, 7, 'mafre001'),
(4, 5671941, 7, 'mafre001'),

(5, 1304099, 8, 'mafre001'),
(5, 1300343, 8, 'mafre001'),
(5, 1171640, 8, 'mafre001'),
(7, 1327223, 8, 'mafre001'),
(4, 1430680, 8, 'mafre001'),
(4, 5487291, 8, 'mafre001');

INSERT INTO Reduction (TypeOfReductionID, IsArranged, ApprovalDate, ApprovedBy, ProjectName, LevelOfHandicap, ScopeOfReduction, SemesterID, Teacher) VALUES
(1, TRUE, '2020-09-15', 'Dekanat', '', 0, 2.0, 1, 'mafre001'),
(1, TRUE, '2021-02-15', 'Dekanat', '', 0, 2.0, 2, 'mafre001'),
(1, TRUE, '2021-10-15', 'Dekanat', '', 0, 2.0, 3, 'mafre001'),
(1, TRUE, '2022-01-15', 'Dekanat', '', 0, 2.0, 4, 'mafre001'),
(1, TRUE, '2022-09-15', 'Dekanat', '', 0, 1.0, 5, 'mafre001'),
(1, TRUE, '2023-01-24', 'Präsidium', '', 0, 5.0, 6, 'mafre001'),
(1, TRUE, '2023-10-15', 'Präsidium', '', 0, 5.0, 7, 'mafre001'),
(1, TRUE, '2024-04-10', 'Präsidium', '', 0, 7.0, 8, 'mafre001'),
(1, TRUE, '2024-01-24', 'Präsidium', '', 0, 2.0, 8, 'mafre001');

INSERT INTO Lecture (LectureName, LectureType, HoursSWS, IsArranged, SemesterID, Teacher) VALUES
('Mathematische Grundlagen der WI BWI105', 2, 4.0, TRUE, 1, 'mafre001'),
('Wirtschaftsstatistik BBW203', 2, 4.0, TRUE, 1, 'mafre001'),
('Quantitative Methoden der WI BWI201b', 2, 2.0, TRUE, 1, 'mafre001'),
('Applied Econometrics IMM10402', 3, 0, TRUE, 1, 'mafre001'),
('Empirische Analysen BBF501', 2, 4.0, TRUE, 1, 'mafre001'),

('Mathematische Grundlagen der WI BWI105', 2, 4.0, TRUE, 2, 'mafre001'),
('Wirtschaftsstatistik BBW203', 2, 4.0, TRUE, 2, 'mafre001'),
('Quantitative Methoden der WI BWI201b', 2, 2.0, TRUE, 2, 'mafre001'),
('Digital Economics & Business Model Innovation MBM30505', 3, 0, TRUE, 2, 'mafre001'),
('Projektbezogener Unterricht für BCSM', 2, 0.5, TRUE, 2, 'mafre001'),

('Mathematische Grundlagen der WI BWI105', 2, 4.0, TRUE, 3, 'mafre001'),
('Wirtschaftsstatistik BBW203', 2, 4.0, TRUE, 3, 'mafre001'),
('Quantitative Methoden der WI BWI201b', 2, 2.0, TRUE, 3, 'mafre001'),
('Applied Econometrics IMM10402', 3, 4.0, TRUE, 3, 'mafre001'),
('Empirische Analysen BBF501', 2, 4.0, TRUE, 3, 'mafre001'),

('Mathematische Grundlagen der WI BWI105', 2, 4.0, TRUE, 4, 'mafre001'),
('Wirtschaftsstatistik BBW203', 2, 4.0, TRUE, 4, 'mafre001'),
('Quantitative Methoden der WI BWI201b', 2, 2.0, TRUE, 4, 'mafre001'),
('Digital Economics & Business Model Innovation MBM30505', 3, 4.0, TRUE, 4, 'mafre001'),
('Projektbezogener Unterricht für BCSM', 2, 0.5, TRUE, 4, 'mafre001'),

('Mathematische Grundlagen der WI BWI105', 2, 4.0, TRUE, 5, 'mafre001'),
('Wirtschaftsstatistik BBW203', 2, 4.0, TRUE, 5, 'mafre001'),
('Quantitative Methoden der WI BWI201b', 2, 2.0, TRUE, 5, 'mafre001'),
('Empirische Analysen BBF501', 2, 4.0, TRUE, 5, 'mafre001'),

('Wirtschaftsstatistik BBW203', 2, 4.0, TRUE, 6, 'mafre001'),
('Quantitative Methoden der WI BWI201b', 2, 2.0, TRUE, 6, 'mafre001'),
('Projektbezogener Unterricht für BCSM', 2, 1.0, TRUE, 6, 'mafre001'),

('Wirtschaftsstatistik BBW203', 2, 4.0, TRUE, 7, 'mafre001'),
('Quantitative Methoden der WI BWI201b', 2, 2.0, TRUE, 7, 'mafre001'),
('Empirische Analysen BBF501', 2, 4.0, TRUE, 7, 'mafre001'),

('Wirtschaftsstatistik BBW203', 2, 4.0, TRUE, 8, 'mafre001'),
('Quantitative & Quantitative Methoden der WI BWI201', 2, 4.0, TRUE, 8, 'mafre001');