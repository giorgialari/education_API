-- Creazione della tabella 'courseTypes'
CREATE TABLE courseTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Inserimento dati di esempio nella tabella 'courseTypes'
INSERT INTO courseTypes (name) VALUES
('Ingegneria'),
('Scienze'),
('Lettere'),
('Economia');

-- Creazione della tabella 'courses'
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    idType INT,
    FOREIGN KEY (idType) REFERENCES courseTypes(id)
);

-- Inserimento dati di esempio nella tabella 'courses'
INSERT INTO courses (name, idType) VALUES
('Ingegneria Informatica', 1),
('Matematica', 2),
('Letteratura Italiana', 3),
('Economia Aziendale', 4);

-- Creazione della tabella 'universities'
CREATE TABLE universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Inserimento dati di esempio nella tabella 'universities'
INSERT INTO universities (name) VALUES
('Università di Roma'),
('Politecnico di Milano'),
('Università di Napoli'),
('Università di Torino');

-- Creazione della tabella 'course_university' per gestire le associazioni tra corsi e atenei
CREATE TABLE course_university (
    course_id INT,
    university_id INT,
    PRIMARY KEY (course_id, university_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (university_id) REFERENCES universities(id)
);

-- Inserimento dati di esempio nella tabella 'course_university'
INSERT INTO course_university (course_id, university_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3),
(4, 4),
(2, 3);

