ADD FULLTEXT INDEX
ALTER TABLE `AntNet_Alumni` ADD FULLTEXT(`Last_Name`, `First_Name`, `Class_Year`, `School_Name`, `Business_Name`, `Business_Category`, `Business_Street1`, `Business_City`, `Business_State`, `Business_Zipcode`, `Business_Country`)

DELETE FULLTEXT INDEX
ALTER TABLE `AntNet_Alumni` DROP INDEX `Last_Name`