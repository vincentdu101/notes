# http://dev.mysql.com/doc/refman/5.7/en/string-functions.html
select ASCII('a'), ASCII('A');

select char(77, 121, 13, 83, 81, 76);
select char(64);

select length('sqlauthority'), length('sqlauthority ');

select concat('sql', 'authori', 'ty');
select concat('sql', null, 'ty');

select lcase('SQLAuthority'), lower('pluralSIGHT');

select left('sqlauthority', 4), right('sqlauthority', 3);

# Case functions
set @var = 1;
select case @var 
	when 1 then "one"
	when 2 then "two"
	else "more" end 
as result;

select case when @var = 1 then "one"
			when @var 2 then "two"
			else "more" end as result;

select if(1 > 2, 2, 3);
select if(1 < 2, 'yes', 'no');

select if(year(now()) = 2014, "yes", "no");

select ifnull(1, 0);
select ifnull(null, 0);
select 1/0;
select ifnull(1/0, "yes");

select nullif(1, 1);
select nullif(1, 2);

# information function
select charset("sqlauthority");
select collation('sqlauthority');
select connection_id();
select current_user(), current_user;

use sakila;
select database(), schema();
select user();
select version();
 
# misc functions
select rand() as randomvalue;
select left(ceiling(rand() * 10), 1) as randomValue;
select now();
select sleep(4);
select now();

# universal unique identifier
select UUID();

# aggregate function
# operates on a series of values and returns a single value
use sakila;

# count number of rentals for each customer 
select count(*) NumRentals, customer_id
from rental
group by customer_id;

# displaying latest rental of movie by customer
select max(rental_date) last_rental_date, customer_id
from rental 
group by customer_id;

# displaying first rental of movie by customer
select min(rental_date) first_rental_date, customer_id
from rental
group by customer_id;

# average payment by each customer
select  avg(amount) AvgPayment, Sum(amount) TotPayment,
		count(rental_id) TotalRentals, customer_id
from payment
group by customer_id;