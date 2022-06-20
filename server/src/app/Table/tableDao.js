// 년도별 + 해당학기의 추가 시간표 조회
async function selectMyTable(connection, myTableParams ){
    const selectMyTableQuery = `
        SELECT MS.semester, subjectName, professor, lectureRoom,

               CASE lectureDate1
                   WHEN 1 THEN '일'
                   WHEN 2 THEN '월'
                   WHEN 3 THEN '화'
                   WHEN 4 THEN '수'
                   WHEN 5 THEN '목'
                   WHEN 6 THEN '금'
                   WHEN 7 THEN '토'
                   END AS Day1,

               DATE_FORMAT( lectureStartTime1 , '%H:%i') AS startDay1,
               DATE_FORMAT( lectureEndTime1 , '%H:%i') AS endDay1,

               CASE lectureDate2
                   WHEN 1 THEN '일'
                   WHEN 2 THEN '월'
                   WHEN 3 THEN '화'
                   WHEN 4 THEN '수'
                   WHEN 5 THEN '목'
                   WHEN 6 THEN '금'
                   WHEN 7 THEN '토'
                   ELSE ''
                   END AS Day2,
               DATE_FORMAT( lectureStartTime2 , '%H:%i') AS startDay2,
               DATE_FORMAT( lectureEndTime2 , '%H:%i') AS endDay2

        FROM MySubject MS
        INNER JOIN Subject S ON S.subjectIdx = MS.subjectIdx
        WHERE MS.semesterIdx = ? AND num = ? AND MS.status != 0;
   
    `;
    const [myTableRow] = await connection.query(selectMyTableQuery, myTableParams);
    return myTableRow;
}

// 수업 과목 검색
async function isSubjectRegister(connection, subjectId){
    const isSubjectQuery = `  
           SELECT * FROM Subject WHERE subjectIdx = ? AND status != 0;
     `;
    const [isSubjectRow] = await connection.query(isSubjectQuery, subjectId);
    return isSubjectRow;
}

// MySubject 테이블에 추가 (장바구니 추가)
async function insertMySubject(connection, postSubjectParams){
    const insertMySubjectQuery = `
        INSERT INTO MySubject( subjectIdx, userId, semester, num, semesterIdx )
        VALUES (?, ?, ?, ?, ?);
     `;
    const [insertMySubjectRow] = await connection.query(insertMySubjectQuery, postSubjectParams);
    return insertMySubjectRow;
}

async  function reSubject(connection, subjectId){
    const redunSubjectQuery = `
        SELECT * FROM MySubject WHERE subjectIdx = ? AND status != 0;
     `;
    const [redunSubjectRow] = await connection.query(redunSubjectQuery, subjectId);
    return redunSubjectRow;
}
async  function deleteSubject(connection, subjectId){
    const redunSubjectQuery = `
        UPDATE MySubject SET status = 0 WHERE subjectIdx = ?;
     `;
    const [redunSubjectRow] = await connection.query(redunSubjectQuery, subjectId);
    return redunSubjectRow;
    }

module.exports = {
    selectMyTable,
    isSubjectRegister,
    insertMySubject,
    reSubject,
    deleteSubject
};


