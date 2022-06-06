INSERT INTO departments(name) VALUES
('Web Development Services'),
('Mobile Development Services'),
('Backend Development Services'),
('Software Testing Services'),
('Cloud Solutions'),
('UI/UX design')

INSERT INTO roles (title, salary, department_id) VALUES
('CEO', 400000, 1),
('CTO', 350000, 2),
('Web Analytics Developer', 250000,3),
('UX Designer', 200000,4),
('Front-End Developer', 170000, 5),
('Back-End Developer', 170000, 6),
('FullStack Developer', 190000, 7),
('Quality Assurance Engineer',120000, 8)

INSERT INTO employess (first_name, last_name, role_id, manager_id) VALUES
('Erika', 'Mcgee', 1, NULL)
('Mohamed','Watson', 2, 1)
('Maximillian', 'Richard', 2, 1)
('Mila-Rose', 'Elliott', 3, 2)
('Curtis', 'Hamilton', 4, 2)
('Janet','Woolley', 5, 3)
('Millie', 'Stevens', 6, 3)
('Elouise', 'Morris' ,7, 2)
('Gene', 'Guest', 7, 3)
('Lorcan' 'Mccormack', 8, 2)
