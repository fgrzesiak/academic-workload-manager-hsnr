-- delete old and create new database
-- DROP DATABASE deputationFB08;
CREATE DATABASE deputationFB08;

-- create all tables
CREATE TABLE Teacher (
    Username VARCHAR(100) NOT NULL,
    Password VARCHAR(100),
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    RetirementDate DATE,
    TeachingBalanceTotal DECIMAL(6, 2),
    PRIMARY KEY (Username)
);

CREATE TABLE TeachingGroup (
    TeachingGroupID INT NOT NULL AUTO_INCREMENT,
    TeachingGroupName VARCHAR(100),
    GroupBalance DECIMAL(6, 2),
    PRIMARY KEY (TeachingGroupID)
);

CREATE TABLE Teacher_TeachingGroup (
    Username VARCHAR(100) NOT NULL,    
    TeachingGroupID INT NOT NULL,
    PRIMARY KEY (Username, TeachingGroupID),
    FOREIGN KEY (Username) REFERENCES Teacher(Username),
    FOREIGN KEY (TeachingGroupID) REFERENCES TeachingGroup(TeachingGroupID)
);

CREATE TABLE Semester (
    SemesterID INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR (100),
    IsActive BOOLEAN,
    PRIMARY KEY (SemesterID)
);

CREATE TABLE DeputationPerSemester (
    DeputationID INT NOT NULL AUTO_INCREMENT,
    DeputationIndividual DECIMAL (6, 2),
    TotalBalance DECIMAL (10, 2),
    TotalBalanceArranged DECIMAL (6, 2),
    SemesterID INT,
    Teacher VARCHAR(100),
    PRIMARY KEY (DeputationID),
    FOREIGN KEY (SemesterID) REFERENCES Semester(SemesterID),
    FOREIGN KEY (Teacher) REFERENCES Teacher(Username)
);

CREATE TABLE TypeOfSupervision (
    TypeOfSupervisionID INT NOT NULL AUTO_INCREMENT,
    TypeOfSupervision VARCHAR (100),
    CalculationFactor DECIMAL (6, 2),
    PRIMARY KEY (TypeOfSupervisionID)
);

CREATE TABLE Supervision (
    SupervisionID INT NOT NULL AUTO_INCREMENT,
    TypeOfSupervisionID INT,
    MatriculationNumber INT,
    SemesterID INT,
    Teacher VARCHAR(100),
    PRIMARY KEY (SupervisionID),
    FOREIGN KEY (TypeOfSupervisionID) REFERENCES TypeOfSupervision(TypeOfSupervisionID),
    FOREIGN KEY (SemesterID) REFERENCES Semester(SemesterID),
    FOREIGN KEY (Teacher) REFERENCES Teacher(Username)
);

CREATE TABLE TypeOfReduction (
    TypeOfReductionID INT NOT NULL AUTO_INCREMENT,
    TypeOfReduction VARCHAR(100),
    PRIMARY KEY (TypeOfReductionID)
);

CREATE TABLE Reduction (
    ReductionID INT NOT NULL AUTO_INCREMENT,
    TypeOfReductionID INT,
    IsArranged BOOLEAN,
    ApprovalDate DATE,
    ApprovedBy VARCHAR(100),
    ProjectName VARCHAR (200),
    LevelOfHandicap DECIMAL(6, 2),
    ScopeOfReduction DECIMAL(6, 2),
    SemesterID INT,
    Teacher VARCHAR(100),
    PRIMARY KEY (ReductionID),
    FOREIGN KEY (TypeOfReductionID) REFERENCES TypeOfReduction(TypeOfReductionID),
    FOREIGN KEY (SemesterID) REFERENCES Semester(SemesterID),
    FOREIGN KEY (Teacher) REFERENCES Teacher(Username)
);

CREATE TABLE Program (
    ProgramID INT NOT NULL AUTO_INCREMENT,
    ProgramName VARCAHR (100),
    PRIMARY KEY (ProgramID)
);

CREATE TABLE Lecture (
    LectureID INT NOT NULL AUTO_INCREMENT,
    LectureName VARCHAR (200),
    HoursSWS DECIMAL (6, 2),
    IsArranged BOOLEAN,
    ProgramID INT,
    SemesterID INT,
    Teacher VARCHAR(100),
    PRIMARY KEY (LectureID),
    FOREIGN KEY (ProgramID) REFERENCES Program(ProgramID),
    FOREIGN KEY (SemesterID) REFERENCES Semester(SemesterID),
    FOREIGN KEY (Teacher) REFERENCES Teacher(Username)    
);