# A stored procedure is a subroutine available to applications that
# access a relational database system
# A Stored Procedure contains one or more SQL statements stored in
# the database
# Typical used for Data Validation as well Access Control Methods
# A Stored Procedure is often called a sproc or procedure
# Parameters are used to pass one or more values from calling program

use sakila;

select * from sakila.language;

delimiter //

create procedure GetLanguage()
begin 
	select * from sakila.language;
end //

delimiter ;

call GetLanguage();

drop procedure GetLanguage;

delimiter //

create procedure WhileLoop()
begin 
	declare i int default 1;
	while i < 6 do 
		select pow(i, i);
		set i = i + 1;
	end while;
end //

delimiter ;

call WhileLoop();

drop procedure WhileLoop;

delimiter //

create procedure ConcatName(FirstName varchar(100), LastName VarChar(100))
begin 
	declare FullName varchar(200);
	set FullName = concat(FirstName, ' ', LastName);
	select FullName;
end //

delimiter ;

call ConcatName("Vincent", "Du");

drop procedure ConcatName;

select * from language;

delimiter //

create procedure InsertValue(NameofLang varchar(100))
begin
	insert into language(name, last_update)
	values(NameofLang, Now());
	
	select Last_Insert_ID();
end //

delimiter ;

call InsertValue("Cantonese");
call InsertValue("Swedish");

drop procedure InsertValue;