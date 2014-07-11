# inner join returns rows when there is at 
# least one match in both the tables
create table test.table1
(ID int, Value varchar(10));

insert into test.table1 (ID, Value)
select 1, 'first'
union all 
select 2, "second"
union all
select 3, "third"
union all
select 4, "fourth"
union all
select 5, "fifth";

create table test.table2
(ID int, Value varchar(10));

insert into test.table2 (ID, Value)
select 1, 'first'
union all 
select 2, "second"
union all
select 3, "third"
union all
select 68, "sixth"
union all
select 85, "eighth";

select * from test.table1;
select * from test.table2;

SELECT t1.*, t2.*
FROM test.table1 t1
INNER JOIN test.table2 t2 ON t1.ID = t2.ID;

select  t1.ID as T1ID, t1.Value as T1Value,
		t2.ID as T2ID, t2.Value as T2Value
from test.table1 t1
inner join test.table2 t2 on t1.ID = t2.ID;

#outer join - left outer join, right outer join
# LEFT OUTER join returns all the rows from the left table with the
# matching rows from the right table

# Left Join or Left Outer Join
select  t1.ID as T1ID, t1.Value as T1Value, 
		t2.ID as T2ID, t2.Value as T2Value
from test.table1 t1
left join test.table2 t2 on t1.ID = t2.ID;


# RIGHT OUTER join returns all the rows from the right table with the
# matching rows from the left table

# Right Join or Right Outer Join
select  t1.ID as T1ID, t1.Value as T1Value, 
		t2.ID as T2ID, t2.Value as T2Value
from test.table1 t1
right join test.table2 t2 on t1.ID = t2.ID;

# FUll OUTER JOIN - This join returns rows from either table when the conditions are met
# and returns a null value when there is no match
# NO MySQL support - Here is an Alternative
select  t1.ID as T1ID, t1.Value as T1Value, 
		t2.ID as T2ID, t2.Value as T2Value
from test.table1 t1
left join test.table2 t2 on t1.ID = t2.ID

Union

select  t1.ID as T1ID, t1.Value as T1Value, 
		t2.ID as T2ID, t2.Value as T2Value
from test.table1 t1
right join test.table2 t2 on t1.ID = t2.ID;

# CROSS JOIN - The result set contains records that are multiples of the record
# number of both the tables
select  t1.ID as T1ID, t1.Value as T1Value, 
		t2.ID as T2ID, t2.Value as T2Value
from test.table1 t1
cross join test.table2 t2;

#POP QUIZ
create table test.students
(student_id Int, student_name varchar(10));

insert into test.students (student_id, student_name)
select 1, "John"
union all
select 2, "Matt"
union all
select 3, "James";

create table test.classes
(class_id Int, class_name varchar(10));

insert into test.classes (class_id, class_name)
select 1, "Math"
union all
select 2, "Art"
union all
select 3, "History";

create table test.student_class
(student_id Int, class_id int);

insert into test.student_class (student_id, class_id)
select 1, 1
union all
select 1, 2
union all
select 3, 1
union all
select 3, 2;

select * from test.students;
select * from test.classes;
select * from test.student_class;

# Question 1: What will be the best possible join if we want to retrieve
# all the students who have signed up for the classes in the summer?
select st.student_name, cl.class_name
from test.student_class sc
inner join test.classes cl on cl.class_id = sc.class_id
inner join test.students st on st.student_id = sc.student_id;

# Question 2: What will be the best possible join if we want to retrieve
# all the students who have signed up for no classes in summer?
select st.student_name, cl.class_name
from test.students st
left join test.student_class sc on st.student_id = sc.student_id
left join test.classes cl on cl.class_id = sc.class_id
where cl.class_name is null;

select st.student_name
from test.students st
left join test.student_class sc on st.student_id = sc.student_id
where sc.class_id is null;

# self join - join in which a table is joined with itself
# The user must qualify each column name used in SELECT clauses with
# a table alias to avoid ambiguity
create table test.employee(
employee_id int primary key,
name nvarchar(50),
manager_id int
);

insert into test.employee
select 1, "Mike", 3
union all
select 2, "David", 3
union all
select 3, "Roger", null
union all
select 4, "Marry", 2
union all
select 5, "Joseph", 2
union all
select 6, "Ben", 2;

select * from test.employee;

select e1.name as employee_name, e2.name as manager_name
from test.employee e1
inner join test.employee e2
on e1.manager_id = e2.employee_id;