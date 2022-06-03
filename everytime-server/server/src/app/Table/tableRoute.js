/*
module.exports = function(app){
    

};
*/

const express = require("express");
const router = express.Router();

const table = require('./tableController');
const jwtMiddleware = require('../../../config/jwtMiddleware');

// 34. 내 시간표 조회 API
// 로그인 시 일치하는 그 ID 값과 동일한 걸로 바꿔야할듯?
router.get('/app/table/:semesterId/:num', table.getMyTable);

// 35. 시간표에 과목 추가(+ 추가 시간표 ) API
router.route('/app/table').post(table.postMyTable);

// 36. 시간표에 과목 삭제 API
router.patch('/app/table/:subjectId', table.patchMyTable);


module.exports = router;
// jwt를 사용하기 위해 jwtMiddleware 를 체이닝 방식으로 추가하는 예제
// app.get('/app/users/:userId', jwtMiddleware, user.getUserById);