-- add random data for testing
INSERT INTO Teacher (Username, Password, FirstName, LastName, RetirementDate, TeachingBalanceTotal) VALUES
('jdoe', '12345', 'John', 'Doe', '2030-06-30', 0),
('asmith', '12345', 'Anna', 'Smith', '2028-12-31', 0),
('bwhite', '12345', 'Bob', 'White', '2025-03-15', 0),
('cmiller', '12345', 'Cathy', 'Miller', '2032-09-01', 0),
('djohnson', '12345', 'David', 'Johnson', '2027-11-20', 0),
('ewilliams', '12345', 'Eva', 'Williams', '2029-07-10', 0);

INSERT INTO TeachingGroup (TeachingGroupName, GroupBalance) VALUES
('Mathe', 0),
('Informatik', 0);

INSERT INTO Teacher_TeachingGroup (Username, TeachingGroupID) VALUES
('jdoe', 1),
('asmith', 1),
('bwhite', 1),
('cmiller', 2),
('djohnson', 2),
('ewilliams', 2);

INSERT INTO Supervision (TypeOfSupervisionID, MatriculationNumber, SemesterID, Teacher) VALUES
(1, 1234567, 1, 'jdoe'),
(2, 2345678, 2, 'asmith'),
(3, 2345678, 2, 'asmith'),
(3, 3456789, 3, 'bwhite'),
(4, 4567890, 4, 'cmiller'),
(2, 5678901, 5, 'djohnson'),
(4, 6789012, 6, 'ewilliams');

INSERT INTO Reduction (TypeOfReductionID, IsArranged, ApprovalDate, ApprovedBy, ProjectName, LevelOfHandicap, ScopeOfReduction, SemesterID, Teacher) VALUES
(1, TRUE, '2024-01-15', 'Dean', '', 0, 10.0, 1, 'jdoe'),
(2, FALSE, '2023-05-20', 'Dean', 'Project B', 0, 8.0, 2, 'asmith'),
(3, FALSE, '2022-09-10', 'Dean', '', 0.4, 12.0, 3, 'bwhite'),
(1, FALSE, '2021-11-25', 'Dean', '', 0, 6.0, 4, 'cmiller'),
(2, TRUE, '2020-03-05', 'Dean', 'Project E', 0, 15.0, 5, 'djohnson'),
(3, FALSE, '2019-07-30', 'Dean', '', 0.1, 5.0, 6, 'ewilliams');

INSERT INTO Lecture (LectureName, HoursSWS, IsArranged, SemesterID, Teacher) VALUES
('Calculus', 4.0, TRUE, 1, 'jdoe'),
('Physics 101', 3.5, FALSE, 2, 'asmith'),
('Organic Chemistry', 4.5, TRUE, 3, 'bwhite'),
('Biology Basics', 3.0, FALSE, 4, 'cmiller'),
('World History', 2.5, TRUE, 5, 'djohnson'),
('Geography of Europe', 3.5, FALSE, 6, 'ewilliams');