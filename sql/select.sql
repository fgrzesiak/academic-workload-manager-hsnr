SET @user = "mafre001";
SET @semester = 8;

-- amount of supervision per type and per person
SELECT 
    t.FirstName AS Vorname,
    t.LastName AS Nachname,
    SUM(CASE WHEN ts.TypeOfSupervision = 'Bachelorarbeit' THEN 1 ELSE 0 END) AS Anz_BA,
    SUM(CASE WHEN ts.TypeOfSupervision = 'Masterarbeit' THEN 1 ELSE 0 END) AS Anz_MA,
    SUM(CASE WHEN ts.TypeOfSupervision = 'Praxissemester' THEN 1 ELSE 0 END) AS Anz_Prxs,
    SUM(CASE WHEN ts.TypeOfSupervision = 'Zweitprüfer' THEN 1 ELSE 0 END) AS Anz_Zwtprf
FROM 
    Supervision s
JOIN 
    Teacher t ON s.Teacher = t.Username
JOIN 
    TypeOfSupervision ts ON s.TypeOfSupervisionID = ts.TypeOfSupervisionID
WHERE 
    s.SemesterID = @semester
GROUP BY 
    t.FirstName, t.LastName
ORDER BY 
    t.LastName, t.FirstName;

/*
-- Deputat for specific prof for specific semester
SELECT Semester.Name AS Semester, DeputationPerSemester.DeputationIndividual AS Deputat  
FROM DeputationPerSemester 
INNER JOIN Semester 
ON DeputationPerSemester.SemesterID = Semester.SemesterID
AND DeputationPerSemester.Teacher = @user
AND DeputationPerSemester.SemesterID = @semester;

-- overview of group of supervision
SELECT TypeOfSupervision.TypeOfSupervision, SUM(TypeOfSupervision.CalculationFactor) AS CalculationFactor
FROM Supervision
INNER JOIN TypeOfSupervision 
ON Supervision.TypeOfSupervisionID = TypeOfSupervision.TypeOfSupervisionID
AND Supervision.Teacher = @user
AND Supervision.SemesterID = @semester
GROUP BY TypeOfSupervision.TypeOfSupervision;

SELECT SUM(TypeOfSupervision.CalculationFactor) AS SumSupervision
FROM Supervision
INNER JOIN TypeOfSupervision 
ON Supervision.TypeOfSupervisionID = TypeOfSupervision.TypeOfSupervisionID
AND Supervision.Teacher = @user
AND Supervision.SemesterID = @semester;

-- overview of lectures
SELECT SUM(HoursSWS) AS SumLecture
FROM Lecture
WHERE Lecture.Teacher = @user
AND Lecture.SemesterID = @semester;

-- overview of reduction
SELECT SUM(ScopeOfReduction) AS SumReduction
FROM Reduction
WHERE Reduction.Teacher = @user
AND Reduction.SemesterID = @semester;

-- overview auf saldo
SELECT 
    (SELECT SUM(ts.CalculationFactor)
     FROM Supervision s
     INNER JOIN TypeOfSupervision ts
     ON s.TypeOfSupervisionID = ts.TypeOfSupervisionID
     WHERE s.Teacher = @user
     AND s.SemesterID = @semester) AS SumSupervision,
     
    (SELECT SUM(l.HoursSWS)
     FROM Lecture l
     WHERE l.Teacher = @user
     AND l.SemesterID = @semester) AS SumLecture,
    
    (SELECT SUM(r.ScopeOfReduction)
     FROM Reduction r
     WHERE r.Teacher = @user
     AND r.SemesterID = @semester) AS SumReduction,

-- overview of saldo
SELECT (SELECT SUM(ts.CalculationFactor)
     FROM Supervision s
     INNER JOIN TypeOfSupervision ts
     ON s.TypeOfSupervisionID = ts.TypeOfSupervisionID
     WHERE s.Teacher = @user
     AND s.SemesterID = @semester) +
    (SELECT SUM(l.HoursSWS)
     FROM Lecture l
     WHERE l.Teacher = @user
     AND l.SemesterID = @semester) +
    (SELECT SUM(r.ScopeOfReduction)
     FROM Reduction r
     WHERE r.Teacher = @user
     AND r.SemesterID = @semester) -
    (SELECT d.DeputationIndividual   
     FROM DeputationPerSemester d
     AND d.Teacher = @user
     AND d.SemesterID = @semester) AS SumSaldo;
*/