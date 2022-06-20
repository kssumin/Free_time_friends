const jwtMiddleware = require("../../../config/jwtMiddleware");
const tableProvider = require("../../app/Table/tableProvider");
const tableService = require("../../app/Table/tableService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 * API No. 34
 * API Name : 내 시간표 조회 API
 * [GET] /app/table/:semester/:num
 */
exports.getMyTable = async function (req, res) {
    const semesterId = req.params.semesterId;
    const num = req.params.num;


    // 빈 값 체크
    if (!semesterId || !num)
        return res.send(response(baseResponse.INPUT_EMPTY));

    // 공백 체크
    var re = /s$/;
    if(re.test(semesterId) || re.test(num))
        return res.send(response(baseResponse.INPUT_NOT_SPACE));

    // 숫자 형식 체크
    var regExp = /^[0-9]+$/;
    if(!regExp.test(semesterId) || !regExp.test(num))
        return res.send(response(baseResponse.INPUT_NUMBER));

    // 입력 형식 (1부터 시작해야 한다)
   if(semesterId < 1)
       return res.send(response(baseResponse.INPUT_SEMESTER_INDEX));
   if(num < 1)
       return res.send(response(baseResponse.INPUT_SEMESTER_INDEX2));



    const myTable = await tableProvider.retrieveMyTable(semesterId, num);
    
    return res.send(response({ "isSuccess": true, "code": 1000, "message": "시간표 조회 성공" }, myTable));
}

/**
 * API No. 35
 * API Name : 시간표에 과목 추가 API (동일한 학기에 다른 시간표 과목 추가)
 * [POST] /app/table
 */
exports.postMyTable = async function (req, res) {

    /**
     * Body: subjectId, userId, semester, num, semesterId
     */
    const { subjectId, userId, semester, num, semesterId } = req.body;
    console.log(subjectId, userId, semester, num, semesterId);
    // 빈 값 체크
    if (!subjectId || !userId || !semester || !num || !semesterId)
        return res.send(response(baseResponse.INPUT_EMPTY));

    // 공백 체크
    var re = /s$/;
    if (re.test(subjectId) || re.test(userId) || re.test(semester) || re.test(num) || re.test(semesterId))
        return res.send(response(baseResponse.INPUT_NOT_SPACE));

    // 숫자 형식 체크
    var regExp = /^[0-9]+$/;
    if (!regExp.test(subjectId) || !regExp.test(userId) || !regExp.test(num) || !regExp.test(semesterId))
        return res.send(response(baseResponse.INPUT_NUMBER));

    if(semesterId == 0)
        return res.send(response(baseResponse.INPUT_SEMESTER_INDEX));
    if(subjectId == 0)
        return res.send(response(baseResponse.SEARCH_NO_SUBJECT));

    // 길이 체크
    if (semester.length < 2 || semester.length > 100)
        if (semester.length < 2) {
            return res.send(response(baseResponse.INPUT_TITLE_LENGTH));
        } else
            return res.send(response(baseResponse.INPUT_TITLE_LENGTH2));

    let semesterArr = [
        '2018년 1학기', '2018년 여름학기', '2018년 2학기', '2018년 겨울학기',
        '2019년 1학기', '2019년 여름학기', '2019년 2학기', '2019년 겨울학기',
        '2020년 1학기', '2020년 여름학기', '2020년 2학기', '2020년 겨울학기',
        '2021년 1학기', '2021년 여름학기', '2021년 2학기', '2021년 겨울학기',
    ];
    if(!semesterArr.includes(semester))
        return res.send(response(baseResponse.INPUT_SEMESTER_WRONG));

    // 해당 과목 인덱스가 존재하는지 여부 +
    const isSubject = await tableProvider.isSubject(subjectId);
    if (isSubject.length < 1)
        return res.send(response(baseResponse.SEARCH_NO_SUBJECT));

    // 중복된 과목 추가인지 검사
    const redunSubject = await tableProvider.reSubject(subjectId);
    if (redunSubject.length > 0)
        return res.send(response(baseResponse.SEARCH_YES_SUBJECT));

    const postSubjectResponse = await tableService.postSubject(
        subjectId, userId, semester, num, semesterId
    );

    return res.send(postSubjectResponse);
}


/**
 * API No. 36
 * API Name : 시간표 과목 삭제 API
 * [PATCH] /app/table/:subjectId
 */

exports.patchMyTable = async function (req, res) {

    const subjectId = req.params.subjectId;

    // 빈값 체크
    if(!subjectId)
        return res.send(response(baseResponse.INPUT_EMPTY));

    // 해당 과목 ID 가 담겨있는지 체크
    const reMySubject = await tableProvider.redunSubject(subjectId);
    if(reMySubject.length < 1)
        return res.send(errResponse(baseResponse.SEARCH_NO_MySubject));

    console.log(reMySubject);

    const deleteSubject = await tableService.deleteSubject(subjectId);
    return res.send(deleteSubject);

};