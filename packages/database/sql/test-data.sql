-- data for testing
INSERT INTO Teacher (Username, Password, FirstName, LastName, RetirementDate, TeachingBalanceTotal) VALUES
('mafre001', '12345', 'Matthias', 'Freund', '2030-06-30', 0),
('schpf001', '23456', 'Schlum', 'Pfine', '2035-08-24', 0),
('sasse001', '23456', 'Sass', 'ette', '2033-09-11', 0);

INSERT INTO DeputationPerSemester (DeputationIndividual, SemesterID, Teacher) VALUES
(18.0, 1, 'mafre001'),
(18.0, 2, 'mafre001'),
(18.0, 3, 'mafre001'),
(18.0, 4, 'mafre001'),
(18.0, 5, 'mafre001'),
(18.0, 6, 'mafre001'),
(18.0, 7, 'mafre001'),
(18.0, 8, 'mafre001'),

(20.0, 1, 'schpf001'),
(20.0, 2, 'schpf001'),
(20.0, 3, 'schpf001'),
(20.0, 4, 'schpf001'),
(20.0, 5, 'schpf001'),
(20.0, 6, 'schpf001'),
(20.0, 7, 'schpf001'),
(20.0, 8, 'schpf001'),

(18.0, 1, 'sasse001'),
(18.0, 2, 'sasse001'),
(18.0, 3, 'sasse001'),
(18.0, 4, 'sasse001'),
(18.0, 5, 'sasse001'),
(18.0, 6, 'sasse001'),
(18.0, 7, 'sasse001'),
(18.0, 8, 'sasse001');
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
(4, 5487291, 8, 'mafre001'),


(1, 1234577, 1, 'sasse001'),
(2, 1239857, 1, 'sasse001'),
(3, 2345678, 1, 'sasse001'),
(3, 2345678, 1, 'sasse001'),
(3, 3456789, 1, 'sasse001'),
(3, 4567890, 1, 'sasse001'),
(3, 5678901, 1, 'sasse001'),
(4, 5678901, 1, 'sasse001'),

(2, 1212857, 2, 'sasse001'),
(3, 2346478, 2, 'sasse001'),
(4, 5678901, 2, 'sasse001'),
(4, 5612301, 2, 'sasse001'),

(1, 1234564, 3, 'sasse001'),
(1, 1234513, 3, 'sasse001'),
(1, 1234467, 3, 'sasse001'),
(3, 5678904, 3, 'sasse001'),
(4, 5678902, 3, 'sasse001'),

(1, 1234564, 4, 'sasse001'),
(1, 1234516, 4, 'sasse001'),
(1, 1234467, 4, 'sasse001'),
(3, 5728904, 4, 'sasse001'),
(3, 5609904, 4, 'sasse001'),
(3, 5613904, 4, 'sasse001'),
(3, 5685904, 4, 'sasse001'),
(4, 5901902, 4, 'sasse001'),
(4, 5901902, 4, 'sasse001'),
(4, 5901902, 4, 'sasse001'),
(4, 5901902, 4, 'sasse001'),
-- Berechnung zu 1/3 fehlt

(1, 3456234, 5, 'sasse001'),
(1, 1234523, 5, 'sasse001'),
(3, 6783423, 5, 'sasse001'),
(3, 4573442, 5, 'sasse001'),
-- Berechnung 2/3 fehlt

(1, 1234534, 6, 'sasse001'),
(1, 1134534, 6, 'sasse001'),
(1, 1234534, 6, 'sasse001'),
(1, 1334577, 6, 'sasse001'),
(1, 1234577, 6, 'sasse001'),
(1, 1234577, 6, 'sasse001'),
(1, 6783577, 6, 'sasse001'),
(2, 1212857, 6, 'sasse001'),
(3, 2345678, 6, 'sasse001'),
(3, 2345678, 6, 'sasse001'),
(3, 3456789, 6, 'sasse001'),
(3, 4567890, 6, 'sasse001'),
(3, 4512390, 6, 'sasse001'),
(3, 5678124, 6, 'sasse001'),
(4, 5678127, 6, 'sasse001'),
(4, 5678346, 6, 'sasse001'),
(4, 5678785, 6, 'sasse001'),
(4, 5679789, 6, 'sasse001'),
(4, 5672344, 6, 'sasse001'),
(4, 5678234, 6, 'sasse001'),
(4, 5678672, 6, 'sasse001'),
(4, 5678935, 6, 'sasse001'),
-- Berechnung 5/3 fehlt

(1, 1234326, 7, 'sasse001'),
(2, 1231235, 7, 'sasse001'),
(3, 2345678, 7, 'sasse001'),
(3, 3456789, 7, 'sasse001'),
(3, 4567890, 7, 'sasse001'),
(3, 4512390, 7, 'sasse001'),
(3, 5678124, 7, 'sasse001'),
(4, 5671235, 7, 'sasse001'),

