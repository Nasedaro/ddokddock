var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
var MemoryStore = require("memorystore")(session);
var bodyParser = require("body-parser");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require("http");

const socketIo = require("socket.io"); // socket.io 가져오기

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/member/login");
var tagRouter = require("./routes/study/tag");
var listRouter = require("./routes/study/list");
var detailRouter = require("./routes/study/detailList");
var chapterRouter = require("./routes/study/chapterList");
var commentRouter = require("./routes/study/study_question");
var profileRouter = require("./routes/mypage/profile_image");
var showstudyRouter = require("./routes/mypage/show_study");
var studyRouter = require("./routes/study/study");
var noticeRouter = require("./routes/notice/notice");
var questionRouter = require("./routes/question/question");
var answerRouter = require("./routes/answer/answer");
var chatRouter = require("./routes/chat/chat");
var answerCommentRouter = require("./routes/answer/answer_comment");
var questionLikesRouter = require("./routes/question/question_likes");

var app = express();
const server = http.createServer(app); // 서버 생성
const io = socketIo(server); // socket.io 서버와 연결

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 세션 설정
app.use(
  session({
    secret: "your secret key", // 세션을 암호화하기 위한 비밀키
    resave: false, // 세션을 항상 저장할지 결정 (false 권장)
    saveUninitialized: true, // 초기화되지 않은 세션을 저장소에 저장할지 결정
    store: new MemoryStore({ checkPeriod: 60 * 1000 }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 쿠키 유효기간 (예: 1일)
    },
  })
);


const cors = require('cors')

let corsOptions = {
  origin: '*',      // 출처 허용 옵션
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 등) 접근
}

app.use(cors(corsOptions))

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/study/tag", tagRouter); // localhost:3000/tag
app.use("/study/list", listRouter);
app.use("/study/detailList", detailRouter);
app.use("/study/chapterList", chapterRouter);
app.use("/study/study_question", commentRouter);
app.use("/study/study_", chapterRouter);
app.use("/study", studyRouter);
app.use("/mypage/profile_image", profileRouter);
app.use("/notice/notice", noticeRouter);
app.use("/mypage/show_study", showstudyRouter);
app.use("/question", questionRouter);
app.use("/question/likes", questionLikesRouter);
app.use("/answer", answerRouter);
app.use("/answer/comment", answerCommentRouter);

app.use(
  "/chat",
  (req, res, next) => {
    req.io = io;
    next();
  },
  chatRouter
);



// socket.io 설정
io.on("connection", socket => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(function (req, res, next) {
  console.log("404 Error: ", req.url);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error("Error handler: ", err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

console.log("Server started");

module.exports = app;
