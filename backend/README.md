## Digitalno obrazovanje Projekt - 2023/2024 (Backend)

`yarn`

`yarn start`

prettier:
`yarn format`


### DB
Create postgresql database named digobraz
populate .env attributes DB_USER and DB_PASSWORD
manually run startup.sql from persistence folder

### ENV
create file .env

```
PORT=3000
OPENAI_API_KEY=sk.....
DB_USER=
DB_PASSWORD=
```

## Testing
testable with postman collection in root folder

`/api/quiz` GET: returns list of all quizzes (without questions)

`/api/quiz` POST: creates new quiz (without questions) and returns newly created quiz

`/api/quiz/:id` PUT: updates quiz with id (without questions)

`/api/quiz/:id` GET: returns quiz with id and with its questions (without correct answer)

`/api/quiz/:id/add-questions` POST: adds questions to quiz (take care of correct quiz order number because it must be unique)

`/api/quiz/:id/check-answers` POST: checks answers for quiz with id and returns list of checked answers

