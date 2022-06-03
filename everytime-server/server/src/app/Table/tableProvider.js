//const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston.js");

const tableDao = require("./tableDao");

// Provider: Read 비즈니스 로직 처리
// 34. 내 메인 시간표 조회
exports.retrieveMyTable= async function (semesterId, num) {
    const myTableParams = [ semesterId, num ];
    const connection = await pool.getConnection(async (conn) => conn);
    const selectMyTable = await tableDao.selectMyTable(connection, myTableParams);
    connection.release();

    return selectMyTable;
};

// 35. 과목 인덱스 존재 여부
exports.isSubject= async function (subjectId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const subjectRegisterResult = await tableDao.isSubjectRegister(connection, subjectId);
    connection.release();

    return subjectRegisterResult;
};

// 추가할 과목 검사 + 삭제 전에 과목 있는지 검사
exports.redunSubject = async function(subjectId){
    const connection = await pool.getConnection(async (conn) => conn);
    const reducSubjectResult = await tableDao.reSubject(connection, subjectId);
    connection.release();

    return reducSubjectResult;
};

