### new Used TechStacks
1. resend - for email verification OTP(heavy pkge)
2. bcrypt - for password hashing(light pkge)

### Note
1. next.js run on edgetime 
    - it affect the db connection 
    1. always call when new api route is made
    2. when connecting, if the connection is already there then use that else connect.
2. api is a special file name under app dir for the api calls in next.js , instead of page.js we use route.js.
    - unlike express, here we have to directly give the methods like POST,GET and all
     ```js
     export async function POST(request:Request) {
        }
f
