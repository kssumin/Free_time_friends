const {logger} = require("../../../config/winston.js");
//const {pool} = require("../../../config/database");
//const secret_config = require("../../../config/secret");
const tableProvider = require("./tableProvider");
const tableDao = require("./tableDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리
// 성적 입력
exports.inputGrade = async function( semester, subjectName, credit, subjectGrade, isMajor ){
    try{
        const insertGradeParams = [ semester, subjectName, credit, subjectGrade, isMajor ];

        const connection = await pool.getConnection(async (conn) => conn);

        const inputGradeResult = await gradeDao.inputGrade(connection, insertGradeParams);
        console.log(`추가된 포스트 : ${inputGradeResult[0].insertId}`)
        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message": "성적 입력 성공" });
    }
    catch (err){
        logger.error(`App - inputGrade Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// MySubject 추가
exports.postSubject = async function( subjectId, userId, semester, num, semesterId){
    try{
        const postSubjectParams = [ subjectId, userId, semester, num, semesterId ];

        const connection = await pool.getConnection(async (conn) => conn);

        const insertMySubjectResult = await tableDao.insertMySubject(connection, postSubjectParams);

        connection.release();
        return response({ "isSuccess": true, "code": 1000, "message": "해당과목 시간표 추가성공" });
    }
    catch (err){
        logger.error(`App - insertMySubject Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};


// 시간표 과목 삭제
exports.deleteSubject = async function(subjectId){
    try{

        const connection = await pool.getConnection(async (conn) => conn);

        const deleteSubjectResult = await tableDao.deleteSubject(connection, subjectId);
        console.log(`삭제된 카테고리 : ${deleteSubjectResult[0]}`)
        connection.release();

        return response({ "isSuccess": true, "code": 1000, "message": "시간표에서 과목 삭제 성공" }, {"Delete": subjectId });
    }
    catch (err){
        logger.error(`App - deleteSubject Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};
