# A view is commonly known as a virtual table
# A view is a virtual table based on the result set of the SQL statement
# A view consists of a SELECT statement that is stored as an object in the database
# The tables referenced in the Views are known as a base table
# Technically views do not store any data. The data are retrieved at run
# time from the base tables
# MySQL supports nested view – a view that is based on another view
# MySQL does not support materialized view

use sakila;

select * from actor;

create view vw_AllActor
as 
select * from actor;

select * from vw_AllActor;

select * 
from vw_AllActor 
where first_name like "A%";

create view vw_ActorA
as
select * 
from vw_AllActor 
where first_name like "A%";

select * from vw_ActorA;

select * 
from vw_ActorA
where last_name like "%A%"; 

create view vw_ActorAnA
as
select *
from vw_ActorA
where last_name like "%A%";

select * from vw_ActorAnA;

select * 
from vw_ActorAnA
order by last_name;

drop view vw_AllActor;
drop view vw_ActorA;
drop view vw_ActorAnA;

use sakila;

# problem
# find all the customer's payments which are 
# over their average payment
select pt.payment_id, cust.first_name, cust.last_name, amount, pt.rental_id
from payment pt
inner join customer cust on cust.customer_id = pt.customer_id
where amount > 
	(
		select avg(amount) 
		from payment pt1
		where pt1.customer_id = pt.customer_id
	);

create view CustPayment
as 
select pt.payment_id, cust.first_name, cust.last_name, amount, pt.rental_id
from payment pt
inner join customer cust on cust.customer_id = pt.customer_id
where amount > 
	(
		select avg(amount) 
		from payment pt1
		where pt1.customer_id = pt.customer_id
	);

select * from CustPayment;

select * from CustPayment cp
inner join rental r on r.rental_id = cp.rental_id;

drop view CustPayment;

# Data Security
use sakila;

select  pt.payment_id, pt.rental_id,
		cust.first_name, cust.last_name, amount
from payment pt
inner join customer cust on cust.customer_id = pt.customer_id
where payment_id > 100;

create view DataSecure
as 
select  pt.payment_id, pt.rental_id,
		cust.first_name, cust.last_name, amount
from payment pt
inner join customer cust on cust.customer_id = pt.customer_id
where payment_id > 100;

select * from DataSecure;

select payment_id, rental_id
from DataSecure
where payment_id = 1;

select payment_id, rental_id
from DataSecure
where payment_id > 200;

select email from DataSecure
where payment_id = 1;

drop view DataSecure;

# DML operation over view
use sakila;

select language_id, name, last_update
from sakila.language;

create view DMLOperation
as 
select language_id, name, last_update
from sakila.language;

select * from DMLOperation;

insert into DMLOperation(name, last_update)
values ("Hindi", Now());

select * from DMLOperation;

update DMLOperation
set name = 'Spanish'
where name = 'Hindi';

select * from DMLOperation;
select * from sakila.language;

delete 
from DMLOperation 
where name = 'Spanish';

select * from DMLOperation;

drop view DMLOperation;

# check option
# view created with check option will prevent 
# modifying a row in such a way that it would
# no longer be part of the view result
# DML Operation over view

use sakila;

select language_id, name, last_update
from language;

create view DMLOperation
as 
select language_id, name, last_update
from language
where last_update = "2006-02-15 05:02:19"
with check option;

select *
from DMLOperation;

# blocks this insert because date is different
# as specified as check option
insert into DMLOperation (name, last_update)
values ('Hindi', "2013-02-15 05:02:19");

insert into DMLOperation (name, last_update)
values ('Hindi', "2006-02-15 05:02:19");

select * from DMLOperation;

select * from language;

# blocks this update because date is different
# as specified as check option
update DMLOperation
set last_update = '2013-02-15 05:02:19'
where name = 'Spanish';

select * from DMLOperation;

update DMLOperation
set name = 'Spanish'
where name = 'Hindi';

select * from DMLOperation;

delete from DMLOperation
where name = 'Spanish';

select * from DMLOperation;

# remember: base table DML Insert
insert into language (name, last_update)
values ('Portuguese', '2013-02-05 05:02:19');

select language_id, name, last_update
from language;

update language
set last_update = '2013-02-15 05:02:19'
where name = 'German';

select * from DMLOperation;

select language_id, name, last_update
from language;

drop view DMLOperation;