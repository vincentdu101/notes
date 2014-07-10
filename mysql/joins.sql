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
# NO MySQL support