(5, 1312399, 8, 'sasse001'),
(5, 1301243, 8, 'sasse001'),
(5, 1173440, 8, 'sasse001'),
(6, 1171440, 8, 'sasse001'),
(7, 1327223, 8, 'sasse001'),
(7, 1234123, 8, 'sasse001'),
(7, 1322311, 8, 'sasse001'),
(7, 1323442, 8, 'sasse001'),
(4, 1430680, 8, 'sasse001'),
(4, 1430680, 8, 'sasse001'),
(4, 5487291, 8, 'sasse001');

INSERT INTO Reduction (TypeOfReductionID, IsArranged, ApprovalDate, ApprovedBy, ProjectName, LevelOfHandicap, ScopeOfReduction, SemesterID, Teacher) VALUES
(1, TRUE, '2020-09-15', 'Dekanat', '', 0, 2.0, 1, 'mafre001'),
(1, TRUE, '2021-02-15', 'Dekanat', '', 0, 2.0, 2, 'mafre001'),
(1, TRUE, '2021-10-15', 'Dekanat', '', 0, 2.0, 3, 'mafre001'),
(1, TRUE, '2022-01-15', 'Dekanat', '', 0, 2.0, 4, 'mafre001'),
(1, TRUE, '2022-09-15', 'Dekanat', '', 0, 1.0, 5, 'mafre001'),
(1, TRUE, '2023-01-24', 'Präsidium', '', 0, 5.0, 6, 'mafre001'),
(1, TRUE, '2023-10-15', 'Präsidium', '', 0, 5.0, 7, 'mafre001'),
(1, TRUE, '2024-04-10', 'Präsidium', '', 0, 7.0, 8, 'mafre001'),
(1, TRUE, '2024-01-24', 'Präsidium', '', 0, 2.0, 8, 'mafre001'),

(1, TRUE, '2020-02-08', 'Präsidium', '', 0, 4.0, 1, 'sasse001'),
(1, TRUE, '2020-02-08', 'Präsidium', '', 0, 4.0, 2, 'sasse001'),
(1, TRUE, '2020-02-08', 'Präsidium', '', 0, 4.0, 3, 'sasse001'),
(1, TRUE, '2020-02-08', 'Präsidium', '', 0, 4.0, 4, 'sasse001'),
(1, TRUE, '2020-02-08', 'Präsidium', '', 0, 4.0, 5, 'sasse001'),
(1, TRUE, '2020-02-08', 'Präsidium', '', 0, 4.0, 6, 'sasse001'),
(1, TRUE, '2020-02-08', 'Präsidium', '', 0, 4.0, 7, 'sasse001'),
(1, TRUE, '2020-02-08', 'Präsidium', '', 0, 4.0, 8, 'sasse001');

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
('Quantitative & Quantitative Methoden der WI BWI201', 2, 4.0, TRUE, 8, 'mafre001'),


('Kommunikation MBM20601', 3, 4.0, TRUE, 1, 'schpf001'),
('Wirtschaftsenglisch BWI30601', 3, 4.0, TRUE, 1, 'schpf001'),
('BBS', 2, 6.0, TRUE, 1, 'schpf001'),

('Kommunikation MBM20601', 3, 4.0, TRUE, 2, 'schpf001'),
('Wirtschaftsenglisch BWI30601', 3, 8.0, TRUE, 2, 'schpf001'),
('Wirtschaftsenglisch BBW30601', 3, 4.0, TRUE, 2, 'schpf001'),
('BBS', 2, 3.4, TRUE, 2, 'schpf001'),

('Kommunikation MBM20601', 3, 4.0, TRUE, 3, 'schpf001'),
('Wirtschaftsenglisch BWI30601', 3, 12.0, TRUE, 3, 'schpf001'),
('BBS', 2, 3.4, TRUE, 3, 'schpf001'),

('Kommunikation MBM20601', 3, 4.0, TRUE, 4, 'schpf001'),
('Wirtschaftsenglisch BWI30601', 3, 12.0, TRUE, 4, 'schpf001'),
('BBS', 2, 3.4, TRUE, 4, 'schpf001'),

('Kommunikation MBM20601', 3, 4.0, TRUE, 5, 'schpf001'),
('Wirtschaftsenglisch BWI30601', 3, 4.0, TRUE, 5, 'schpf001'),
('Wirtschaftsenglisch BBW30601', 3, 4.0, TRUE, 5, 'schpf001'),
('BBS', 2, 2.9, TRUE, 5, 'schpf001'),

('Kommunikation MBM20601', 3, 4.0, TRUE, 6, 'schpf001'),
('Wirtschaftsenglisch BWI30601', 3, 12.0, TRUE, 6, 'schpf001'),
('BBS', 2, 6.0, TRUE, 6, 'schpf001'),

