use platinum_development;

create view view_flights as
select * from platinum_development.flights; 

select * from view_flights;


# dynamically pass in table names to be selected
delimiter //

create procedure `select_view` (table_name varchar(255))

begin 
    set @table_name = table_name;
    set @sql_text = concat("select * from platinum_development.", @table_name);

    prepare stmt from @sql_text; 
    execute stmt;
    deallocate prepare stmt; 

end
//
delimiter ;  

drop procedure `select_view`;

call select_view('flights');
call select_view('segment_flights');
call select_view('flight_creatives');