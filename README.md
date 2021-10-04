# college-space

## Steps to get started
_If you cannot see some images here, please refresh the page or click image texts to see the images._

### Database Setup

* Then Open MySQL Workbench.

![Open Workbench](https://drive.google.com/uc?export=view&id=1vVgeFsfrmd4f_b9j4xltAvSm01EnxuIZ)

* Then, click on Local Instance.

![Local Instance](https://drive.google.com/uc?export=view&id=1MWXuPI0lgQk7itbHTZYtVAMNgdWFurLS)

* Now, type here `show databases;` and click on the ⚡ button to run the query.

![Show Databases](https://drive.google.com/uc?export=view&id=1QV1doMdCjqH19jixMrfWvmj5yfTotFnL)

* If, you see collegespace database in this list, then type this command `drop database collegespace`. This will delete the database;

![List Databases](https://drive.google.com/uc?export=view&id=1u_DWk34hsqwQ6KHG26goSVxB07zbfGSu) 
![Delete Database](https://drive.google.com/uc?export=view&id=1LnRXLmaxcoSLchsd4iXP8pfx2FgUPa-c)

* Now, write this command `create database collegespace` and click on the ⚡ button. This will create a fresh database;

![Create Database](https://drive.google.com/uc?export=view&id=1IdiF4PhhYswQjMpu0QIvCJKTJRu6eNqm)

* Now, Click on Database and then Connect to Database.

![Click Database](https://drive.google.com/uc?export=view&id=1uDvMd-fhqsLAIIyU_0lKYFYqxFprWdK8)
![Connect Database](https://drive.google.com/uc?export=view&id=1BvZ_kTtgUlTQaCIlrYMW675aV75OhhWi)

* Then, In this box, type `collegespace` and click `Ok`. Now `collegespace` database is connected. Now we can create the tables.

![Type Database Name](https://drive.google.com/uc?export=view&id=1xpIQrsZ4qA0w-UeUIXXckwo1kRcqdvWh)

* Here, for the Users table copy and paste this code ```CREATE TABLE `users` (
   `id` varchar(255) NOT NULL,
   `name` varchar(255) NOT NULL,
   `email` varchar(255) NOT NULL,
   `password` varchar(255) NOT NULL,
   `course` varchar(255) NOT NULL,
   `created_date` varchar(255) NOT NULL,
   `last_login` varchar(255) DEFAULT NULL,
   PRIMARY KEY (`email`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;``` and click on ⚡ button. This will create the users table.
 
 * Now, for Posts table, copy and paste this code ```CREATE TABLE `posts` (
   `id` varchar(255) NOT NULL,
   `created_by` varchar(255) DEFAULT NULL,
   `created_date` bigint DEFAULT NULL,
   `data` mediumtext,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;``` and click on ⚡ button. This will create posts table.
 
 Now the Database setup is complete.
 
 ### Starting the App
 
 * Now download this code in your system and open it in Visual Studio Code. 
 * Open the Terminal and type `python app.py` and click Enter.
 
 ![communique workflow](https://drive.google.com/uc?export=view&id=1Maei7pZhwzVzU3oWoPew6RxYbO9IKlSk)
 
 After this your app will be working. Go to [http://localhost:5000](http://localhost:5000)
