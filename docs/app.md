# App Folder

In this project we are using a pattern that is inspired by this [article](https://medium.freecodecamp.org/scaling-your-redux-app-with-ducks-6115955638be).
Most of the time we will work in the `/app/` folder for development.

## Domain Pattern

Idealnya semua komponen ditaruh dalam satu domain. Jadi misalnya ada komponen-komponen yang berhubungan dengan landing page kita taruh dalam `/app/landing`. Jika ada yang berhubungan dengan *user* berarti berada di dalam `/app/user`.

Jika ada komponen yang akan dipakai di lebih dari satu domain akan berada di dalam `/app/shared`.

Jika ada yang tidak berhubungan dengan tampilan UI misalnya *__helpers__* berarti berada di dalam `/app/utils`.

Sambil jalan kita bisa sama-sama untuk menentukan penamaan file.
