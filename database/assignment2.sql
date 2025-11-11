--Number 1
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES 
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Number 2
UPDATE account 
SET account_type = 'Admin'
WHERE account_id = 1;

--Number 3
SELECT * FROM account;
DELETE FROM account
WHERE account_id = 1;

--Number 4 modifying GM Hummer
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior');

--Numer 5 Selecting with inner join
SELECT 
	inventory.inv_make,
	inventory.inv_model,
	classification.classification_name
FROM inventory
	JOIN classification
	ON inventory.classification_id = classification.classification_id
WHERE inventory.classification_id = 2;

--Number 6 Updating the inventory colums wirh REPLACE 
UPDATE inventory
SET 
	inv_image = REPLACE (inv_image, 'images/vehicles/vehicles', 'images/vehicles/'),
	inv_thumbnail = REPLACE (inv_thumbnail, 'images/vehicles/vehicles', 'images/vehicles/');

