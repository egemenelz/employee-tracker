INSERT INTO departments(name) VALUES
('Web Development Services'),
('Mobile Development Services'),
('Backend Development Services'),
('Software Testing Services'),
('Cloud Solutions'),
('UI/UX design');

INSERT INTO roles (`title`, `salary`, `department_id`) VALUES
('Front-End Developer', 170000, 1),
('Back-EndDeveloper', 170000, 3),
('FullStackDeveloper', 190000, 1),
('QualityAssurance Engineer',120000, 4);

INSERT INTO employees (`first_name`, `last_name`, `role_id`, `manager_id`) VALUES
('Erika', 'Mcgee', 1, NULL),
('Mohamed','Watson', 1, 1),
('Maximillian', 'Richard',1, 1),
('Mila-Rose', 'Elliott', 2, 1),
('Curtis', 'Hamilton', 3, 2),
('Janet','Woolley', 4, 1),
('Millie', 'Stevens', 1, 1);
