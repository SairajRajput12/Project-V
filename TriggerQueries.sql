DELIMITER //
CREATE TRIGGER check_end_date
BEFORE INSERT ON your_table_name
FOR EACH ROW
BEGIN
    IF DATEDIFF(NEW.end, CURDATE()) = 0 THEN
        -- Your trigger logic here
        -- For example, you can signal an error or perform specific actions
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot insert with end date equal to current date';
    END IF;
END;
//
DELIMITER ;

--- jab election mein data add hoga tab election history mein data update hoga and winner jab election finish hoga to python ke through uska naam update hoga. 

DELIMITER //
CREATE TRIGGER add_deleted_election_to_history
BEFORE DELETE ON election
FOR EACH ROW 
BEGIN
    INSERT INTO election_history (election_name, winner, admin_id, election_id)
    VALUES (OLD.election_name, OLD.winner, OLD.admin_id, OLD.election_id);
END;
//
DELIMITER ;


DELETE FROM election WHERE end <= NOW();




--- what is pl/sql 
--- it is a combination of sql along with procedural features of programming languages. 
--- it is one of 3 key programming languages embeeded in oracle database along with sql itself java. 
--- tightly integrated with sql 
--- it offers extensive error checking  
--- it offers numerous data types 
--- it offers a numerous variety of programming languages 
--- it supports the structured programming languages through the functions and procedures 
--- it is one of 3 programming languages embedded in oracle database along with sql itself and java
--- oracle hi iski development dekhti hai 
--- it provides built-in ,interprete and os independent programming enviourment 
--- pl/sql can also directly called from command-line sql plus interface 
