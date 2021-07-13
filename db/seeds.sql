INSERT INTO department (dep_name)
VALUE
('Sales and Stores'),
('Purchasing'),
('Marketing'),
('Human Resource Management'),
('Accounting and Finances'),
('Information Technologies');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Associate', 30000, 1),
('Sales Floor Coordinator', 30000, 1),
('Warehouse Associate', 45000, 1), 
('Warehouse Coordinator', 55000, 1),
('Store Manager', 60000, 1), 
('District Manager', 80000, 1), 
('Purchasing Assistant', 35000, 2),
('Purchasing Administrator', 45000, 2),
('Purchasing Manager', 65000, 2),
('Local Brands Purchasers', 45000, 2),  
('Luxury Brands Purchasers', 46000, 2),
('Marketing Administrator', 45000, 3),
('Marketing Manager', 65000, 3),
('Marketing Coordinator', 55000, 3),
('Reginal Marketers', 60000, 3),
('District Marketers', 70000, 3),
('HR Assistant', 45000, 4),
('HR Coordinator', 50000, 4),
('HR Manager', 70000, 4),
('AP Admin', 50000, 5),
('AR Admin', 50000, 5),
('Finance Assistant', 70000, 5),
('Finance Manager', 70000, 5),
('IT Associate', 40000, 6),
('IT Manager', 60000, 6);

-- Add Managers
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Anna', 'Corella', 4, NULL),
('Tristan', 'Grant', 10, NULL),
('Rose', 'Brown', 14, NULL),
('Rita', 'Salem', 17, NULL),
('Peter', 'Salividor', 19, NULL),
('Andre', 'Doe', 23, NULL),
('Jared', 'Williams', 1, 4),
('Ben', 'Stone', 3, 4),
('Zeke', 'Landon', 6, 8),
('Robert', 'Vance', 13, 14),
('Fiona', 'Clarke', 16, 17),
('Kimberly', 'Williams', 18, 19),
('Michaela', 'Reid', 22, 23);

SELECT 
    CONCAT(m.first_name, ', ', m.last_name) AS Manager,
    CONCAT(e.last_name, ', ', e.first_name) AS 'Direct report',
    e.id,
    e.manager_id

FROM
    employee e
INNER JOIN employee m ON 
    m.manager_id = e.id
ORDER BY 
    Manager;