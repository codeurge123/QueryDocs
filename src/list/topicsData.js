export const topicsData = [
  // 1. Setup
  {
    id: "install",
    title: "Installations & Setup",
    content: `
This section helps you set up a dev environment to follow along.

1) Node + Tailwind (for front-end docs UI)
\`\`\`bash
# create a Vite React app
npm create vite@latest querydocs -- --template react
cd querydocs
npm install
# Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# add tailwind directives to src/index.css:
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

2) MySQL (quick)
\`\`\bash
# macOS
brew install mysql
brew services start mysql
# create DB
mysql -u root -p
CREATE DATABASE demo;
\`\`\`

3) PostgreSQL (quick)
\`\`\bash
brew install postgresql
brew services start postgresql
createdb demo
\`\`\`

4) SQLite (no server)
\`\`\bash
# use sqlite3 CLI or libraries (better-sqlite3) in Node
\`\`\`

Notes:
- Use .env for DB credentials.
- Install a DB GUI (MySQL Workbench, pgAdmin) for easy browsing.
`,
  },

  // 2. Basics / Syntax
  {
    id: "syntax",
    title: "SQL Syntax (Basics)",
    content: `
Overview:
SQL keywords are case-insensitive (but many people write them uppercase). Statements usually end with a semicolon.

Example:
\`\`\`sql
SELECT col1, col2
FROM my_table
WHERE col3 = 'value';
\`\`\`

Notes:
- Use comments with -- single-line or /* multi-line */.
- Use consistent formatting to improve readability.
`,
  },

  // 3. Basic SELECT & related
  {
    id: "select",
    title: "SQL SELECT",
    content: `
Overview:
The SELECT statement retrieves rows from one or more tables. The result is called a result set.
Basic form: SELECT <columns> FROM <table> [WHERE ...] [GROUP BY ...] [ORDER BY ...] [LIMIT ...].

Examples & Explanation:

1) Select specific columns:
\`\`\`sql
SELECT id, name, email
FROM users;
\`\`\`
This returns only id, name and email for every row.

2) Filtering with WHERE:
\`\`\`sql
SELECT id, name
FROM users
WHERE active = 1 AND signup_date > '2024-01-01';
\`\`\`
WHERE filters rows before aggregation. Use boolean operators (AND, OR, NOT) and parentheses for clarity.

3) Sorting & pagination:
\`\`\`sql
SELECT id, name
FROM users
ORDER BY created_at DESC
LIMIT 25 OFFSET 50; -- page 3 of 25 items per page
\`\`\`

Best practices:
- Prefer explicit column lists over SELECT * in production.
- Use indexes on columns used in WHERE/ORDER BY for performance.
`,
  },

  {
    id: "select-distinct",
    title: "SELECT DISTINCT",
    content: `
Overview:
Remove duplicate rows from a column or combination of columns.

Example:
\`\`\`sql
SELECT DISTINCT country FROM users;
\`\`\`

Notes:
- DISTINCT applies to the entire select list; DISTINCT ON (Postgres) allows targeting a column.
`,
  },

  // 4. Filtering & sorting helpers
  {
    id: "where",
    title: "SQL WHERE (Filters)",
    content: `
Overview:
WHERE filters rows before grouping or selecting.

Examples:
\`\`\`sql
SELECT * FROM orders WHERE amount >= 100.00;
SELECT * FROM products WHERE name LIKE '%book%' AND stock > 0;
\`\`\`

Operators:
- Comparison: =, !=, <>, >, <, >=, <=
- Pattern: LIKE, ILIKE (Postgres for case-insensitive)
- NULL checks: IS NULL, IS NOT NULL
`,
  },

  {
    id: "order-by",
    title: "ORDER BY",
    content: `
Overview:
ORDER results by columns. Default is ASC.

Example:
\`\`\`sql
SELECT id, total FROM orders ORDER BY total DESC, created_at ASC;
\`\`\`

Notes:
- ORDER BY can take column positions (e.g., ORDER BY 2), but prefer column names.
`,
  },

  {
    id: "select-top",
    title: "SELECT TOP / LIMIT (Pagination)",
    content: `
Overview:
Different DBs use different LIMIT syntax.

Examples:
\`\`\`sql
-- MySQL/Postgres/SQLite
SELECT * FROM items ORDER BY id LIMIT 10 OFFSET 20;

-- SQL Server
SELECT TOP (10) * FROM items ORDER BY id;
\`\`\`

Tip:
- For large tables consider keyset pagination for stable, fast paging.
`,
  },

  {
    id: "and-or-not",
    title: "AND / OR / NOT (Boolean Logic)",
    content: `
Overview:
Combine multiple conditions with AND / OR; use NOT to negate.

Examples:
\`\`\`sql
SELECT * FROM users WHERE active = 1 AND (role = 'admin' OR role = 'manager');
\`\`\`

Precedence:
- AND has higher precedence than OR. Use parentheses for clarity.
`,
  },

  {
    id: "aliases",
    title: "Aliases (AS)",
    content: `
Overview:
Use aliases to rename columns or tables for readability.

Examples:
\`\`\`sql
SELECT u.id AS user_id, u.name FROM users u;
SELECT o.*, u.name AS customer_name FROM orders o JOIN users u ON u.id = o.user_id;
\`\`\`

Notes:
- AS is optional for column aliases (but clearer).
`,
  },

  // 5. Joins & related
  {
    id: "joins",
    title: "SQL JOINS (INNER, LEFT, RIGHT, FULL)",
    content: `
Overview:
JOINs combine rows from multiple tables. Use JOIN when data is normalized across tables.

1) INNER JOIN - only matching rows:
\`\`\`sql
SELECT u.id, u.name, o.order_id, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;
\`\`\`
INNER JOIN returns rows where the ON condition matches.

2) LEFT JOIN - all left rows + matches:
\`\`\`sql
SELECT u.id, u.name, o.order_id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
\`\`\`
If a user has no orders, order_id will be NULL.

3) RIGHT JOIN - all right rows + matches:
\`\`\`sql
-- (not supported in SQLite)
SELECT p.id, p.title, c.name
FROM posts p
RIGHT JOIN categories c ON p.category_id = c.id;
\`\`\`

4) FULL OUTER JOIN - all rows from both sides:
Some DBs (Postgres) support FULL JOIN. In MySQL you can emulate via UNION of LEFT + RIGHT.
\`\`\`sql
-- Postgres
SELECT a.id, b.id
FROM a
FULL JOIN b ON a.key = b.key;
\`\`\`

Tips:
- Use table aliases (u, o) to keep queries readable.
- Always specify JOIN condition (ON) to avoid Cartesian products.
`,
  },

  // 6. Grouping & aggregation
  {
    id: "groupby",
    title: "GROUP BY & Aggregation",
    content: `
Overview:
GROUP BY groups rows to compute aggregate values like SUM, COUNT, AVG, MIN, MAX.

1) Count rows per department:
\`\`\`sql
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;
\`\`\`

2) Group + filter groups with HAVING:
\`\`\`sql
SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
HAVING AVG(salary) > 60000;
\`\`\`
HAVING filters groups after aggregation; WHERE filters rows before grouping.

3) Aggregates with joins:
\`\`\`sql
SELECT u.id, u.name, COUNT(o.id) AS orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
\`\`\`

Rules:
- Every SELECT column must be either aggregated or included in GROUP BY (SQL standard).
- Use window functions (OVER) for running totals without grouping (advanced).
`,
  },

  {
    id: "aggregate-functions",
    title: "Aggregate Functions (COUNT, SUM, AVG)",
    content: `
Overview:
Aggregates collapse multiple rows into summary values.

Examples:
\`\`\`sql
SELECT COUNT(*) AS total_orders, SUM(amount) AS total_revenue FROM orders;
SELECT AVG(score) FROM exams WHERE subject = 'math';
\`\`\`

Notes:
- COUNT(col) counts non-null values.
`,
  },

  {
    id: "min-max",
    title: "MIN / MAX",
    content: `
Overview:
Return smallest or largest values.

Examples:
\`\`\`sql
SELECT MIN(price) AS cheapest, MAX(price) AS priciest FROM products;
\`\`\`
`,
  },

  // 7. Window functions, CTEs, recursive CTE
  {
    id: "window-functions",
    title: "Window Functions (OVER)",
    content: `
Overview:
Window functions compute values across rows related to the current row, without collapsing results.

Examples:
\`\`\`sql
SELECT id, user_id, amount,
  SUM(amount) OVER (PARTITION BY user_id ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders;
\`\`\`

Common functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), SUM() OVER().
`,
  },

  {
    id: "ctes",
    title: "Common Table Expressions (CTE)",
    content: `
Overview:
CTEs (WITH ...) let you define named subqueries for readability & reuse.

Example:
\`\`\`sql
WITH top_customers AS (
  SELECT user_id, SUM(amount) AS total
  FROM orders
  GROUP BY user_id
  ORDER BY total DESC
  LIMIT 10
)
SELECT u.name, t.total
FROM top_customers t
JOIN users u ON u.id = t.user_id;
\`\`\`

Notes:
- Recursive CTEs support hierarchical queries (trees).
`,
  },

  {
    id: "recursive-cte",
    title: "Recursive CTE (Hierarchical Data)",
    content: `
Overview:
Recursive CTEs iterate until a terminating condition (useful for tree/graph traversal).

Example (employee-manager tree):
\`\`\`sql
WITH RECURSIVE emp_tree AS (
  SELECT id, manager_id, name FROM employees WHERE id = 1  -- root
  UNION ALL
  SELECT e.id, e.manager_id, e.name
  FROM employees e
  JOIN emp_tree et ON e.manager_id = et.id
)
SELECT * FROM emp_tree;
\`\`\`
`,
  },

  // 8. Subqueries
  {
    id: "subqueries",
    title: "Subqueries (Nested Queries)",
    content: `
Overview:
A subquery is a SELECT inside another statement. Subqueries can be used in WHERE, FROM, or SELECT.

1) IN subquery:
\`\`\`sql
SELECT name
FROM users
WHERE id IN (SELECT user_id FROM orders WHERE total > 100);
\`\`\`

2) Correlated subquery:
\`\`\`sql
SELECT u.name,
  (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;
\`\`\`
The inner query references the outer query row (correlated).

3) Subquery in FROM:
\`\`\`sql
SELECT t.country, t.cnt
FROM (
  SELECT country, COUNT(*) AS cnt FROM users GROUP BY country
) t
WHERE t.cnt > 100;
\`\`\`

Performance:
- Subqueries can be slower; consider JOINs or temporary tables for large data.
`,
  },

  // 9. Set operators
  {
    id: "union",
    title: "UNION & UNION ALL",
    content: `
Overview:
Combine result sets from multiple SELECTs.

Examples:
\`\`\`sql
SELECT id, name FROM customers
UNION
SELECT id, name FROM prospects;
-- UNION removes duplicates; UNION ALL keeps duplicates:
SELECT id, name FROM customers
UNION ALL
SELECT id, name FROM prospects;
\`\`\`
`,
  },

  {
    id: "intersect-except",
    title: "INTERSECT & EXCEPT (Set Operators)",
    content: `
Overview:
Set operators compare result sets (supported in many, but not all DBs).

Examples (Postgres / SQL Server):
\`\`\`sql
-- rows present in both
SELECT id FROM a INTERSECT SELECT id FROM b;

-- rows in a but not in b
SELECT id FROM a EXCEPT SELECT id FROM b;
\`\`\`
`,
  },

  // 10. Pattern / membership / range
  {
    id: "like",
    title: "LIKE and Wildcards",
    content: `
Overview:
LIKE supports pattern matching using % & _.

Examples:
\`\`\`sql
SELECT * FROM customers WHERE name LIKE 'A%'; -- starts with A
SELECT * FROM items WHERE sku LIKE '%-2024'; -- ends with -2024
SELECT * FROM codes WHERE code LIKE '_A%'; -- single char then 'A'
\`\`\`

Notes:
- For case-insensitive matches use ILIKE (Postgres) or LOWER()/UPPER() functions.
`,
  },

  {
    id: "in",
    title: "IN (Set Membership)",
    content: `
Overview:
IN matches values within a list or subquery.

Examples:
\`\`\`sql
SELECT * FROM users WHERE id IN (1,2,3);
SELECT * FROM orders WHERE user_id IN (SELECT id FROM vip_users);
\`\`\`
`,
  },

  {
    id: "between",
    title: "BETWEEN (Range)",
    content: `
Overview:
BETWEEN checks inclusive ranges.

Example:
\`\`\`sql
SELECT * FROM orders WHERE created_at BETWEEN '2024-01-01' AND '2024-01-31';
\`\`\`

Note:
- Be careful with date times (time-of-day affects inclusivity).
`,
  },

  // 11. CRUD: Insert / Update / Delete
  {
    id: "insert-into",
    title: "INSERT INTO",
    content: `
Overview:
Insert rows. Specify columns to avoid column-order issues.

Examples:
\`\`\`sql
INSERT INTO users (name, email, active) VALUES ('Sam', 'sam@example.com', 1);

INSERT INTO logs (event_time, description)
SELECT NOW(), 'import complete' FROM dual; -- some DBs use DUAL
\`\`\`
`,
  },

  {
    id: "update-topic",
    title: "UPDATE (Modify Rows)",
    content: `
Overview:
UPDATE changes data. Always include WHERE to restrict rows unless you mean to update all.

Examples:
\`\`\`sql
UPDATE users SET last_login = NOW() WHERE id = 123;
UPDATE products SET price = price * 1.05 WHERE category = 'gadgets';
\`\`\`
`,
  },

  {
    id: "delete-topic",
    title: "DELETE (Remove Rows)",
    content: `
Overview:
DELETE removes rows. Use transactions or soft deletes for safety.

Examples:
\`\`\`sql
DELETE FROM sessions WHERE expires_at < NOW();
-- Soft delete pattern:
UPDATE users SET deleted_at = NOW() WHERE id = 99;
\`\`\`
`,
  },

  // 12. Transactions & concurrency
  {
    id: "transactions",
    title: "Transactions & Concurrency",
    content: `
Overview:
Transactions ensure a group of SQL statements executes atomically. Typical transaction commands: BEGIN / COMMIT / ROLLBACK.

1) Money transfer example:
\`\`\`sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
\`\`\`
If any statement fails, ROLLBACK to revert changes.

2) Isolation levels:
- READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.
Higher isolation reduces anomalies but may impact concurrency.

3) Use transactions for:
- Multi-step updates that must be atomic
- Bulk insert/update with rollback on error
`,
  },

  // 13. Indexes & optimization helpers
  {
    id: "index",
    title: "Indexes & Query Optimization",
    content: `
Overview:
Indexes speed up lookups on columns but add storage and slow down writes (INSERT/UPDATE/DELETE). Use them for high-read columns used in WHERE/ORDER BY.

1) Create index:
\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
\`\`\`

2) Composite index (multi-column):
\`\`\`sql
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
\`\`\`

3) Inspect query plan:
\`\`\`sql
EXPLAIN SELECT * FROM orders WHERE user_id = 123;
-- or EXPLAIN ANALYZE in Postgres for runtime stats
\`\`\`

Tips:
- Use EXPLAIN to identify full-table scans.
- Avoid indexing low-cardinality columns (e.g., boolean) unless combined in composite indexes.
- Consider covering indexes when SELECT reads only indexed columns.
`,
  },

  {
    id: "explain-analyze",
    title: "EXPLAIN / EXPLAIN ANALYZE (Query Plans)",
    content: `
Overview:
EXPLAIN shows how the DB will execute a query; EXPLAIN ANALYZE runs it and shows actual timings (Postgres).

Example:
\`\`\`sql
EXPLAIN SELECT * FROM orders WHERE user_id = 123;
-- or
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
\`\`\`

Use:
- Find full table scans, missing indexes, and expensive sorts.
`,
  },

  {
    id: "performance-tuning",
    title: "Performance Tuning",
    content: `
Overview:
Performance tuning involves indexing, query refactoring, caching, batching, and hardware configuration.

Checklist:
- Add indexes where appropriate.
- Avoid N+1 query patterns.
- Use connection pooling.
- Cache heavy, infrequently changing queries in Redis or app layer.
`,
  },

  // 14. Partitioning / scaling
  {
    id: "partitioning",
    title: "Partitioning (Large Tables)",
    content: `
Overview:
Partitioning splits a large table into smaller pieces for manageability & performance.

Example (Postgres declarative partition):
\`\`\`sql
CREATE TABLE logs (
  id serial,
  created_at timestamptz,
  message text
) PARTITION BY RANGE (created_at);

CREATE TABLE logs_2024 PARTITION OF logs FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
\`\`\`

Notes:
- Use partition pruning to speed queries that filter by partition key.
`,
  },

  {
    id: "sharding-replication",
    title: "Sharding & Replication (Scaling)",
    content: `
Overview:
- Replication: copy data to replicas for read scaling and failover.
- Sharding: split data across multiple servers by key for write scaling.

Notes:
- Sharding increases complexity; prefer replication + vertical scaling first.
- Use managed DB services to simplify replication/sharding.
`,
  },

  // 15. Backups / import-export / admin
  {
    id: "backup-restore",
    title: "Backup & Restore",
    content: `
Overview:
Backups are essential. Use logical (dump) or physical backups.

Examples:
\`\`\`bash
# MySQL logical
mysqldump -u root -p mydb > mydb.sql

# Postgres
pg_dump -U postgres mydb > mydb.sql
pg_restore -U postgres -d newdb mydb.dump
\`\`\`

Notes:
- Test restores regularly.
- Use point-in-time recovery for critical systems.
`,
  },

  {
    id: "import-export",
    title: "Import / Export Data (CSV, JSON)",
    content: `
Overview:
Use bulk import/export tools for large datasets.

Examples:
\`\`\`sql
-- Postgres copy from CSV
COPY users (id, name, email) FROM '/path/users.csv' CSV HEADER;

-- MySQL
LOAD DATA INFILE '/path/users.csv' INTO TABLE users FIELDS TERMINATED BY ',' IGNORE 1 LINES;
\`\`\`
`,
  },

  // 16. Views, stored procs, triggers
  {
    id: "stored-procedures",
    title: "Stored Procedures & Functions",
    content: `
Overview:
Stored procedures and functions run on the DB server and encapsulate logic.

Examples (Postgres plpgsql concept):
\`\`\sql
CREATE FUNCTION add_numbers(a INT, b INT) RETURNS INT AS $$
BEGIN
  RETURN a + b;
END;
$$ LANGUAGE plpgsql;
\`\`\`

Notes:
- Use stored procs for heavy DB logic, but keep business rules maintainable.
`,
  },

  {
    id: "triggers",
    title: "Triggers",
    content: `
Overview:
Triggers run automatically on INSERT/UPDATE/DELETE events.

Example (Postgres):
\`\`\`sql
CREATE FUNCTION set_timestamp() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_trigger
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_timestamp();
\`\`\`
Use triggers carefully; they can hide side effects.
`,
  },

  // 17. Security, roles, injection prevention
  {
    id: "permissions-roles",
    title: "Permissions & Roles",
    content: `
Overview:
Grant least privilege to users/roles.

Examples:
\`\`\`sql
CREATE ROLE readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
CREATE USER app_user WITH PASSWORD 'secure';
GRANT readonly TO app_user;
\`\`\`

Notes:
- Use separate DB users for apps and admins.
- Rotate credentials and use managed secrets when possible.
`,
  },

  {
    id: "prepared-statements",
    title: "Prepared Statements & Parameterized Queries",
    content: `
Overview:
Use parameterized queries to avoid SQL injection and improve performance.

Example (pseudo):
\`\`\`sql
-- parameterized (language driver)
SELECT * FROM users WHERE email = ?;
\`\`\`

Notes:
- Never interpolate raw user input into SQL strings.
`,
  },

  {
    id: "sql-injection",
    title: "SQL Injection Prevention",
    content: `
Overview:
SQL injection occurs when attackers manipulate query strings. Prevent it with parameterized queries, input validation, and least privilege.

Example:
\`\`\`sql
-- BAD (vulnerable)
EXECUTE 'SELECT * FROM users WHERE name = ''' || user_input || '''';

-- GOOD (parameterized)
PREPARE stmt (text) AS SELECT * FROM users WHERE name = $1;
EXECUTE stmt('Alice');
\`\`\`
`,
  },

  // 18. Data types, strings, dates
  {
    id: "data-types",
    title: "Data Types & Casting",
    content: `
Overview:
Choose appropriate data types: INT, BIGINT, DECIMAL, VARCHAR, TEXT, DATE/TIMESTAMP, BOOLEAN, JSON, etc.

Example:
\`\`\`sql
SELECT id, CAST(created_at AS DATE) FROM events;
-- or
SELECT id, created_at::date FROM events; -- Postgres shorthand
\`\`\`

Notes:
- Use DECIMAL for exact monetary values, FLOAT for approximate.
`,
  },

  {
    id: "string-functions",
    title: "String Functions",
    content: `
Overview:
Common string functions: CONCAT, LOWER, UPPER, TRIM, SUBSTRING, REPLACE.

Examples:
\`\`\`sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;
SELECT SUBSTRING(description, 1, 100) FROM posts;
\`\`\`
`,
  },

  {
    id: "date-functions",
    title: "Date & Time Functions",
    content: `
Overview:
Manipulate dates with functions like NOW(), DATE_ADD/DATE_SUB (MySQL), DATE_TRUNC (Postgres), INTERVAL.

Examples:
\`\`\`sql
SELECT NOW(), DATE_TRUNC('day', created_at) FROM events; -- Postgres
SELECT DATE_ADD(created_at, INTERVAL 7 DAY) FROM orders; -- MySQL
\`\`\`
`,
  },

  // 19. Utilities / advanced tools
  {
    id: "pivot-unpivot",
    title: "PIVOT / UNPIVOT",
    content: `
Overview:
Pivot transforms rows into columns (DB-specific syntax).

Example (conceptual; exact syntax varies by DB):
\`\`\`sql
-- Postgres uses crosstab() from tablefunc extension
-- SQL Server has PIVOT clause
\`\`\`

Use pivot sparingly; sometimes client-side transformations are easier.
`,
  },

  {
    id: "orms",
    title: "ORMs (Object-Relational Mappers)",
    content: `
Overview:
ORMs (e.g., Sequelize, TypeORM, Hibernate) map DB tables to programming language objects.

Notes:
- ORMs speed development but can generate inefficient queries for complex reports.
- Use raw queries for performance-critical operations.
`,
  },

  {
    id: "views",
    title: "Views",
    content: `
VIEWS
Database views are virtual tables based on queries. Use them to simplify complex queries.

\`\`\`sql
CREATE VIEW active_users AS
SELECT id, name, email
FROM users
WHERE active = 1;
\`\`\`
`,
  },

  // 20. Advanced & wrap-up
  {
    id: "advanced-sql",
    title: "Advanced SQL Topics (Summary)",
    content: `
Overview:
Advanced topics to explore after basics:
- Query optimization & execution plans
- Advanced window functions (frame specs)
- Distributed SQL and NewSQL databases
- Materialized views
- Temporal tables and event sourcing

Each advanced topic typically requires DB-specific features and deeper performance testing.
`,
  },

  {
    id: "explain-analyze",
    title: "EXPLAIN / EXPLAIN ANALYZE (Query Plans)",
    content: `
Overview:
EXPLAIN shows how the DB will execute a query; EXPLAIN ANALYZE runs it and shows actual timings (Postgres).

Example:
\`\`\`sql
EXPLAIN SELECT * FROM orders WHERE user_id = 123;
-- or
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
\`\`\`

Use:
- Find full table scans, missing indexes, and expensive sorts.
`,
  }
];