('Kommunikation MBM20601', 3, 4.0, TRUE, 7, 'schpf001'),
('Wirtschaftsenglisch BWI30601', 3, 12.0, TRUE, 7, 'schpf001'),
('BBS', 2, 3.4, TRUE, 7, 'schpf001'),

('Kommunikation MBM20601', 3, 4.0, TRUE, 8, 'schpf001'),
('Wirtschaftsenglisch BWI30601', 3, 8.0, TRUE, 8, 'schpf001'),
('Wirtschaftsenglisch BBW30601', 3, 4.0, TRUE, 8, 'schpf001'),
('BBS', 2, 3.4, TRUE, 8, 'schpf001'),


('HR Managament MBM10104', 2, 2.0, TRUE, 1, 'sasse001'),
('Personalwirtschaft 1 BBW40204', 2, 2.0, TRUE, 1, 'sasse001'),
('Recht/Prozessmanagement BBW50401', 2, 2.0, TRUE, 1, 'sasse001'),

('HR Managament MBM10104', 2, 2.0, TRUE, 2, 'sasse001'),
('Personalwirtschaft 1 BBW40204', 2, 2.0, TRUE, 2, 'sasse001'),
('Recht/Prozessmanagement BBW50401', 2, 2.0, TRUE, 2, 'sasse001'),
('HRM Wualitätskonzepte MBM30602', 2, 4.0, TRUE, 2, 'sasse001'),

('HR Managament MBM10104', 2, 2.0, TRUE, 3, 'sasse001'),
('Personalwirtschaft 1 BBW40204', 2, 2.0, TRUE, 3, 'sasse001'),
('Recht/Prozessmanagement BBW50401', 2, 2.0, TRUE, 3, 'sasse001'),
('HRM Wualitätskonzepte MBM30602', 2, 4.0, TRUE, 3, 'sasse001'),
('Arbeitskräfteeinsatz BBW40504', 2, 2.0, TRUE, 3, 'sasse001'),

('HR Managament MBM10104', 2, 2.0, TRUE, 4, 'sasse001'),
('Personalwirtschaft 1 BBW40204', 2, 2.0, TRUE, 4, 'sasse001'),
('Recht/Prozessmanagement BBW50401', 2, 2.0, TRUE, 4, 'sasse001'),
('HRM Wualitätskonzepte MBM30602', 2, 4.0, TRUE, 4, 'sasse001'),
('Arbeitskräfteeinsatz BBW40504', 2, 4.0, TRUE, 4, 'sasse001'),

('HR Managament MBM10104', 2, 2.0, TRUE, 5, 'sasse001'),
('Personalwirtschaft 1 BBW40204', 2, 2.0, TRUE, 5, 'sasse001'),
('Recht/Prozessmanagement BBW50401', 2, 2.0, TRUE, 5, 'sasse001'),
('HRM Wualitätskonzepte MBM30602', 2, 4.0, TRUE, 5, 'sasse001'),
('Handels/Arbeitsrecht BBW204', 3, 4.0, TRUE, 5, 'sasse001'),
('Arbeitskräfteeinsatz BBW40504', 2, 2.0, TRUE, 5, 'sasse001'),

('HR Managament MBM10104', 2, 2.0, TRUE, 6, 'sasse001'),
('Personalwirtschaft 1 BBW40204', 2, 2.0, TRUE, 6, 'sasse001'),
('Recht/Prozessmanagement BBW50401', 2, 2.0, TRUE, 6, 'sasse001'),
('HRM Wualitätskonzepte MBM30602', 2, 4.0, TRUE, 6, 'sasse001'),
('Handels/Arbeitsrecht BBW204', 3, 4.0, TRUE, 6, 'sasse001'),
('Arbeitskräfteeinsatz BBW40504', 2, 2.0, TRUE, 6, 'sasse001'),

('HR Managament MBM10104', 2, 2.0, TRUE, 7, 'sasse001'),
('Personalwirtschaft 1 BBW40204', 2, 2.0, TRUE, 7, 'sasse001'),
('Recht/Prozessmanagement BBW50401', 2, 2.0, TRUE, 7, 'sasse001'),

('HR Managament MBM10104', 2, 2.0, TRUE, 8, 'sasse001'),
('Personalwirtschaft 1 BBW40204', 2, 2.0, TRUE, 8, 'sasse001'),
('Recht/Prozessmanagement BBW50401', 2, 2.0, TRUE, 8, 'sasse001'),
('HRM Wualitätskonzepte MBM30602', 2, 4.0, TRUE, 8, 'sasse001'),
('Handels/Arbeitsrecht BBW204', 3, 4.0, TRUE, 8, 'sasse001'),
('Arbeitskräfteeinsatz BBW40504', 2, 2.0, TRUE, 8, 'sasse001');