# BBS-Blog-Koa-Mysql
A bbs written by Koa and Mysql

## The preparatory work 

1. A database named BBS in **mysql**, table building will be done automatically when program initialization.

2. Change the following configuration according to your situation:

   ![avator](https://github.com/ShyGodB/Pictures/blob/master/1.png?raw=true)
   
3. In order to solve the problem of project initialization no data, I provide a SQL script file, you can run the project first, and then connect to the mysql, create and select the BBS database, then running this script, it can be Add 1,9,270 pieces of data to table user, boards, and topic, each sub BBS contains 30 test data:
There is a command to run the script:
> Source 'your computer path' + /BBS-by-Koa-Mysql/public/sql/init.sql

## Run the project

Go to your project folder

>  git clone https://github.com/ShyGodB/BBS-by-Koa-Mysql.git
>
>  cd **BBS-by-Koa-Mysql**
>
>  npm install 
>
>  npm start

If everything is OK, you can see a BBS on your browser and the address is :

> http://localhost:3001



Admin background entry：  lower left corner of homepage

Administrator user name :   admin

Password:    admin

## A piece of my mind 

If you have any questions or Suggestions, please contact me, thank you！！！
